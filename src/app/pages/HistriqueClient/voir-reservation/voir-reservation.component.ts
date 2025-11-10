import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReservationResponseDTO } from '../../../interfaces/gestions/Reservations/ReservationResponseDTO';
import { ServiceReservation } from '../../../services/serviceReservation/ServiceReservation';
@Component({
  selector: 'app-voir-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voir-reservation.component.html',
  styleUrl: './voir-reservation.component.css'
})
export class VoirReservationComponent implements OnInit{
  reservations:ReservationResponseDTO[]=[];
  loading = false;

  constructor(private reservationService:ServiceReservation){}


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
  console.log('Payer la réservation ID:', reservationId);

  // this.reservationService.payerReservation(reservationId).subscribe(...);
}



}
