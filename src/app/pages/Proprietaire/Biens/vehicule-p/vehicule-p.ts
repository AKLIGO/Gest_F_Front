import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VehiculeService } from '../../../../services/serviceVehicule/VehiculeService';
import { UtilisateurService } from '../../../../services/utilisateur-service';
import { VehiculeDTO } from '../../../../interfaces/gestions/Vehicules/VehiculeDTO';
import { Utilisateurs } from '../../../../interfaces/Utilisateurs';
import { StatutVehicule } from '../../../../interfaces/gestions/Vehicules/StatutVehicule';
import { TypeVehicule } from '../../../../interfaces/gestions/Vehicules/TypeVehicule';
import { Carburant } from '../../../../interfaces/gestions/Vehicules/Carburant';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CacheService } from '../../../../services/cache-service';

@Component({
  selector: 'app-vehicule-p',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicule-p.html',
  styleUrl: './vehicule-p.css'
})
export class VehiculeP implements OnInit {
  vehicules: VehiculeDTO[] = [];
  currentUser: Utilisateurs | null = null;
  isLoading = false;
  errorMessage = '';
  
  // Cache simple
  private dataLoaded = false;
  private lastLoadTime = 0;
  private readonly CACHE_DURATION = 30000; // 30 secondes
  
  // Formulaires réactifs
  vehiculeForm: FormGroup;
  isEditMode = false;
  editingVehiculeId?: number;
  showModal = false;
  selectedVehicule: VehiculeDTO | null = null;
  
  // Options pour les formulaires
  typeOptions = Object.values(TypeVehicule);
  statutOptions = Object.values(StatutVehicule);
  carburantOptions = Object.values(Carburant);

  constructor(
    private vehiculeService: VehiculeService,
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder,
    private cacheService: CacheService
  ) {
    this.vehiculeForm = this.fb.group({
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      immatriculation: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(1)]],
      carburant: [null, Validators.required],
      statut: [null, Validators.required],
      type: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.utilisateurService.currentUser();
    if (this.currentUser?.id) {
      this.loadVehiculesProprietaire();
    } else {
      this.errorMessage = 'Utilisateur non connecté';
    }
  }

  loadVehiculesProprietaire(): void {
    if (!this.currentUser?.id) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const cacheKey = `vehicules_${this.currentUser.id}`;
    
    this.cacheService.get(
      cacheKey,
      () => this.vehiculeService.getMesVehicules().pipe(
        catchError((error: any) => {
          console.error('Erreur lors du chargement des véhicules:', error);
          this.errorMessage = 'Erreur lors du chargement des véhicules';
          return of([]);
        })
      ),
      30000 // 30 secondes de cache
    ).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (vehicules: VehiculeDTO[]) => {
        this.vehicules = vehicules;
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      case 'LOUER':
        return 'bg-red-100 text-red-800';
      case 'INDISPONIBLE':
        return 'bg-gray-100 text-gray-800';
      case 'EN_PANNE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESERVER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'VOITURE':
        return 'bg-blue-100 text-blue-800';
      case 'MOTO':
        return 'bg-purple-100 text-purple-800';
      case 'BUS':
        return 'bg-indigo-100 text-indigo-800';
      case 'MINI_BUS':
        return 'bg-pink-100 text-pink-800';
      case 'CAMION':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCarburantClass(carburant: string): string {
    switch (carburant) {
      case 'ESSENCE':
        return 'bg-red-100 text-red-800';
      case 'DIESEL':
        return 'bg-gray-100 text-gray-800';
      case 'GPL':
        return 'bg-green-100 text-green-800';
      case 'HYBRIDE':
        return 'bg-blue-100 text-blue-800';
      case 'ELECTRIQUE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Méthodes pour les statistiques
  getDisponiblesCount(): number {
    return this.vehicules.filter(v => v.statut === 'DISPONIBLE').length;
  }

  getLouesCount(): number {
    return this.vehicules.filter(v => v.statut === 'LOUER').length;
  }

  getReservesCount(): number {
    return this.vehicules.filter(v => v.statut === 'RESERVER').length;
  }

  getEnPanneCount(): number {
    return this.vehicules.filter(v => v.statut === 'EN_PANNE').length;
  }

  // Méthodes pour les formulaires et actions
  openAddModal(): void {
    this.isEditMode = false;
    this.editingVehiculeId = undefined;
    this.selectedVehicule = null;
    this.vehiculeForm.reset();
    this.showModal = true;
  }

  openEditModal(vehicule: VehiculeDTO): void {
    this.isEditMode = true;
    this.editingVehiculeId = vehicule.id;
    this.selectedVehicule = null;
    this.vehiculeForm.patchValue({
      marque: vehicule.marque,
      modele: vehicule.modele,
      immatriculation: vehicule.immatriculation,
      prix: vehicule.prix,
      carburant: vehicule.carburant,
      statut: vehicule.statut,
      type: vehicule.type
    });
    this.showModal = true;
  }

  openDetailsModal(vehicule: VehiculeDTO): void {
    this.selectedVehicule = vehicule;
    this.isEditMode = false;
    this.editingVehiculeId = undefined;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVehicule = null;
    this.isEditMode = false;
    this.editingVehiculeId = undefined;
    this.vehiculeForm.reset();
  }

  submitForm(): void {
    if (this.vehiculeForm.invalid) return;

    const formValue = this.vehiculeForm.value;
    const payload: VehiculeDTO = {
      ...formValue
    };

    if (this.isEditMode && this.editingVehiculeId) {
      this.vehiculeService.updateVehicule(this.editingVehiculeId, payload).subscribe({
        next: () => {
          this.loadVehiculesProprietaire();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          alert('Erreur lors de la mise à jour du véhicule');
        }
      });
    } else {
      this.vehiculeService.addVehicule(payload).subscribe({
        next: () => {
          this.loadVehiculesProprietaire();
          this.closeModal();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout:', error);
          alert('Erreur lors de l\'ajout du véhicule');
        }
      });
    }
  }

  deleteVehicule(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce véhicule ?')) return;
    
    this.vehiculeService.removeVehicule(id).subscribe({
      next: () => {
        this.refreshData();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du véhicule');
      }
    });
  }

  // Méthode pour forcer le rechargement des données
  refreshData(): void {
    if (this.currentUser?.id) {
      const cacheKey = `vehicules_${this.currentUser.id}`;
      this.cacheService.delete(cacheKey);
    }
    this.loadVehiculesProprietaire();
  }
}
