import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculeService } from '../../services/serviceVehicule/VehiculeService';
import { VehiculeDTO } from '../../interfaces/gestions/Vehicules/VehiculeDTO';
import { ImageDTOv } from '../../interfaces/gestions/image/ImageDTOv';
import { Carburant } from '../../interfaces/gestions/Vehicules/Carburant';
import { StatutVehicule } from '../../interfaces/gestions/Vehicules/StatutVehicule';
import { TypeVehicule } from '../../interfaces/gestions/Vehicules/TypeVehicule';
import{ReservationRequestVehi} from '../../interfaces/gestions/Reservations/ReservationRequestVehi';
import { ServiceReservation } from '../../services/serviceReservation/ServiceReservation';
import { Reservation } from '../reservation/reservation';
import { ImagesCreate } from '../../interfaces/gestions/image/ImagesCreate';
@Component({
  selector: 'app-vehicules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicules.html',
  styleUrl: './vehicules.css'
})
export class Vehicules implements OnInit {

  vehicules: VehiculeDTO[] = [];
  selectedVehicule?: VehiculeDTO;
  images:ImageDTOv[] = [];
  message = '';

  
 


  constructor(private vehiculeService:VehiculeService, serviceReservation:ServiceReservation) { }
  ngOnInit(): void {
    this.loadVehicules();
  }

    nouveauVehicule: VehiculeDTO = {
    marque: '',
    modele: '',
    immatriculation: '',
    prix: 0,
    carburant: Carburant.ESSENCE,
    statut: StatutVehicule.DISPONIBLE,
    type: TypeVehicule.VOITURE,

  };

  loadVehicules(){
    this.vehiculeService.listVehicules().subscribe({
      next:data => this.vehicules=data,
      error:err =>console.error('Erreur de chargement des véhicules',err)

    });
  }


  ajouterVehicule(){
    this.vehiculeService.addVehicule(this.nouveauVehicule).subscribe({
      next: data => {
        this.vehicules.push(data);
        this.nouveauVehicule = {
          marque: '',
          modele: '',
          immatriculation: '',
          prix: 0,
          carburant: Carburant.ESSENCE,
          statut: StatutVehicule.DISPONIBLE,
          type: TypeVehicule.VOITURE,
        };
      },
      error: err => console.error('Erreur lors de l\'ajout du véhicule', err)
    });
  }

  modifierVehicule(){
    if (!this.selectedVehicule || !this.selectedVehicule.id) return;
    this.vehiculeService.updateVehicule(this.selectedVehicule.id!,this.selectedVehicule).subscribe({
      next: updated => {
        // mettre à jour la liste locale (évite reload complet)
        const index = this.vehicules.findIndex(v => v.id === updated.id);
        if (index !== -1) this.vehicules[index] = updated;
        this.message ='Véhicule mis à jour avec succès.';
        this.loadVehicules();

      },
      error: err => console.error('Erreur lors de la modification du véhicule', err)
    });
  }

  supprimerVehicule(id:number){
    if(!confirm('Voulez-vous vraiment supprimer ce véhicule ?')) return;
    this.vehiculeService.removeVehicule(id).subscribe({
      next: () => {
        this.message='véhicule supprimé avec succès.';
        this.loadVehicules();
      },
      error: err => console.error('Erreur lors de la suppression du véhicule', err)
    })
  }

  changerStatut(id:number, statut:StatutVehicule){
    this.vehiculeService.changerStatut(id, statut).subscribe({
      next: data=>{
        this.message=`Statut changé à ${statut} avec succès.`;
        this.loadVehicules();
      },
      error: err => console.error('Erreur lors du changement de statut', err)
    });
  }

  editVehicule(v: VehiculeDTO) {
  this.selectedVehicule = { ...v }; // clone
  this.message = '';
  // optionnel : scroll vers le formulaire
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
}


  cancelEdit() {
  this.selectedVehicule = undefined;
}

publierVehicule(id: number, publie: boolean) {
    this.vehiculeService.autoriserAffichage(id, publie).subscribe({
      next: (updated) => {
        const idx = this.vehicules.findIndex(v => v.id === updated.id);
        if (idx !== -1) {
          this.vehicules[idx] = { ...this.vehicules[idx], ...updated };
        }
        this.message = publie ? 'Véhicule publié avec succès.' : 'Véhicule dépublié avec succès.';
        this.loadVehicules();
      },
      error: (err) => console.error('Erreur lors du changement de publication', err)
});
}

}
