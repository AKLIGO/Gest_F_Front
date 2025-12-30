import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationResponseDTO } from '../../../interfaces/gestions/Reservations/ReservationResponseDTO';
import { ServiceReservation } from '../../../services/serviceReservation/ServiceReservation';
import { PaygateService } from '../../../services/paygate-service';
import { ClientRequestDto } from '../../../interfaces/paiement/ClientRequestDto';
@Component({
  selector: 'app-voir-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voir-reservation.component.html',
  styleUrl: './voir-reservation.component.css'
})
export class VoirReservationComponent implements OnInit{
  reservations:ReservationResponseDTO[]=[];
  loading = false;
  
  // Variables pour le formulaire de paiement
  showPaymentForm = false;
  selectedReservationId: number | null = null;
  selectedReservation: ReservationResponseDTO | null = null;
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
    this.loading=true;
    this.reservationService.getAppartementsCurrentUser().subscribe({
      next: data => this.reservations = data,
      error: err => console.error(err),
      complete: () => this.loading = false
    });

  }

  payerReservation(reservationId: number) {
    this.selectedReservationId = reservationId;
    this.selectedReservation = this.reservations.find(r => r.id === reservationId) || null;
    
    if (this.selectedReservation) {
      // Pré-remplir le montant (vous pouvez ajuster selon votre logique)
      this.paymentForm.amount = 0; // À définir selon le prix de l'appartement
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
