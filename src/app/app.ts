import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./pages/visiteur/footer/footer";
import { Header } from "./pages/visiteur/header/header";
import{CommonModule } from '@angular/common';
import { SideBar } from "./pages/client/side-bar/side-bar";
import { UtilisateurService } from './services/utilisateur-service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
registerLocaleData(localeFr);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, Header, CommonModule, SideBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('auth-Front');
  constructor(public utilisateurService:UtilisateurService){};


  showSidebar = computed(() => {
    const user = this.utilisateurService.currentUser();
    if (!user || !user.roles) return false;
    return user.roles.some(r => ['CLIENT', 'PROPRIETAIRE', 'ADMIN'].includes(r.name));
  });

}
