import { Component, OnInit } from '@angular/core';
import { ReservationResponseDTO } from '../../interfaces/gestions/Reservations/ReservationResponseDTO';   
import { StatusReservation } from '../../interfaces/gestions/Reservations/StatutReservation';
import { ServiceReservation } from '../../services/serviceReservation/ServiceReservation';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css'
})
export class Reservation implements OnInit{

  reservations : ReservationResponseDTO[]=[];
  pagedReservations: ReservationResponseDTO[] = [];
  isLoading: boolean = true;
  statusReservation=StatusReservation;
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;


  constructor(private reservationService:ServiceReservation) { }
  ngOnInit(): void {
    this.loadReservations();
      
  }

  updatePagedReservations(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedReservations = this.reservations.slice(startIndex, endIndex);   
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.totalPages = Math.ceil(this.reservations.length / this.pageSize);
        this.updatePagedReservations();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations:', err);
        this.isLoading = false;
      } 
    });
  }

  changePage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePagedReservations();
}


  
  deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservations = this.reservations.filter(r => r.id !== id);
          this.totalPages = Math.ceil(this.reservations.length / this.pageSize);
          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          this.updatePagedReservations();
        },
        error: (err) => console.error('Erreur suppression réservation:', err)
      });
    }
  }

  validateReservation(id: number): void {
    if (confirm('Voulez-vous vraiment valider cette réservation ?')) {
      this.reservationService.updateReservationStatus(id, StatusReservation.VALIDEE).subscribe({
        next: (updatedReservation) => {
          const index = this.reservations.findIndex(r => r.id === id);
          if (index !== -1) {
            this.reservations[index] = updatedReservation;
            this.updatePagedReservations();
          }
        },
        error: (err) => console.error('Erreur validation réservation:', err)
      }); 
  }

}

}
