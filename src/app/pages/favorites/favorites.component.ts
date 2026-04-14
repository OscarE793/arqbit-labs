/**
 * favorites.component.ts – Vista de servicios favoritos del usuario.
 *
 * Muestra los servicios guardados en formato de filas horizontales.
 * Se suscribe a FavoritesService.favorites$ para actualización reactiva.
 * La eliminación incluye animación GSAP de salida antes de remover.
 * Los datos persisten en localStorage entre sesiones del navegador.
 */
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { ServicesDataService } from '../../core/services/services-data.service';
import { Service } from '../../core/models/service.model';
import { gsap } from 'gsap';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit, AfterViewInit, OnDestroy {
  favoriteServices: Service[] = [];
  private ctx!: gsap.Context;

  constructor(
    private favoritesService: FavoritesService,
    private servicesData: ServicesDataService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(favIds => {
      this.servicesData.getAll().subscribe(services => {
        this.favoriteServices = services.filter(s => favIds.includes(s.id));
        setTimeout(() => this.animateItems(), 100);
      });
    });
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Header animation
      const headerTl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });
      headerTl
        .from('.fav-title', { y: 40, autoAlpha: 0 })
        .from('.fav-subtitle', { y: 20, autoAlpha: 0 }, '-=0.4');
    }, this.el.nativeElement);
  }

  private animateItems(): void {
    setTimeout(() => {
      gsap.from('.fav-item', {
        x: -40,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: 'power2.out'
      });
      gsap.from('.empty-state', {
        scale: 0.9,
        autoAlpha: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    }, 50);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  removeFavorite(id: number): void {
    // Animate out the item before removing
    const items = this.el.nativeElement.querySelectorAll('.fav-item');
    const targetItem = Array.from(items).find((item: any) =>
      item.querySelector(`[data-service-id="${id}"]`)
    ) as HTMLElement;

    if (targetItem) {
      gsap.to(targetItem, {
        x: 60,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.favoritesService.removeFavorite(id);
        }
      });
    } else {
      this.favoritesService.removeFavorite(id);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  }
}
