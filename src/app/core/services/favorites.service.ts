import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'arqbit_favorites';
  private favoritesSubject = new BehaviorSubject<number[]>(this.loadFromStorage());
  favorites$ = this.favoritesSubject.asObservable();

  private loadFromStorage(): number[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(ids: number[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
  }

  getFavorites(): number[] {
    return this.favoritesSubject.value;
  }

  isFavorite(id: number): boolean {
    return this.favoritesSubject.value.includes(id);
  }

  toggleFavorite(id: number): void {
    let current = this.favoritesSubject.value;
    if (current.includes(id)) {
      current = current.filter(fid => fid !== id);
    } else {
      current = [...current, id];
    }
    this.saveToStorage(current);
    this.favoritesSubject.next(current);
  }

  removeFavorite(id: number): void {
    const current = this.favoritesSubject.value.filter(fid => fid !== id);
    this.saveToStorage(current);
    this.favoritesSubject.next(current);
  }

  getCount(): number {
    return this.favoritesSubject.value.length;
  }
}
