/**
 * app.routes.ts – Configuración de rutas de la aplicación ARQBIT LABS.
 *
 * Define las 7 rutas principales de la SPA y el wildcard de redirección.
 * La ruta /admin está protegida por authGuard (requiere autenticación).
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },                                    // Página de inicio
  { path: 'servicios', component: CatalogComponent },                        // Catálogo de servicios
  { path: 'servicios/:id', component: ServiceDetailComponent },              // Detalle del servicio (ruta dinámica)
  { path: 'contacto', component: ContactComponent },                         // Formulario de contacto
  { path: 'favoritos', component: FavoritesComponent },                      // Servicios favoritos del usuario
  { path: 'login', component: LoginComponent },                              // Inicio de sesión del administrador
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },    // Panel CRUD (protegido)
  { path: '**', redirectTo: '' }                                             // Ruta no encontrada → redirige a Home
];
