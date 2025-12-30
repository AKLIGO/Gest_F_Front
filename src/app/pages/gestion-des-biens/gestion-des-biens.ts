import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceApp } from '../../services/serviceApp/service-app';
import { ServiceImm } from '../../services/servicesImm/service-imm';
import { UtilisateurService } from '../../services/utilisateur-service';
import { ImmeubleCreate } from '../../interfaces/gestions/Immeuble/ImmeubleCreate';
import { TypeAppartement } from '../../interfaces/gestions/Appartement/TypeAppartement';
import { StatutAppartement } from '../../interfaces/gestions/Appartement/StatutAppartement';
import { AppartementCreate } from '../../interfaces/gestions/Appartement/AppartementCreate';
import { Utilisateurs } from '../../interfaces/Utilisateurs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-des-biens',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-des-biens.html',
  styleUrls: ['./gestion-des-biens.css']
})
export class GestionDesBiens implements OnInit {

  ajoutForm: FormGroup;
  immeubleOptions: ImmeubleCreate[] = [];
  appartements: AppartementCreate[] = [];
  isEditMode = false;
  editingAppartementId?: number;
  currentUser: Utilisateurs | null = null;
  isProprietaire = false;
  isAdmin = false;
  message: string = '';

  typeOptions = Object.values(TypeAppartement);
  statutOptions = Object.values(StatutAppartement);

  constructor(
    private fb: FormBuilder,
    private serviceApp: ServiceApp,
    private serviceImm: ServiceImm,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {
    this.ajoutForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(1)]],
      numero: [0, Validators.required],
      superficie: ['', Validators.required],
      nbrDePieces: [0, Validators.required],
      description: [''],
      type: [null, Validators.required],
      statut: [null, Validators.required],
      localisation:[null,Validators.required],
      immeubleId: [null]
    });
  }

  getImmeubleNom(app: AppartementCreate): string {
    if (!app.immeubleId) {
      return 'Non défini';
    }

    if (!this.immeubleOptions || this.immeubleOptions.length === 0) {
      return 'Chargement...';
    }

    const immeuble = this.immeubleOptions.find(i => 
      i.id === app.immeubleId || i.id === Number(app.immeubleId)
    );
    
    return immeuble ? immeuble.nom : 'Non trouvé';
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadImmeubles();
  }

  loadCurrentUser(): void {
    this.currentUser = this.utilisateurService.currentUser();
    if (this.currentUser) {
      this.checkUserRoles();
      this.loadAppartements();
    }
  }

  checkUserRoles(): void {
    if (this.currentUser?.roles) {
      this.isProprietaire = this.currentUser.roles.some(role => role.name === 'PROPRIETAIRE');
      this.isAdmin = this.currentUser.roles.some(role => role.name === 'ADMIN');
    }
  }

  loadImmeubles() {
    this.serviceImm.getAllImmeubles().subscribe({
      next: res => this.immeubleOptions = res,
      error: err => console.error('Erreur récupération immeubles :', err)
    });
  }

  loadAppartements() {
    if (this.isAdmin) {
      // L'administrateur voit tous les appartements
      this.serviceApp.getAllAppartement().subscribe({
        next: res => this.appartements = res,
        error: err => console.error('Erreur récupération appartements :', err)
      });
    } else if (this.isProprietaire) {
      // Le propriétaire utilise l'endpoint mes-appartements
      this.serviceApp.getMesAppartements().subscribe({
        next: res => this.appartements = res,
        error: err => console.error('Erreur récupération mes appartements :', err)
      });
    } else {
      // Utilisateur sans rôle approprié
      this.appartements = [];
      console.warn('Utilisateur sans rôle approprié pour voir les appartements');
    }
  }

  submit() {
    if (this.ajoutForm.invalid) return;

    const formValue = this.ajoutForm.value;
    const selectedImmeuble = this.immeubleOptions.find(i => i.id === Number(formValue.immeubleId));
    if (!selectedImmeuble) return alert('Veuillez sélectionner un immeuble valide');

    // payload correct pour le backend
    const payload: AppartementCreate = {
      ...formValue,
      immeubleId: selectedImmeuble.id,
      proprietaireId: this.currentUser?.id || 0 // Associer automatiquement au propriétaire connecté
    };

    if (this.isEditMode && this.editingAppartementId) {
      this.serviceApp.updateAppartement(this.editingAppartementId, payload).subscribe({
        next: () => {
          this.loadAppartements();
          this.cancelEdit();
        },
        error: err => console.error('Erreur mise à jour appartement :', err)
      });
    } else {
      this.serviceApp.addAppartement(payload).subscribe({
        next: () => {
          this.loadAppartements();
          this.ajoutForm.reset();
        },
        error: err => console.error('Erreur ajout appartement :', err)
      });
    }
  }

  editAppartement(app: AppartementCreate) {
    this.isEditMode = true;
    this.editingAppartementId = app.id;
    this.ajoutForm.patchValue({
      nom: app.nom,
      adresse: app.adresse,
      prix: app.prix,
      numero: app.numero,
      superficie: app.superficie,
      nbrDePieces: app.nbrDePieces,
      description: app.description,
      type: app.type,
      statut: app.statut,
      localisation:app.localisation,
      immeubleId: app.immeubleId // correction ici
    });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.editingAppartementId = undefined;
    this.ajoutForm.reset();
  }

  deleteAppartement(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer cet appartement ?')) return;
    this.serviceApp.deleteAppartement(id).subscribe({
      next: () => this.loadAppartements(),
      error: err => console.error('Erreur suppression appartement :', err)
    });
  }

  canEditAppartement(app: AppartementCreate): boolean {
    // L'administrateur peut modifier tous les appartements
    if (this.isAdmin) return true;

    // Le propriétaire ne peut modifier que ses propres appartements
    if (this.isProprietaire && this.currentUser?.id) {
      return app.proprietaireId === this.currentUser.id;
    }

    return false;
  }

  canDeleteAppartement(app: AppartementCreate): boolean {
    // Même logique que pour l'édition
    return this.canEditAppartement(app);
  }

  publierAppartement(id: number, publie: boolean) {
    this.serviceApp.autoriserAffichage(id, publie).subscribe({
      next: (updated) => {
        const idx = this.appartements.findIndex(a => a.id === updated.id);
        if (idx !== -1) {
          this.appartements[idx] = { ...this.appartements[idx], ...updated } as any;
        }
        this.message = publie ? 'Appartement publié avec succès.' : 'Appartement dépublié avec succès.';
        this.loadAppartements();
      },
      error: err => console.error('Erreur lors de la publication/dépublication :', err)
    });
  }
}
