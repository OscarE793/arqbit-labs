import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceCardComponent } from '../../shared/components/service-card/service-card.component';
import { ServicesDataService } from '../../core/services/services-data.service';
import { Service } from '../../core/models/service.model';
import { Testimonial } from '../../core/models/testimonial.model';
import { HttpClient } from '@angular/common/http';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ServiceCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  featuredServices: Service[] = [];
  testimonials: Testimonial[] = [];
  private ctx!: gsap.Context;

  stats = [
    { value: '150+', label: 'Proyectos Completados' },
    { value: '98%', label: 'Satisfacción del Cliente' },
    { value: '24/7', label: 'Soporte Técnico' },
    { value: '5+', label: 'Años de Experiencia' }
  ];

  constructor(
    private servicesData: ServicesDataService,
    private http: HttpClient,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.servicesData.getAll().subscribe(services => {
      this.featuredServices = services.slice(0, 3);
    });

    this.http.get<Testimonial[]>('assets/data/testimonials.json').subscribe(data => {
      this.testimonials = data;
    });
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Hero Section Animation Timeline
      const heroTl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });

      heroTl
        .from('.hero-badge', { y: -30, autoAlpha: 0 })
        .from('.hero-title', { y: 40, autoAlpha: 0 }, '-=0.4')
        .from('.hero-description', { y: 30, autoAlpha: 0 }, '-=0.4')
        .from('.hero-buttons', { y: 20, autoAlpha: 0 }, '-=0.3')
        .from('.floating-card', {
          scale: 0.5,
          autoAlpha: 0,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          duration: 0.6
        }, '-=0.4');

      // Stats Bar - count up effect with ScrollTrigger
      gsap.from('.stat-item', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // Featured Services Section
      gsap.from('.section-header', {
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.featured-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      // Service Cards staggered entrance
      ScrollTrigger.batch('.service-card-wrapper', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 60,
            autoAlpha: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out'
          });
        },
        start: 'top 85%'
      });

      // Testimonials Section
      gsap.from('.testimonials-header', {
        y: 40,
        autoAlpha: 0,
        duration: 0.7,
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      ScrollTrigger.batch('.testimonial-card', {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 50,
            autoAlpha: 0,
            scale: 0.95,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power2.out'
          });
        },
        start: 'top 85%'
      });

      // CTA Banner
      gsap.from('.cta-content', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

    }, this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
