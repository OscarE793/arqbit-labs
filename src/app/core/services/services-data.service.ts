import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Service } from '../models/service.model';

/**
 * Services data store for ARQBIT LABS.
 *
 * Strategy:
 * 1. On init, try to hydrate from localStorage ('arqbit_services').
 * 2. If no localStorage data, fetch /assets/data/services.json (seed)
 *    and immediately persist to localStorage.
 * 3. All CRUD operations update both the BehaviorSubject and localStorage
 *    so changes made from the Admin panel survive page reloads.
 */
@Injectable({ providedIn: 'root' })
export class ServicesDataService {
  private readonly STORAGE_KEY = 'arqbit_services';
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  services$ = this.servicesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadServices();
  }

  private loadServices(): void {
    const cached = this.readFromStorage();
    if (cached && cached.length > 0) {
      this.servicesSubject.next(cached);
      return;
    }

    this.http.get<Service[]>('assets/data/services.json').subscribe({
      next: data => {
        this.servicesSubject.next(data);
        this.writeToStorage(data);
      },
      error: () => this.servicesSubject.next([])
    });
  }

  private readFromStorage(): Service[] | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Service[]) : null;
    } catch {
      return null;
    }
  }

  private writeToStorage(data: Service[]): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  private commit(data: Service[]): void {
    this.servicesSubject.next(data);
    this.writeToStorage(data);
  }

  getAll(): Observable<Service[]> {
    return this.services$;
  }

  getById(id: number): Service | undefined {
    return this.servicesSubject.value.find(s => s.id === id);
  }

  getByCategory(category: string): Service[] {
    if (category === 'Todos') return this.servicesSubject.value;
    return this.servicesSubject.value.filter(s => s.category === category);
  }

  addService(service: Omit<Service, 'id'>): Service {
    const current = this.servicesSubject.value;
    const maxId = current.length > 0 ? Math.max(...current.map(s => s.id)) : 0;
    const newService: Service = { ...service, id: maxId + 1 } as Service;
    this.commit([...current, newService]);
    return newService;
  }

  updateService(id: number, patch: Partial<Service>): Service | undefined {
    const current = this.servicesSubject.value;
    const idx = current.findIndex(s => s.id === id);
    if (idx === -1) return undefined;
    const updated: Service = { ...current[idx], ...patch, id };
    const next = [...current];
    next[idx] = updated;
    this.commit(next);
    return updated;
  }

  deleteService(id: number): void {
    const current = this.servicesSubject.value.filter(s => s.id !== id);
    this.commit(current);
  }

  /** Reset store to the bundled seed (assets/data/services.json). */
  resetToSeed(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {}
    this.loadServices();
  }
}
