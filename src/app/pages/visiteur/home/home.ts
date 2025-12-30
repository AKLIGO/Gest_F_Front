import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // pour ngModel
import { AppartementDTO } from '../../../interfaces/gestions/Appartement/AppartementDTO';
import { StatutAppartement } from '../../../interfaces/gestions/Appartement/StatutAppartement';
import { TypeAppartement } from '../../../interfaces/gestions/Appartement/TypeAppartement';
import { ImagesCreate } from '../../../interfaces/gestions/image/ImagesCreate';
import { ServiceApp } from '../../../services/serviceApp/service-app';
import { ServiceReservation } from '../../../services/serviceReservation/ServiceReservation';
import { ServiceImage } from '../../../services/servicesImage/service-image';
import { ProprietaireService } from '../../../services/serviceContact/ProprietaireService';
import { ProprietaireContactDTO } from '../../../interfaces/ProprietaireContactDTO';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,CurrencyPipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
    animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class Home implements OnInit,OnDestroy {

  appartements: AppartementDTO[] = [];
  pagedAppartements: AppartementDTO[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  totalPages: number = 1;
  selectedImageIndex: number = 0;
selectedAppartementForReservation?: AppartementDTO;
  selectedAppartement?: AppartementDTO;
  contactProprietaire?: ProprietaireContactDTO;

  StatutAppartement = StatutAppartement;
  TypeAppartement = TypeAppartement;

  reservationForm = {
  dateDebut: '',
  dateFin: ''
};
  constructor(private serviceApp: ServiceApp, private imageService:ServiceImage,private serviceReservation:ServiceReservation, private proprietaireService: ProprietaireService) {}
/**
 * affichages des images a l'accueil
 */
images:string[] = [];
currentImageIndex: number = 0;
intervalId: any;
readonly baseUrl='http://localhost:8082/api/image/file/';

  /**
   * Gestion des images
   */
  loadImages(){
    this.imageService.getAllImagesLibres().subscribe({
      next:(data:ImagesCreate[]) => {
        this.images=data.map(img => this.baseUrl+img.nomFichier);
        if(this.images.length>0) this.startSlider();
      },
    })
  }

  startSlider(){
    this.intervalId = setInterval(() => {
      this.currentImageIndex =(this.currentImageIndex +1) % this.images.length
    }, 3000);
  }

  ngOnDestroy(): void {
    if(this.intervalId){
      clearInterval(this.intervalId);
    }
  }





  ngOnInit(): void {

      // Charger les images libres dès l'initialisation
  this.loadImages();
    this.serviceApp.getAllAppartementDto().subscribe({
      next: (data) => {
        this.appartements = data;
        this.totalPages = Math.ceil(this.appartements.length / this.pageSize);
        this.updatePagedAppartements();


    /**
     * preparer les images
     */
    this.prepareCardImage();
      },
      error: (err) => console.error('Erreur chargement appartements:', err)
    });

  }

showReservationForm(appart: AppartementDTO) {
  // Si c’est déjà le même appartement, on cache le formulaire
  if (this.selectedAppartementForReservation?.id === appart.id) {
    this.selectedAppartementForReservation = undefined;
    this.reservationForm = { dateDebut: '', dateFin: '' };
  } else {
    this.selectedAppartementForReservation = appart;
    this.reservationForm = { dateDebut: '', dateFin: '' };
  }
}

  updatePagedAppartements() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedAppartements = this.appartements.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedAppartements();
  }

  deleteAppartement(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet appartement ?')) {
      this.serviceApp.deleteAppartement(id).subscribe({
        next: () => {
          this.appartements = this.appartements.filter(a => a.id !== id);
          this.totalPages = Math.ceil(this.appartements.length / this.pageSize);
          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          this.updatePagedAppartements();
        },
        error: (err) => console.error('Erreur suppression appartement:', err)
      });
    }
  }

  openDetails(appart: AppartementDTO) {
    this.selectedAppartement = appart;
    this.selectedImageIndex = 0;

  }

    // navigation images modal
  prevImage(): void {
    if (!this.selectedAppartement) return;
    const len = (this.selectedAppartement.images ?? []).length;
    if (len <= 1) return;
    this.selectedImageIndex = (this.selectedImageIndex - 1 + len) % len;
  }

  nextImage(): void {
    if (!this.selectedAppartement) return;
    const len = (this.selectedAppartement.images ?? []).length;
    if (len <= 1) return;
    this.selectedImageIndex = (this.selectedImageIndex + 1) % len;
  }

  closeDetails() {
    this.selectedAppartement = undefined;
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

  trackByAppartementId(index: number, item: AppartementDTO) {
    return item.id;
  }

  /**
   * Prepare la preview des images pour affichage
   */

  private prepareCardImage(): void{
      this.appartements.forEach(appart=> {
        (appart.images ?? []).forEach(img => {
          if(!img.previewUrl && img.nomFichier){
            img.previewUrl = this.imageService.getImageFileUrl(img.nomFichier);
            console.log(`Image URL préparée: ${img.previewUrl}`);
          }
        });
      });
  }


  getImageUrl(img: any): string {
    // Si l’URL a déjà été préparée
    if (img?.previewUrl) return img.previewUrl;
    // Si le nom du fichier existe, génère l’URL
    if (img?.nomFichier) return this.imageService.getImageFileUrl(img.nomFichier);
    // Sinon, image par défaut
    return 'https://via.placeholder.com/400x200';
  }

  // getImageUrl(appart: AppartementDTO): string {
  //   return appart.images && appart.images.length > 0
  //     ? appart.images[0].previewUrl
  //     : 'https://via.placeholder.com/400x200';
  // }


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


openMap(localisation: string) {
  if (localisation) {
    window.open(localisation, '_blank');
  }
}

}
