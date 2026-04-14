/**
 * admin.component.ts – Panel de administración (CRUD) de ARQBIT LABS.
 *
 * Funcionalidades:
 * - Crear nuevos servicios con formulario reactivo validado
 * - Editar servicios existentes (patchValue al formulario)
 * - Eliminar servicios con confirmación y animación de salida
 * - Buscar servicios por nombre o categoría
 * - Paginación (6 servicios por página)
 * - Resetear catálogo al seed original (services.json)
 *
 * Ruta protegida por authGuard: requiere autenticación previa en /login.
 * Todas las operaciones CRUD persisten en localStorage vía ServicesDataService.
 */
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesDataService } from '../../core/services/services-data.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Service } from '../../core/models/service.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Modo del formulario: crear un nuevo servicio o editar uno existente */
type Mode = 'create' | 'edit';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  serviceForm!: FormGroup;
  services: Service[] = [];
  submitted = false;
  showSuccess = false;
  successMessage = '';
  mode: Mode = 'create';
  editingId: number | null = null;
  searchTerm = '';
  currentPage = 1;
  pageSize = 6;
  categories = ['Desarrollo', 'Cloud', 'Seguridad', 'Soporte IT', 'Consultoría', 'DevOps'];
  modalities = ['Remoto', 'Híbrido', 'Presencial', 'Por definir'];
  statuses = ['active', 'beta', 'inactive'];

  private ctx!: gsap.Context;

  constructor(
    private fb: FormBuilder,
    private servicesData: ServicesDataService,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      fullDescription: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      duration: ['Por definir'],
      modality: ['Remoto'],
      status: ['active']
    });

    this.servicesData.getAll().subscribe(data => {
      this.services = data;
    });
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from('.admin-title', { y: 40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' });
      gsap.from('.admin-subtitle', { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power3.out', delay: 0.2 });
      gsap.from('.admin-form', { x: -50, autoAlpha: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 });
      gsap.from('.admin-table', { x: 50, autoAlpha: 0, duration: 0.7, ease: 'power2.out', delay: 0.3 });
    }, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  get f() {
    return this.serviceForm.controls;
  }

  get filteredServices(): Service[] {
    if (!this.searchTerm.trim()) return this.services;
    const q = this.searchTerm.toLowerCase();
    return this.services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }

  get paginatedServices(): Service[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredServices.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredServices.length / this.pageSize));
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
  }

  goToPage(n: number): void {
    if (n < 1 || n > this.totalPages) return;
    this.currentPage = n;
  }

  startCreate(): void {
    this.mode = 'create';
    this.editingId = null;
    this.submitted = false;
    this.serviceForm.reset({
      name: '',
      category: '',
      description: '',
      fullDescription: '',
      price: 0,
      imageUrl: '',
      duration: 'Por definir',
      modality: 'Remoto',
      status: 'active'
    });
  }

  startEdit(service: Service): void {
    this.mode = 'edit';
    this.editingId = service.id;
    this.submitted = false;
    this.serviceForm.patchValue({
      name: service.name,
      category: service.category,
      description: service.description,
      fullDescription: service.fullDescription,
      price: service.price,
      imageUrl: service.imageUrl,
      duration: service.duration,
      modality: service.modality,
      status: service.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.startCreate();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const v = this.serviceForm.value;
    const payload = {
      name: v.name,
      category: v.category,
      description: v.description,
      fullDescription: v.fullDescription || v.description,
      price: Number(v.price),
      imageUrl: v.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      duration: v.duration || 'Por definir',
      modality: v.modality || 'Remoto',
      features: [] as string[],
      techTags: [] as string[],
      status: v.status || 'active'
    };

    if (this.mode === 'edit' && this.editingId !== null) {
      this.servicesData.updateService(this.editingId, payload);
      this.successMessage = 'Servicio actualizado correctamente';
    } else {
      this.servicesData.addService(payload);
      this.successMessage = 'Servicio creado correctamente';
    }

    this.showSuccess = true;
    setTimeout(() => {
      gsap.from('.admin-success', {
        y: -10, autoAlpha: 0, duration: 0.4, ease: 'back.out(1.7)'
      });
    }, 50);
    setTimeout(() => (this.showSuccess = false), 3000);

    this.startCreate();
  }

  deleteService(service: Service): void {
    if (!confirm(`¿Eliminar definitivamente "${service.name}"?`)) return;

    const row = this.el.nativeElement.querySelector(`[data-row-id="${service.id}"]`) as HTMLElement;
    if (row) {
      gsap.to(row, {
        x: 40,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => this.servicesData.deleteService(service.id)
      });
    } else {
      this.servicesData.deleteService(service.id);
    }

    if (this.editingId === service.id) this.cancelEdit();
  }

  resetCatalog(): void {
    if (!confirm('Esto restaurará el catálogo a los valores iniciales. ¿Continuar?')) return;
    this.servicesData.resetToSeed();
    this.startCreate();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  }
}
