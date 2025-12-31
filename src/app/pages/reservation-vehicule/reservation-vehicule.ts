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
  sortBy: 'date-debut-asc' | 'date-debut-desc' | 'date-fin-asc' | 'date-fin-desc' | 'statut' | 'none' = 'none';
  filterStatus: 'TOUS' | StatusReservation = 'TOUS';

  constructor(private reservationService:ServiceReservation) { }




  ngOnInit(): void {
      this.loadReservations();
  }

  updatePagedReservations(): void {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let filtered = [...this.reservationVehicule];

    // Filtrer par statut
    if (this.filterStatus !== 'TOUS') {
      filtered = filtered.filter(r => r.statut === this.filterStatus);
    }

    // Trier
    filtered = this.sortReservations(filtered);

    // Calculer pagination
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Paginer
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedReservations = filtered.slice(startIndex, endIndex);
  }

  sortReservations(reservations: ReservationResponseVehi[]): ReservationResponseVehi[] {
    if (this.sortBy === 'none') return reservations;

    return reservations.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-debut-asc':
          return new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime();
        case 'date-debut-desc':
          return new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime();
        case 'date-fin-asc':
          return new Date(a.dateFin).getTime() - new Date(b.dateFin).getTime();
        case 'date-fin-desc':
          return new Date(b.dateFin).getTime() - new Date(a.dateFin).getTime();
        case 'statut':
          return a.statut.localeCompare(b.statut);
        default:
          return 0;
      }
    });
  }

  changeSortBy(sortBy: string): void {
    this.sortBy = sortBy as any;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  changeFilterStatus(status: string): void {
    this.filterStatus = status as any;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservationsVehi().subscribe({
      next: (data) => {
        this.reservationVehicule = data;
        this.applyFiltersAndSort();
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
