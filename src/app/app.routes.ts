import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'servicios', component: CatalogComponent },
  { path: 'servicios/:id', component: ServiceDetailComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'favoritos', component: FavoritesComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
