import { Component , OnInit  } from '@angular/core';
import{ReservationRequestVehi} from '../../interfaces/gestions/Reservations/ReservationRequestVehi';
import { ServiceReservation } from '../../services/serviceReservation/ServiceReservation';
import { VehiculeDTO } from '../../interfaces/gestions/Vehicules/VehiculeDTO';
import { StatusReservation } from '../../interfaces/gestions/Reservations/StatutReservation';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationResponseVehi } from '../../interfaces/gestions/Reservations/ReservationResponseVehi';
@Component({
  selector: 'app-reservation-vehicule',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './reservation-vehicule.html',
  styleUrl: './reservation-vehicule.css'
})
export class ReservationVehicule implements OnInit{

  reservationVehicule:ReservationResponseVehi[]=[];
  pagedReservations: ReservationResponseVehi[] = [];
  isLoading: boolean = true;
  statusReservation=StatusReservation
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private reservationService:ServiceReservation) { }




  ngOnInit(): void {
      this.loadReservations();
  }

  updatePagedReservations(): void {
    const startIndex =(this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedReservations = this.reservationVehicule.slice(startIndex, endIndex);   

  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservationsVehi().subscribe({
      next: (data) => {
        this.reservationVehicule = data;
        this.totalPages = Math.ceil(this.reservationVehicule.length / this.pageSize);
        this.updatePagedReservations();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations:', err);
        this.isLoading = false;
      }
    });
  }

  changePage(page:number): void{
  if(page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.updatePagedReservations();
  }

    deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.reservationVehicule = this.reservationVehicule.filter(r => r.id !== id);
          this.totalPages = Math.ceil(this.reservationVehicule.length / this.pageSize);
          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          this.updatePagedReservations();
        },
        error: (err) => console.error('Erreur suppression réservation:', err)
      });
    }
  }

  validateReservation(id:number): void{
      if(confirm('Voulez-vous vraiment valider cette réservation ?')){
        this.reservationService.updateReservationVehiStatus(id, StatusReservation.VALIDEE)
              .subscribe({
          next: (updatedReservation) => {
            const index = this.reservationVehicule.findIndex(r => r.id ===id);
            if(index !== -1){
              this.reservationVehicule[index] = updatedReservation;
              this.updatePagedReservations();
            }
          },
          error: (err) => console.error('Erreur validation réservation:', err)
        });

  }

}
}
