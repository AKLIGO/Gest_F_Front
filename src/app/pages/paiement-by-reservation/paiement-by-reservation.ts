import { Component ,OnInit} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServicePaiement } from '../../services/servicePaiement/ServicePaiement';
import { PaiementDTO } from '../../interfaces/gestions/paiements/PaiementDTO';
@Component({
  selector: 'app-paiement-by-reservation',
  imports: [CommonModule,RouterModule],
  templateUrl: './paiement-by-reservation.html',
  styleUrl: './paiement-by-reservation.css'
})
export class PaiementByReservation implements OnInit{
  reservationId!: number;
  paiements:PaiementDTO[] = [];

    constructor(
    private route: ActivatedRoute,
    private servicePaiement: ServicePaiement
  ) {}

  ngOnInit(): void {
    /**
     * Récupérer l'ID de la réservation depuis les paramètres de l'URL
     */
    this.route.paramMap.subscribe(params =>
      {const id =params.get('reservationId');
      if(id){
        this.reservationId=+id;
        this.loadPaiementsByReservation();  
      }
  })
  }

  loadPaiementsByReservation(){
    this.servicePaiement.getPaiementsByReservation(this.reservationId)
    .subscribe({
      next:(data) => {
        this.paiements=data;
        this.totalPages = Math.ceil(this.paiements.length / this.itemsPerPage);
      },
      error:(err)=> console.error('Erreur lors du chargement des paiements par reservation')
    });
  }

currentPage = 1;
itemsPerPage = 5;
totalPages = 1;

get pagedPaiements() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.paiements.slice(start, start + this.itemsPerPage);
}

goToPage(page: number) {
  if(page < 1 || page > this.totalPages) return;
  this.currentPage = page;
}

nextPage() {
  if(this.currentPage < this.totalPages) this.currentPage++;
}

prevPage() {
  if(this.currentPage > 1) this.currentPage--;
}


}
