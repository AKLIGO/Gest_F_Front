import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceReservation } from '../../../services/serviceReservation/ServiceReservation';
import { ReservationResponseVehi } from '../../../interfaces/gestions/Reservations/ReservationResponseVehi';
import { PaygateService } from '../../../services/paygate-service';
import { ClientRequestDto } from '../../../interfaces/paiement/ClientRequestDto';
import { CancellationInfoDTO } from '../../../interfaces/gestions/Reservations/CancellationInfoDTO';
@Component({
  selector: 'app-voir-reservation-vehic',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './voir-reservation-vehic.component.html',
  styleUrl: './voir-reservation-vehic.component.css'
})
export class VoirReservationVehicComponent implements OnInit{

  reservations:ReservationResponseVehi[]=[];
  filteredReservations: ReservationResponseVehi[] = [];
  paginatedReservations: ReservationResponseVehi[] = [];
  loading=false;
  
  // Map pour stocker les infos d'annulation par réservation
  cancellationInfoMap: Map<number, CancellationInfoDTO> = new Map();
  
  // Propriétés de pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  
  // Propriétés de filtre
  searchQuery = '';
  filterStatus = 'TOUS';
  sortBy = 'date-desc';
  
  // Exposer Math pour l'utiliser dans le template
  Math = Math;
  
  // Variables pour le formulaire de paiement
  showPaymentForm = false;
  selectedReservationId: number | null = null;
  selectedReservation: ReservationResponseVehi | null = null;
  paymentProcessing = false;
  paymentSuccess = false;
  paymentError = '';
  
  paymentForm: ClientRequestDto = {
    phone: '',
    amount: 0,
    network: 'TMONEY'
  };

  constructor(
    private reservationService: ServiceReservation,
    private paygateService: PaygateService
  ){}

  ngOnInit(): void {
      this.loadReservations();
  }

  loadReservations(): void {
  this.loading = true;

  this.reservationService.getVehiculesCurrentUser().subscribe({
    next: data => {
      console.log('Véhicules reçus:', data);
      this.reservations = data;
      // Charger les infos d'annulation pour chaque réservation
      this.loadCancellationInfos();
      // Appliquer les filtres et la pagination
      this.applyFilters();
    },
    error: err => {
      console.error('Erreur fetch véhicules:', err);
      this.loading = false;
    },
    complete: () => {
      this.loading = false;
    }
  });
}

  /**
   * Applique les filtres de recherche et de statut
   */
  applyFilters(): void {
    let filtered = [...this.reservations];
    
    // Filtre par recherche (marque, immatriculation, ID)
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(res => 
        res.vehiculeMarque?.toLowerCase().includes(query) ||
        res.vehiculeImmatriculation?.toLowerCase().includes(query) ||
        res.id.toString().includes(query)
      );
    }
    
    // Filtre par statut
    if (this.filterStatus !== 'TOUS') {
      filtered = filtered.filter(res => res.statut === this.filterStatus);
    }
    
    // Tri
    this.sortReservations(filtered);
    
