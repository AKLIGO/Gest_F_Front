import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceReservation } from '../../../services/serviceReservation/ServiceReservation';
import { ReservationResponseVehi } from '../../../interfaces/gestions/Reservations/ReservationResponseVehi';
@Component({
  selector: 'app-voir-reservation-vehic',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './voir-reservation-vehic.component.html',
  styleUrl: './voir-reservation-vehic.component.css'
})
export class VoirReservationVehicComponent implements OnInit{

  reservations:ReservationResponseVehi[]=[];
  loading=false;
  constructor(private reservationService:ServiceReservation){}

  ngOnInit(): void {
      this.loadReservations();
  }

  loadReservations(): void {
  this.loading = true;

  this.reservationService.getVehiculesCurrentUser().subscribe({
    next: data => {
      console.log('Véhicules reçus:', data); // 🔹 déplacer ici
      this.reservations = data;
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


    payerReservation(reservationId: number) {
  console.log('Payer la réservation ID:', reservationId);

  // this.reservationService.payerReservation(reservationId).subscribe(...);
}
}
