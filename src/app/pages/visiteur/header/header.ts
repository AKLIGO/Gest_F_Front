import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../services/utilisateur-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {

  isAuthenticated = computed(() => this.authServices.isAuthenticatedd());
  user = computed(() => this.authServices.currentUser());
  isLoading = computed(() => this.authServices.isLoading());
  isInitializing = computed(() => this.authServices.isInitializing());

  currentRoute: string = '';
  showPublicMenus: boolean = false; // État pour afficher/masquer les menus publics

  constructor(private authServices: UtilisateurService, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  hideInscriptionButton(): boolean {
    // Ne pas cacher pendant l'initialisation
    if (this.isInitializing()) {
      return false;
    }
    return this.isAuthenticated() || this.currentRoute === '/login';
  }

  hideConnexionButton(): boolean {
    // Ne pas cacher pendant l'initialisation
    if (this.isInitializing()) {
      return false;
    }
    return this.isAuthenticated();
  }

  logout(): void {
    this.authServices.setLoading(true);
    this.authServices.logout().subscribe({
      next: () => {
        this.authServices.logoutt();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.authServices.logoutt();
        this.router.navigate(['/']);
      },
      complete: () => this.authServices.setLoading(false)
    });
  }

  getUserDisplayName(): string {
    const currentUser = this.user();
    return currentUser ? `${currentUser.nom || ''} ${currentUser.prenoms || ''}`.trim() || currentUser.email || 'utilisateur' : 'utilisateur';
  }

  // Vérifier si l'utilisateur est ADMIN ou PROPRIETAIRE
  isAdminOrProprietaire(): boolean {
    const currentUser = this.user();
    if (!currentUser || !currentUser.roles || currentUser.roles.length === 0) {
      return false;
    }
    // Vérifier tous les rôles, pas seulement le premier
    return currentUser.roles.some(role => {
      const roleName = role?.name?.toUpperCase();
      return roleName === 'ADMIN' || roleName === 'PROPRIETAIRE';
    });
  }

  // Vérifier si les menus publics doivent être affichés
  shouldShowPublicMenus(): boolean {
    // Si non connecté, toujours afficher les menus
    if (!this.isAuthenticated()) {
      return true;
    }
    // Si ADMIN ou PROPRIETAIRE, afficher selon l'état du toggle
    if (this.isAdminOrProprietaire()) {
      return this.showPublicMenus;
    }
    // Pour les autres rôles (CLIENT), toujours afficher
    return true;
  }

  // Toggle l'affichage des menus publics
  togglePublicMenus(): void {
    this.showPublicMenus = !this.showPublicMenus;
  }
}