    this.filteredReservations = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1; // Reset à la page 1 après filtrage
    this.updatePagination();
  }
  
  /**
   * Tri des réservations
   */
  sortReservations(reservations: ReservationResponseVehi[]): void {
    switch(this.sortBy) {
      case 'date-desc':
        reservations.sort((a, b) => b.id - a.id);
        break;
      case 'date-asc':
        reservations.sort((a, b) => a.id - b.id);
        break;
      case 'marque':
        reservations.sort((a, b) => a.vehiculeMarque.localeCompare(b.vehiculeMarque));
        break;
    }
  }
  
  /**
   * Met à jour la pagination
   */
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReservations = this.filteredReservations.slice(startIndex, endIndex);
  }
  
  /**
   * Change de page
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  /**
   * Obtient le tableau des numéros de page à afficher
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.filterStatus = 'TOUS';
    this.sortBy = 'date-desc';
    this.applyFilters();
  }

  /**
   * Charge les informations d'annulation pour toutes les réservations véhicules
   */
  loadCancellationInfos(): void {
    this.reservations.forEach(reservation => {
      this.reservationService.getCancellationInfoVehi(reservation.id).subscribe({
        next: (info) => {
          this.cancellationInfoMap.set(reservation.id, info);
        },
        error: (err) => {
          console.error(`Erreur chargement info annulation pour réservation ${reservation.id}`, err);
        }
      });
    });
  }

  /**
   * Récupère les infos d'annulation pour une réservation
   */
  getCancellationInfo(reservationId: number): CancellationInfoDTO | null {
    return this.cancellationInfoMap.get(reservationId) || null;
  }

  /**
   * Vérifie si une réservation peut être annulée
   */
  canCancelReservation(reservationId: number): boolean {
    const info = this.getCancellationInfo(reservationId);
    return info?.canCancel || false;
  }

  /**
   * Annule une réservation véhicule
   */
  cancelReservation(reservationId: number): void {
    const info = this.getCancellationInfo(reservationId);
    
    if (!info?.canCancel) {
      alert(info?.message || 'Cette réservation ne peut pas être annulée.');
      return;
    }

    const confirmation = confirm(
      `Êtes-vous sûr de vouloir annuler cette réservation ?\n\n${info.message}\n\nCette action est irréversible.`
    );

    if (!confirmation) return;

    this.loading = true;
    this.reservationService.cancelReservationVehi(reservationId).subscribe({
      next: (updatedReservation) => {
        console.log('Réservation véhicule annulée avec succès', updatedReservation);
        alert('Réservation annulée avec succès ! Un email de confirmation vous a été envoyé.');
        this.loadReservations();
      },
      error: (err) => {
        console.error('Erreur lors de l\'annulation', err);
        alert(err.error || 'Erreur lors de l\'annulation de la réservation.');
        this.loading = false;
      }
    });
  }


    payerReservation(reservationId: number) {
    this.selectedReservationId = reservationId;
    this.selectedReservation = this.reservations.find(r => r.id === reservationId) || null;
    
    if (this.selectedReservation) {
      // Pré-remplir le montant (vous pouvez ajuster selon votre logique)
      this.paymentForm.amount = 0; // À définir selon le prix du véhicule
    }
    
    this.showPaymentForm = true;
    this.paymentSuccess = false;
    this.paymentError = '';
  }

  closePaymentForm() {
    this.showPaymentForm = false;
    this.selectedReservationId = null;
    this.selectedReservation = null;
    this.paymentForm = {
      phone: '',
      amount: 0,
      network: 'TMONEY'
    };
    this.paymentSuccess = false;
    this.paymentError = '';
  }

  submitPayment() {
    if (!this.paymentForm.phone || !this.paymentForm.amount) {
      this.paymentError = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.paymentForm.phone.length < 8) {
      this.paymentError = 'Numéro de téléphone invalide';
      return;
    }

    this.paymentProcessing = true;
    this.paymentError = '';

    // Initier le paiement
    this.paygateService.initiatePayment(this.paymentForm).subscribe({
      next: (response) => {
        console.log('Paiement initié:', response);
        
        // Vérifier le statut automatiquement
        this.paygateService.pollTransactionStatus(response.tx_reference, 'YOUR_AUTH_TOKEN')
          .subscribe({
            next: (statusResponse) => {
              console.log('Paiement réussi!', statusResponse);
              this.paymentProcessing = false;
              this.paymentSuccess = true;
              
              // Recharger les réservations après 2 secondes
              setTimeout(() => {
                this.closePaymentForm();
                this.loadReservations();
              }, 2000);
            },
            error: (err) => {
              console.error('Erreur paiement:', err);
              this.paymentProcessing = false;
              this.paymentError = err.message || 'Le paiement a échoué. Veuillez réessayer.';
            }
          });
      },
      error: (err) => {
        console.error('Erreur initiation paiement:', err);
        this.paymentProcessing = false;
        this.paymentError = 'Erreur lors de l\'initiation du paiement';
      }
    });
  }
}
