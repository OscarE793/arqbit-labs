import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesDataService {
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  services$ = this.servicesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadServices();
  }

  private loadServices(): void {
    this.http.get<Service[]>('assets/data/services.json').subscribe(data => {
      this.servicesSubject.next(data);
    });
  }

  getAll(): Observable<Service[]> {
    return this.services$;
  }

  getById(id: number): Service | undefined {
    return this.servicesSubject.value.find(s => s.id === id);
  }

  getByCategory(category: string): Service[] {
    if (category === 'Todos') {
      return this.servicesSubject.value;
    }
    return this.servicesSubject.value.filter(s => s.category === category);
  }

  addService(service: Omit<Service, 'id'>): void {
    const current = this.servicesSubject.value;
    const maxId = current.length > 0 ? Math.max(...current.map(s => s.id)) : 0;
    const newService: Service = { ...service, id: maxId + 1 } as Service;
    this.servicesSubject.next([...current, newService]);
  }

  deleteService(id: number): void {
    const current = this.servicesSubject.value.filter(s => s.id !== id);
    this.servicesSubject.next(current);
  }
}
