import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesDataService } from '../../core/services/services-data.service';
import { Service } from '../../core/models/service.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  categories = ['Desarrollo', 'Cloud', 'Seguridad', 'Soporte IT', 'Consultoría', 'DevOps'];
  private ctx!: gsap.Context;

  constructor(
    private fb: FormBuilder,
    private servicesData: ServicesDataService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });

    this.servicesData.getAll().subscribe(data => {
      this.services = data;
    });
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Header animation
      const headerTl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });
      headerTl
        .from('.admin-title', { y: 40, autoAlpha: 0 })
        .from('.admin-subtitle', { y: 20, autoAlpha: 0 }, '-=0.4');

      // Form slide in from left
      gsap.from('.admin-form', {
        x: -50,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.admin-content',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // Table slide in from right
      gsap.from('.admin-table', {
        x: 50,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.admin-content',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;
      const newService = {
        name: formValue.name,
        category: formValue.category,
        description: formValue.description,
        fullDescription: formValue.description,
        price: Number(formValue.price),
        imageUrl: formValue.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        duration: 'Por definir',
        modality: 'Por definir',
        features: [],
        techTags: [],
        status: 'active'
      };
      this.servicesData.addService(newService);
      this.serviceForm.reset();
      this.submitted = false;
      this.showSuccess = true;

      // Animate success message
      setTimeout(() => {
        gsap.from('.admin-success', {
          y: -10,
          autoAlpha: 0,
          duration: 0.4,
          ease: 'back.out(1.7)'
        });
      }, 50);

      setTimeout(() => this.showSuccess = false, 3000);

      // Animate new table row
      setTimeout(() => {
        const rows = this.el.nativeElement.querySelectorAll('.table-row');
        const lastRow = rows[rows.length - 1];
        if (lastRow) {
          gsap.from(lastRow, {
            x: -30,
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      }, 100);
    }
  }

  deleteService(id: number): void {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      // Find and animate out the row
      const rows = this.el.nativeElement.querySelectorAll('.table-row');
      const targetRow = Array.from(rows).find((row: any) =>
        row.getAttribute('data-id') === String(id)
      ) as HTMLElement;

      if (targetRow) {
        gsap.to(targetRow, {
          x: 40,
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            this.servicesData.deleteService(id);
          }
        });
      } else {
        this.servicesData.deleteService(id);
      }
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  }

  get f() {
    return this.serviceForm.controls;
  }
}
