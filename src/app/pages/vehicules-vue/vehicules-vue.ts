import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculeService } from '../../services/serviceVehicule/VehiculeService';
import { VehiculeDTO } from '../../interfaces/gestions/Vehicules/VehiculeDTO';
import { Carburant } from '../../interfaces/gestions/Vehicules/Carburant';
import { StatutVehicule } from '../../interfaces/gestions/Vehicules/StatutVehicule';
import { TypeVehicule } from '../../interfaces/gestions/Vehicules/TypeVehicule';
import { ServiceImage } from '../../services/servicesImage/service-image';
import { trigger, transition, style, animate } from '@angular/animations';
import { ServiceReservation } from '../../services/serviceReservation/ServiceReservation';

@Component({
  selector: 'app-vehicules-vue',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicules-vue.html',
  styleUrls: ['./vehicules-vue.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class VehiculesVue implements OnInit {
  vehicules: VehiculeDTO[] = [];
  selectedVehicule?: VehiculeDTO;
  selectedImageIndex: number = 0;
  StatutVehicule = StatutVehicule;
  TypeVehicule = TypeVehicule;
  Carburant = Carburant;

  showReservationForm = false;
  reservationForm = {
    dateDebut: '',
    dateFin: ''
  };

  constructor(
    private vehiculeService: VehiculeService,
    private imageService: ServiceImage,
    private serviceReservation: ServiceReservation
  ) {}

  ngOnInit(): void {
    this.loadVehicules();
  }

  loadVehicules() {
    this.vehiculeService.listVehiculesVue().subscribe({
      next: data => {
        this.vehicules = data;
        this.prepareImages();
      },
      error: err => console.error('Erreur chargement véhicules:', err)
    });
  }

  private prepareImages() {
    this.vehicules.forEach(v => {
      (v.images ?? []).forEach(img => {
        if (!img.previewUrl && img.nomFichier) {
          img.previewUrl = this.imageService.getImageFileUrl(img.nomFichier);
        }
      });
    });
  }

  getImageUrl(img: any): string {
    if (img?.previewUrl) return img.previewUrl;
    if (img?.nomFichier) return this.imageService.getImageFileUrl(img.nomFichier);
    return 'https://via.placeholder.com/400x200';
  }

  openDetails(vehicule: VehiculeDTO) {
    this.selectedVehicule = vehicule;
    this.selectedImageIndex = 0;
    this.showReservationForm = false; // réinitialiser le formulaire
  }

  closeDetails() {
    this.selectedVehicule = undefined;
    this.showReservationForm = false;
  }

  prevImage() {
    if (!this.selectedVehicule?.images?.length) return;
    const len = this.selectedVehicule.images.length;
    this.selectedImageIndex = (this.selectedImageIndex - 1 + len) % len;
  }

  nextImage() {
    if (!this.selectedVehicule?.images?.length) return;
    const len = this.selectedVehicule.images.length;
    this.selectedImageIndex = (this.selectedImageIndex + 1) % len;
  }

  trackByVehiculeId(index: number, item: VehiculeDTO) {
    return item.id;
  }

  submitReservation(veh: VehiculeDTO) {
    if (!veh.id) {
      alert('Véhicule invalide : id manquant !');
      return;
    }

    const request = {
      dateDebut: this.reservationForm.dateDebut,
      dateFin: this.reservationForm.dateFin,
      vehiculeId: veh.id
    };

    this.serviceReservation.createReservationVehi(request).subscribe({
      next: () => {
        alert('Réservation créée avec succès !');
        this.reservationForm = { dateDebut: '', dateFin: '' };
        this.showReservationForm = false;
      },
      error: (err) => {
        console.error('Erreur création réservation:', err);
        alert('Erreur lors de la création de la réservation.');
      }
    });
  }
}
