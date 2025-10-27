import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceReservation } from '../../../../services/serviceReservation/ServiceReservation';
import { ServiceApp } from '../../../../services/serviceApp/service-app';
import { UtilisateurService } from '../../../../services/utilisateur-service';
import { CacheService } from '../../../../services/cache-service';
import { ReservationResponseDTO } from '../../../../interfaces/gestions/Reservations/ReservationResponseDTO';
import { ReservationRequest } from '../../../../interfaces/gestions/Reservations/ReservationRequest';
import { AppartementDTO } from '../../../../interfaces/gestions/Appartement/AppartementDTO';
import { Utilisateurs } from '../../../../interfaces/Utilisateurs';
import { StatusReservation } from '../../../../interfaces/gestions/Reservations/StatutReservation';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reservation-app-p',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-app-p.html',
  styleUrl: './reservation-app-p.css'
})
export class ReservationAppP implements OnInit {
  reservations: ReservationResponseDTO[] = [];
  appartements: AppartementDTO[] = [];
  currentUser: Utilisateurs | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Formulaires réactifs
  reservationForm: FormGroup;
  showModal = false;
  selectedReservation: ReservationResponseDTO | null = null;
  isEditMode = false;
  editingReservationId?: number;
  
  // Options pour les statuts
  statutOptions = Object.values(StatusReservation);

  constructor(
    private reservationService: ServiceReservation,
    private serviceApp: ServiceApp,
    private utilisateurService: UtilisateurService,
    private cacheService: CacheService,
    private fb: FormBuilder
  ) {
    this.reservationForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      appartementId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAppartements();
  }

  loadCurrentUser(): void {
    this.currentUser = this.utilisateurService.currentUser();
    if (this.currentUser?.id) {
      this.loadReservations();
    } else {
      this.errorMessage = 'Utilisateur non connecté';
    }
  }

  loadReservations(): void {
    if (!this.currentUser?.id) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const cacheKey = `reservations_appartements_${this.currentUser.id}`;
    
    this.cacheService.get(
      cacheKey,
      () => this.reservationService.getReservationsByCurrentUser().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des réservations:', error);
          this.errorMessage = 'Erreur lors du chargement des réservations';
          return of([]);
        })
      ),
      30000 // 30 secondes de cache
    ).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
      }
    });
  }

  loadAppartements(): void {
    const cacheKey = 'appartements_disponibles';
    
    this.cacheService.get(
      cacheKey,
      () => this.serviceApp.getAllAppartementDto().pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des appartements:', error);
          return of([]);
        })
      ),
      60000 // 1 minute de cache pour les appartements
    ).subscribe({
      next: (appartements) => {
        this.appartements = appartements;
      }
    });
  }

  getAppartementNom(appartementId: number): string {
    const appartement = this.appartements.find(a => a.id === appartementId);
    return appartement ? appartement.nom : 'N/A';
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'VALIDEE':
      case 'CONFIRMEE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANNULEE':
        return 'bg-red-100 text-red-800';
      case 'TERMINER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedReservation = null;
    this.reservationForm.reset();
    this.showModal = true;
  }

  openEditModal(reservation: ReservationResponseDTO): void {
    this.isEditMode = true;
    this.selectedReservation = reservation;
    this.editingReservationId = reservation.id;
    
    // Trouver l'appartement correspondant
    const appartement = this.appartements.find(a => 
      a.nom === reservation.appartementNom && a.adresse === reservation.appartementAdresse
    );
    
    this.reservationForm.patchValue({
      dateDebut: reservation.dateDebut.split('T')[0], // Convertir de ISO à YYYY-MM-DD
      dateFin: reservation.dateFin.split('T')[0],
      appartementId: appartement?.id || null
    });
    
    this.showModal = true;
  }

  openDetailsModal(reservation: ReservationResponseDTO): void {
    this.selectedReservation = reservation;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = null;
    this.isEditMode = false;
    this.editingReservationId = undefined;
    this.reservationForm.reset();
  }

  submitForm(): void {
    if (this.reservationForm.valid) {
      const formData = this.reservationForm.value;
      
      if (this.isEditMode && this.editingReservationId) {
        this.updateReservationStatus(this.editingReservationId, 'VALIDEE');
      } else {
        this.createReservation(formData);
      }
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
    }
  }

  createReservation(formData: any): void {
    const reservationRequest: ReservationRequest = {
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      appartementId: formData.appartementId
    };

    this.reservationService.createreservation(reservationRequest).subscribe({
      next: (response) => {
        this.successMessage = 'Réservation créée avec succès';
        this.closeModal();
        this.refreshData();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la création de la réservation:', error);
        this.errorMessage = 'Erreur lors de la création de la réservation';
      }
    });
  }

  updateReservationStatus(reservationId: number, nouveauStatut: string): void {
    this.reservationService.updateReservationStatus(reservationId, nouveauStatut).subscribe({
      next: (response) => {
        this.successMessage = `Statut mis à jour vers ${nouveauStatut}`;
        this.closeModal();
        this.refreshData();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du statut';
      }
    });
  }

  validateReservation(id: number): void {
    if (!confirm('Voulez-vous valider cette réservation ?')) return;
    
    this.updateReservationStatus(id, 'VALIDEE');
  }

  deleteReservation(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette réservation ?')) return;
    
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.successMessage = 'Réservation supprimée avec succès';
        this.refreshData();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.errorMessage = 'Erreur lors de la suppression de la réservation';
      }
    });
  }

  // Méthode pour forcer le rechargement des données
  refreshData(): void {
    if (this.currentUser?.id) {
      const cacheKey = `reservations_appartements_${this.currentUser.id}`;
      this.cacheService.delete(cacheKey);
    }
    this.loadReservations();
  }

  // Méthode pour formater les dates
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  // Méthode pour formater le montant
  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(montant);
  }
}
