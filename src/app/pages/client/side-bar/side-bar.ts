import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Role } from '../../../interfaces/Role';
import { UtilisateurService } from '../../../services/utilisateur-service';
import { MenuItem } from './MenuItem';
import { CLIENT_MENU, FULL_MENU, PROPRIETAIRE_MENU } from './menu-data'; // ✅ importation des menus

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.css']
})
export class SideBar implements OnInit {
  showSubmenus: { [key: string]: boolean } = {};
  isMobile = false;
  sidebarOpen = false;

  constructor(public utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleSubmenu(title: string) {
    this.showSubmenus[title] = !this.showSubmenus[title];
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /** 🔹 Sidebar visible pour ADMIN ou PROPRIETAIRE */
  showSidebar(): boolean {
    // Ne pas afficher le sidebar pendant l'initialisation
    if (this.utilisateurService.isInitializing()) {
      return false;
    }

    const user = this.utilisateurService.currentUser();
    return user?.roles?.some((r: Role) => ['ADMIN', 'PROPRIETAIRE','CLIENT'].includes(r.name)) || false;
  }

  /** 🔹 Vérifie si l'application est en cours d'initialisation */
  isInitializing(): boolean {
    return this.utilisateurService.isInitializing();
  }

  /** 🔹 Retourne le menu selon le rôle */
  getMenu(): MenuItem[] {
  const user = this.utilisateurService.currentUser();
  if (!user || !user.roles) return [];

  let menu: MenuItem[] = [];

  // Si l'utilisateur est ADMIN → menu complet + client
  if (user.roles.some(r => r.name === 'ADMIN')) {
    menu = FULL_MENU.concat(CLIENT_MENU);
  }
  // Si l'utilisateur est PROPRIETAIRE → son menu + client
  else if (user.roles.some(r => r.name === 'PROPRIETAIRE')) {
    menu = PROPRIETAIRE_MENU.concat(CLIENT_MENU);
  }
  // Si l'utilisateur est CLIENT uniquement
  else if (user.roles.some(r => r.name === 'CLIENT')) {
    menu = CLIENT_MENU;
  }

  return menu;
}

  /** 🔹 Vérifie le rôle spécifique */
  hasRole(roleName: string): boolean {
    const user = this.utilisateurService.currentUser();
    return user?.roles?.some(r => r.name === roleName) || false;
  }
}
