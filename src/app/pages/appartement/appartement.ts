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
import { ProprietaireService } from '../../services/serviceContact/ProprietaireService';
import { ProprietaireContactDTO } from '../../interfaces/ProprietaireContactDTO';
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
  contactProprietaire?: ProprietaireContactDTO;


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
    private serviceReservation: ServiceReservation,
    private proprietaireService: ProprietaireService
  ) {}

  ngOnInit(): void {
    this.serviceApp.getAllAppartementDto().subscribe({
      next: (data) => {
        this.appartements = data;
        this.filteredAppartements = [...data];
        this.rechercherAppartements();
        this.prepareCardImage(); // préparer les images pour affichage
      },
      error: (err) => console.error('Erreur chargement appartements:', err)
    });
  }

  afficherContactAppartement(appartementId: number) {
  console.log('Tentative de récupération du contact pour appartement:', appartementId);
  this.proprietaireService.getContactAppartement(appartementId)
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
          messageErreur = 'Aucun propriétaire trouvé pour cet appartement';
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


  /**
 * 🔎 Recherche des appartements (adresse + prix)
 */
rechercherAppartements(): void {
  this.serviceApp.rechercherAppartements(
    this.searchAdresse,
    this.minPrix ?? undefined,
    this.maxPrix ?? undefined
  ).subscribe({
    next: (data) => {
      this.filteredAppartements = data;
      this.prepareFilteredImages();
    },
    error: (err) => {
      console.error('Erreur lors de la recherche', err);
    }
  });
}
private prepareFilteredImages(): void {
  this.filteredAppartements.forEach(appart => {
    (appart.images ?? []).forEach(img => {
      if (!img.previewUrl && img.nomFichier) {
        img.previewUrl = this.imageService.getImageFileUrl(img.nomFichier);
      }
    });
  });
}




reinitialiserFiltres(): void {
  this.searchAdresse = '';
  this.minPrix = null;
  this.maxPrix = null;

  this.rechercherAppartements();
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
