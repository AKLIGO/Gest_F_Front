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
import { ProprietaireService } from '../../services/serviceContact/ProprietaireService';
import { ProprietaireContactDTO } from '../../interfaces/ProprietaireContactDTO';

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
  contactProprietaire?: ProprietaireContactDTO;
  StatutVehicule = StatutVehicule;
  TypeVehicule = TypeVehicule;
  Carburant = Carburant;
  marqueRecherche: string = '';
  prixMin?: number;
  prixMax?: number;

  showReservationForm = false;
  reservationForm = {
    dateDebut: '',
    dateFin: ''
  };

  constructor(
    private vehiculeService: VehiculeService,
    private imageService: ServiceImage,
    private serviceReservation: ServiceReservation,
    private proprietaireService: ProprietaireService
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
    this.contactProprietaire = undefined;
  }

  copyToClipboard(text: string) {
    if (!text) {
      alert('Aucune valeur à copier');
      return;
    }
    
    // S'assurer que c'est bien une chaîne de caractères
    const textToCopy = String(text).trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert(`Copié : ${textToCopy}`);
    }).catch(err => {
      console.error('Erreur lors de la copie:', err);
      // Fallback pour les anciens navigateurs
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert(`Copié : ${textToCopy}`);
      } catch (err) {
        alert('Impossible de copier');
      }
      document.body.removeChild(textArea);
    });
  }

  afficherContactVehicule(vehiculeId: number) {
    console.log('Tentative de récupération du contact pour véhicule:', vehiculeId);
    this.proprietaireService.getContactVehicule(vehiculeId)
      .subscribe({
        next: (data) => {
          console.log('✅ Contact récupéré avec succès:', data);
          console.log('Type de data:', typeof data);
          console.log('Data stringifié:', JSON.stringify(data));
          
          // Vérifier si data est un objet valide
          if (data && typeof data === 'object') {
            this.contactProprietaire = data;
          } else {
            console.error('❌ Format de réponse inattendu:', data);
            this.contactProprietaire = { 
              nom: '', 
              email: 'Format de réponse invalide', 
              telephone: '', 
              mailtoLink: '' 
            };
          }
        },
        error: (err) => {
          console.error('❌ Erreur récupération contact:', err);
          console.error('Status:', err.status);
          console.error('StatusText:', err.statusText);
          console.error('Error object:', err.error);
          console.error('Message:', err.message);
          
          let messageErreur = '';
          if (err.status === 404) {
            messageErreur = 'Aucun propriétaire trouvé pour ce véhicule';
          } else if (err.status === 0) {
            messageErreur = 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
          } else if (err.status === 200) {
            messageErreur = 'Erreur de parsing de la réponse. Vérifiez le format retourné par le backend.';
          } else {
            messageErreur = `Erreur ${err.status}: ${err.statusText || 'Impossible de récupérer le contact'}`;
          }
          this.contactProprietaire = { nom: '', email: messageErreur, telephone: '', mailtoLink: '' };
        }
      });
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
  /**
   * 17-12-2025
   * ajouter la gestion de recherche des véhicules
   */

  rechercherVehicules() {
  this.vehiculeService.rechercherVehicules(
    this.marqueRecherche,
    this.prixMin,
    this.prixMax
  ).subscribe({
    next: data => {
      this.vehicules = data;
      this.prepareImages();
    },
    error: err => console.error('Erreur recherche véhicules:', err)
  });
}
resetRecherche() {
  this.marqueRecherche = '';
  this.prixMin = undefined;
  this.prixMax = undefined;
  this.loadVehicules(); // recharge tous les véhicules
}


}
