import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../../core/services/favorites.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {
  mobileMenuOpen = false;
  favCount = 0;
  isAuthenticated = false;
  private subs: Subscription[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.subs.push(
      this.favoritesService.favorites$.subscribe(favs => {
        this.favCount = favs.length;
      })
    );
    this.subs.push(
      this.authService.isAuthenticated$.subscribe(v => {
        this.isAuthenticated = v;
      })
    );
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
