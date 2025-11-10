import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppartementDTO } from '../../interfaces/gestions/Appartement/AppartementDTO';
import { StatutAppartement } from '../../interfaces/gestions/Appartement/StatutAppartement';
import { TypeAppartement } from '../../interfaces/gestions/Appartement/TypeAppartement';
import { ServiceApp } from '../../services/serviceApp/service-app';
import { ServiceReservation } from '../../services/serviceReservation/ServiceReservation';
import { ServiceImage } from '../../services/servicesImage/service-image';
@Component({
  selector: 'app-appartement',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './appartement.html',
  styleUrls: ['./appartement.css'],
    animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class Appartement implements OnInit {

  appartements: AppartementDTO[] = [];
  selectedImageIndex: number = 0;
  selectedAppartementForReservation?: AppartementDTO;
  selectedAppartement?: AppartementDTO;

  StatutAppartement = StatutAppartement;
  TypeAppartement = TypeAppartement;

  searchAdresse: string = '';
minPrix: number | null = null;
maxPrix: number | null = null;
appartementss: AppartementDTO[] = [];
filteredAppartements: AppartementDTO[] = [];

  reservationForm = {
    dateDebut: '',
    dateFin: ''
  };

  constructor(
    private serviceApp: ServiceApp,
    private imageService: ServiceImage,
    private serviceReservation: ServiceReservation
  ) {}

  ngOnInit(): void {
    this.serviceApp.getAllAppartementDto().subscribe({
      next: (data) => {
        this.appartements = data;
        this.filteredAppartements = [...data];
        this.prepareCardImage(); // préparer les images pour affichage
      },
      error: (err) => console.error('Erreur chargement appartements:', err)
    });
  }

filtrerAppartements() {
  this.filteredAppartements = this.appartements.filter(appart => {
    const correspondAdresse = this.searchAdresse
      ? appart.adresse?.toLowerCase().includes(this.searchAdresse.toLowerCase())
      : true;

    const correspondPrixMin = this.minPrix != null ? appart.prix >= this.minPrix : true;
    const correspondPrixMax = this.maxPrix != null ? appart.prix <= this.maxPrix : true;

    return correspondAdresse && correspondPrixMin && correspondPrixMax;
  });
}

reinitialiserFiltres() {
  this.searchAdresse = '';
  this.minPrix = null;
  this.maxPrix = null;
  this.filteredAppartements = [...this.appartements];
}

  showReservationForm(appart: AppartementDTO) {
    if (this.selectedAppartementForReservation?.id === appart.id) {
      this.selectedAppartementForReservation = undefined;
      this.reservationForm = { dateDebut: '', dateFin: '' };
    } else {
      this.selectedAppartementForReservation = appart;
      this.reservationForm = { dateDebut: '', dateFin: '' };
    }
  }

  deleteAppartement(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet appartement ?')) {
      this.serviceApp.deleteAppartement(id).subscribe({
        next: () => {
          this.appartements = this.appartements.filter(a => a.id !== id);
        },
        error: (err) => console.error('Erreur suppression appartement:', err)
      });
    }
  }

  openDetails(appart: AppartementDTO) {
    this.selectedAppartement = appart;
    this.selectedImageIndex = 0;
  }

  prevImage(): void {
    if (!this.selectedAppartement) return;
    const len = this.selectedAppartement.images?.length ?? 0;
    if (len <= 1) return;
    this.selectedImageIndex = (this.selectedImageIndex - 1 + len) % len;
  }

  nextImage(): void {
    if (!this.selectedAppartement) return;
    const len = this.selectedAppartement.images?.length ?? 0;
    if (len <= 1) return;
    this.selectedImageIndex = (this.selectedImageIndex + 1) % len;
  }

  closeDetails() {
    this.selectedAppartement = undefined;
  }

  trackByAppartementId(index: number, item: AppartementDTO) {
    return item.id;
  }

  private prepareCardImage(): void {
    this.appartements.forEach(appart => {
      (appart.images ?? []).forEach(img => {
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

  submitReservation(appart: AppartementDTO) {
    const request = {
      dateDebut: this.reservationForm.dateDebut,
      dateFin: this.reservationForm.dateFin,
      appartementId: appart.id
    };

    this.serviceReservation.createreservation(request).subscribe({
      next: () => {
        alert('Réservation créée avec succès !');
        this.selectedAppartementForReservation = undefined;
      },
      error: (err) => {
        console.error('Erreur création réservation:', err);
        alert('Erreur lors de la création de la réservation.');
      }
    });
  }



}
