import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceApp } from '../../../../services/serviceApp/service-app';
import { ServiceImm } from '../../../../services/servicesImm/service-imm';
import { UtilisateurService } from '../../../../services/utilisateur-service';
import { AppartementCreate } from '../../../../interfaces/gestions/Appartement/AppartementCreate';
import { ImmeubleCreate } from '../../../../interfaces/gestions/Immeuble/ImmeubleCreate';
import { Utilisateurs } from '../../../../interfaces/Utilisateurs';
import { TypeAppartement } from '../../../../interfaces/gestions/Appartement/TypeAppartement';
import { StatutAppartement } from '../../../../interfaces/gestions/Appartement/StatutAppartement';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CacheService } from '../../../../services/cache-service';

@Component({
  selector: 'app-appartement-p',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appartement-p.html',
  styleUrl: './appartement-p.css'
})
export class AppartementP implements OnInit {
  appartements: AppartementCreate[] = [];
  immeubles: ImmeubleCreate[] = [];
  currentUser: Utilisateurs | null = null;
  isLoading = false;
  errorMessage = '';

  // Cache simple
  private dataLoaded = false;
  private lastLoadTime = 0;
  private readonly CACHE_DURATION = 30000; // 30 secondes

  // Formulaires réactifs
  appartementForm: FormGroup;
  isEditMode = false;
  editingAppartementId?: number;
  showModal = false;
  selectedAppartement: AppartementCreate | null = null;

  // Options pour les formulaires
  typeOptions = Object.values(TypeAppartement);
  statutOptions = Object.values(StatutAppartement);

  constructor(
    private serviceApp: ServiceApp,
    private serviceImm: ServiceImm,
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder,
    private cacheService: CacheService
  ) {
    this.appartementForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(1)]],
      numero: [0, Validators.required],
      superficie: ['', Validators.required],
      nbrDePieces: [0, Validators.required],
      description: [''],
      localisation:['',Validators.required],
      type: [null, Validators.required],
      statut: [null, Validators.required],
      immeubleId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    // Charger les immeubles en parallèle
    this.loadImmeubles();
  }

  loadCurrentUser(): void {
    this.currentUser = this.utilisateurService.currentUser();
    if (this.currentUser?.id) {
      this.loadAppartementsProprietaire();
    } else {
      this.errorMessage = 'Utilisateur non connecté';
    }
  }

  loadAppartementsProprietaire(): void {
    if (!this.currentUser?.id) return;

    this.isLoading = true;
    this.errorMessage = '';

    const cacheKey = `appartements_${this.currentUser.id}`;

    this.cacheService.get(
      cacheKey,
      () => this.serviceApp.getMesAppartements().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des appartements:', error);
          this.errorMessage = 'Erreur lors du chargement des appartements';
          return of([]);
        })
      ),
      30000 // 30 secondes de cache
    ).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (appartements) => {
        this.appartements = appartements;
      }
    });
  }

  loadImmeubles(): void {
    this.serviceImm.getAllImmeubles().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
        return of([]); // Retourner un tableau vide en cas d'erreur
      })
    ).subscribe({
      next: (immeubles) => {
        this.immeubles = immeubles;
      }
    });
  }

  getImmeubleNom(app: AppartementCreate): string {
    const immeuble = this.immeubles.find(i => i.id === app.immeubleId);
    return immeuble ? immeuble.nom : 'N/A';
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      case 'LOUER':
        return 'bg-red-100 text-red-800';
      case 'INDISPONIBLE':
        return 'bg-gray-100 text-gray-800';
      case 'RESERVER':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'STUDIO':
        return 'bg-blue-100 text-blue-800';
      case 'T1':
        return 'bg-purple-100 text-purple-800';
      case 'T2':
        return 'bg-indigo-100 text-indigo-800';
      case 'T3':
        return 'bg-pink-100 text-pink-800';
      case 'T4':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Méthodes pour les statistiques
  getDisponiblesCount(): number {
    return this.appartements.filter(app => app.statut === 'DISPONIBLE').length;
  }

  getLouesCount(): number {
    return this.appartements.filter(app => app.statut === 'LOUER').length;
  }

  getReservesCount(): number {
    return this.appartements.filter(app => app.statut === 'RESERVER').length;
  }

  // Méthodes pour les formulaires et actions
  openAddModal(): void {
    this.isEditMode = false;
    this.editingAppartementId = undefined;
    this.selectedAppartement = null;
    this.appartementForm.reset();
    this.showModal = true;
  }

  openEditModal(app: AppartementCreate): void {
    this.isEditMode = true;
    this.editingAppartementId = app.id;
    this.selectedAppartement = null;
    this.appartementForm.patchValue({
      nom: app.nom,
      adresse: app.adresse,
      prix: app.prix,
      numero: app.numero,
      superficie: app.superficie,
      nbrDePieces: app.nbrDePieces,
      description: app.description,
      localisation:app.localisation,
      type: app.type,
      statut: app.statut,
      immeubleId: app.immeubleId
    });
    this.showModal = true;
  }

  openDetailsModal(app: AppartementCreate): void {
    this.selectedAppartement = app;
    console.log('Appartement sélectionné:', this.selectedAppartement);
    this.isEditMode = false;
    this.editingAppartementId = undefined;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAppartement = null;
    this.isEditMode = false;
    this.editingAppartementId = undefined;
    this.appartementForm.reset();
  }

  submitForm(): void {
    if (this.appartementForm.invalid) return;

    const formValue = this.appartementForm.value;
    const selectedImmeuble = this.immeubles.find(i => i.id === Number(formValue.immeubleId));
    if (!selectedImmeuble) {
      alert('Veuillez sélectionner un immeuble valide');
      return;
    }

    const payload: AppartementCreate = {
      ...formValue,
      immeubleId: selectedImmeuble.id,
      proprietaireId: this.currentUser?.id || 0
    };

    if (this.isEditMode && this.editingAppartementId) {
      this.serviceApp.updateAppartement(this.editingAppartementId, payload).subscribe({
        next: () => {
          this.loadAppartementsProprietaire();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          alert('Erreur lors de la mise à jour de l\'appartement');
        }
      });
    } else {
      this.serviceApp.addAppartement(payload).subscribe({
        next: () => {
          this.loadAppartementsProprietaire();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout de l\'appartement');
        }
      });
    }
  }

  deleteAppartement(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cet appartement ?')) return;

    this.serviceApp.deleteAppartement(id).subscribe({
      next: () => {
        this.refreshData();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'appartement');
      }
    });
  }

  // Méthode pour forcer le rechargement des données
  refreshData(): void {
    if (this.currentUser?.id) {
      const cacheKey = `appartements_${this.currentUser.id}`;
      this.cacheService.delete(cacheKey);
    }
    this.loadAppartementsProprietaire();
  }
}
