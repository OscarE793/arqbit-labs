import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesDataService } from '../../core/services/services-data.service';
import { Service } from '../../core/models/service.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactForm!: FormGroup;
  services: Service[] = [];
  submitted = false;
  showSuccess = false;
  private ctx!: gsap.Context;

  constructor(
    private fb: FormBuilder,
    private servicesData: ServicesDataService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      service: [''],
      message: ['', Validators.required]
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
        .from('.contact-title', { y: 40, autoAlpha: 0 })
        .from('.contact-subtitle', { y: 20, autoAlpha: 0 }, '-=0.4');

      // Info cards staggered
      gsap.from('.info-card', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.info-cards-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // Form slide in
      gsap.from('.contact-form-wrapper', {
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-form-wrapper',
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
    if (this.contactForm.valid) {
      this.showSuccess = true;
      // Success message animation
      setTimeout(() => {
        gsap.from('.success-banner', {
          y: -20,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }, 50);
      this.contactForm.reset();
      this.submitted = false;
      setTimeout(() => this.showSuccess = false, 5000);
    }
  }

  get f() {
    return this.contactForm.controls;
  }
}
