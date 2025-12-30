import { Component, OnInit } from '@angular/core';
import { ServicePaiement } from '../../services/servicePaiement/ServicePaiement';
import { PaiementDTO } from '../../interfaces/gestions/paiements/PaiementDTO';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ModePaiement } from '../../interfaces/gestions/paiements/ModePaiement';
import { StatutPaiement } from '../../interfaces/gestions/paiements/StatutPaiement';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './paiement.html',
  styleUrl: './paiement.css'
})
export class Paiement implements OnInit{

  constructor(private servicePaiement:ServicePaiement, private router: Router,private fb: FormBuilder) {}

  paiements:PaiementDTO[] = [];
  currentPage=1;
  itemsPerPage=10;
  totalPages=1;


  afficherFormulaire = false;
  paiementForm!: FormGroup;

  modePaiement = Object.values(ModePaiement);
  statutPaiement = Object.values(StatutPaiement);

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

    /** Initialiser le formulaire réactif */
  initForm(): void {
    this.paiementForm = this.fb.group({
      reservationId: ['', Validators.required],
     
      montant: ['', [Validators.required, Validators.min(1)]],
      modePaiement: ['', Validators.required],
      
    });
  }


   /** Soumettre le formulaire */
  onSubmit(): void {
    if (this.paiementForm.invalid) return;

    // use stored token or test fallback token
    const testToken = (window as any).__TEST_ACCESS_TOKEN__;
    const token = localStorage.getItem('access_token') || testToken;
    console.log('Paiement - token used:', token ? 'present' : 'none');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Paiement - token payload:', payload);
      } catch (e) {
        console.warn('Paiement - unable to parse token payload');
      }
    } else {
      console.warn('Utilisateur non authentifié - rester sur la même page');
      return;
    }

    const paiementData = this.paiementForm.value;
    this.servicePaiement.effectuerPaiement(
      paiementData.reservationId,
      paiementData.montant,
      paiementData.modePaiement,
      token // overrideToken pour forcer l'en-tête Authorization
    ).subscribe({
      next: (data) => {
        console.log('Paiement ajouté avec succès');
        this.afficherFormulaire = false;
        this.paiementForm.reset({ statut: 'EN_ATTENTE' });
        this.loadPaiements(); // Recharger la liste
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du paiement', err);
        if (err?.status === 403) {
          console.warn('Accès refusé (403) — rester sur la même page');
        } else {
          console.error('Erreur lors de l\'ajout du paiement.');
        }
      }
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
    this.initForm();
  }

  voirPaiementParReservation(reservationId:number):void{
    this.router.navigate(['admin/paiement-by-reservation', reservationId]);
  }

}
