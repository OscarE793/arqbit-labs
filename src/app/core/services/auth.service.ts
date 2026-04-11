import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Simple client-side auth for the ARQBIT LABS admin panel.
 * - Hardcoded credentials (demo): admin / arqbit2026
 * - Persists session in localStorage under 'arqbit_auth_token'
 *
 * NOTE: This is a front-end-only simulation. A real production app MUST
 * authenticate against a server with proper password hashing and JWT.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'arqbit_auth_token';
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'arqbit2026';

  private authState$ = new BehaviorSubject<boolean>(this.hasValidToken());
  readonly isAuthenticated$: Observable<boolean> = this.authState$.asObservable();

  private hasValidToken(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return this.authState$.value;
  }

  login(username: string, password: string): boolean {
    if (username === this.ADMIN_USER && password === this.ADMIN_PASS) {
      const token = btoa(`${username}:${Date.now()}`);
      try {
        localStorage.setItem(this.TOKEN_KEY, token);
      } catch {}
      this.authState$.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch {}
    this.authState$.next(false);
  }
}
