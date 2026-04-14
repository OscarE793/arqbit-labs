/**
 * service-detail.component.ts – Vista detallada de un servicio.
 *
 * Carga el servicio por su ID obtenido de la ruta dinámica /servicios/:id.
 * Muestra imagen, descripción completa, lista de características,
 * tags tecnológicos y sidebar con precio. Permite agregar/quitar de
 * favoritos. Animaciones GSAP con ScrollTrigger para entrada progresiva.
 */
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicesDataService } from '../../core/services/services-data.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Service } from '../../core/models/service.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-detail.component.html'
})
export class ServiceDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  service: Service | undefined;
  private ctx!: gsap.Context;

  constructor(
    private route: ActivatedRoute,
    private servicesData: ServicesDataService,
    private favoritesService: FavoritesService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.servicesData.getAll().subscribe(services => {
      this.service = services.find(s => s.id === id);
      // Animate after data loads
      setTimeout(() => this.initAnimations(), 100);
    });
  }

  ngAfterViewInit(): void {}

  private initAnimations(): void {
    this.ctx = gsap.context(() => {
      // Breadcrumb fade in
      gsap.from('.breadcrumb-nav', { y: -10, autoAlpha: 0, duration: 0.5, ease: 'power2.out' });

      // Hero detail animation
      const heroTl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });
      heroTl
        .from('.detail-image', { x: -60, autoAlpha: 0 })
        .from('.detail-meta', { y: 20, autoAlpha: 0, stagger: 0.1 }, '-=0.4')
        .from('.detail-title', { y: 30, autoAlpha: 0 }, '-=0.4')
        .from('.detail-description', { y: 20, autoAlpha: 0 }, '-=0.3')
        .from('.detail-buttons', { y: 20, autoAlpha: 0 }, '-=0.3');

      // Features with ScrollTrigger
      ScrollTrigger.batch('.feature-item', {
        onEnter: (elements) => {
          gsap.from(elements, {
            x: -30,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out'
          });
        },
        start: 'top 90%'
      });

      // Sidebar cards
      gsap.from('.sidebar-card', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.sidebar-area',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

    }, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  get isFavorite(): boolean {
    return this.service ? this.favoritesService.isFavorite(this.service.id) : false;
  }

  toggleFavorite(): void {
    if (this.service) {
      this.favoritesService.toggleFavorite(this.service.id);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  }
}
