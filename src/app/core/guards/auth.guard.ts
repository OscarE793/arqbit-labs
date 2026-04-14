/**
 * auth.guard.ts – Guard funcional que protege la ruta /admin.
 *
 * Usa la API CanActivateFn de Angular 17 (sin clase).
 * Si el usuario no está autenticado, redirige a /login.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Permite el acceso si hay sesión activa; de lo contrario redirige a login
  if (auth.isAuthenticated) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
