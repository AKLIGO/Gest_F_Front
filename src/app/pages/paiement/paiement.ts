import { Component, OnInit } from '@angular/core';
import { ServicePaiement } from '../../services/servicePaiement/ServicePaiement';
import { PaiementDTO } from '../../interfaces/gestions/paiements/PaiementDTO';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paiement.html',
  styleUrl: './paiement.css'
})
export class Paiement implements OnInit{

  constructor(private servicePaiement:ServicePaiement, private router: Router) {}

  paiements:PaiementDTO[] = [];
  currentPage=1;
  itemsPerPage=10;
  totalPages=1;

  /**
   * charger les paiements
   */
  loadPaiements():void{
    this.servicePaiement.getAllPaiements().subscribe({
      next:(data) => {
        this.paiements=data;
        this.totalPages=Math.ceil(this.paiements.length/this.itemsPerPage);
      },

      error:(err)=> console.error('Erreur lors du chargement des paiements')

    });

  }

  /**
   * Retourner les paiements pour la page courante
   */

  get pagedPaiements():PaiementDTO[]{
    const startIndex=(this.currentPage -1)*this.itemsPerPage;
    return this.paiements.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /**
   * Navigation
   */

  goToPage(page:number){
    if(page<1 || page>this.totalPages) return;
    this.currentPage=page;
  }

  nextPage(){
    if(this.currentPage < this.totalPages){
      this.currentPage++;
    }
  }

  prevPage(){
    if(this.currentPage >1){
      this.currentPage--;
    }
  }

  ngOnInit(): void {
    this.loadPaiements();
  }

  voirPaiementParReservation(reservationId:number):void{
    this.router.navigate(['/paiement-by-reservation', reservationId]);
  }

}
