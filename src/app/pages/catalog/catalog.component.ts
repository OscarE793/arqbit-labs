/**
 * catalog.component.ts – Vista de catálogo de servicios de ARQBIT LABS.
 *
 * Muestra todos los servicios en un grid responsive con filtro por
 * categoría mediante chips. Los servicios se obtienen reactivamente
 * del ServicesDataService. Incluye animaciones GSAP al filtrar.
 */
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ServicesDataService } from '../../core/services/services-data.service';
import { Service } from '../../core/models/service.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  services: Service[] = [];
  filteredServices: Service[] = [];
  activeCategory = 'Todos';
  categories = ['Todos', 'Desarrollo', 'Cloud', 'Seguridad', 'Soporte IT', 'Consultoría', 'DevOps'];
  private ctx!: gsap.Context;

  constructor(
    private servicesData: ServicesDataService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.servicesData.getAll().subscribe(data => {
      this.services = data;
      this.filteredServices = data;
    });
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Page header animation
      const headerTl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });
      headerTl
        .from('.catalog-title', { y: 40, autoAlpha: 0 })
        .from('.catalog-subtitle', { y: 20, autoAlpha: 0 }, '-=0.4');

      // Filter chips animation
      gsap.from('.filter-chip', {
        y: 20,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.3
      });

      // Service cards batch entrance
      ScrollTrigger.batch('.catalog-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 60,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: 'power2.out'
          });
        },
        start: 'top 90%'
      });
    }, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  filterByCategory(category: string): void {
    this.activeCategory = category;
    if (category === 'Todos') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(s => s.category === category);
    }

    // Animate filtered cards
    setTimeout(() => {
      gsap.from('.catalog-card', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }, 50);
  }
}
