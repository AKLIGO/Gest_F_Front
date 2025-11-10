import { Component,OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateurs } from '../../../../interfaces/Utilisateurs';
import { ServiceImage } from '../../../../services/servicesImage/service-image';
import{UtilisateurService} from '../../../../services/utilisateur-service';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import{ VehiculeDTO } from '../../../../interfaces/gestions/Vehicules/VehiculeDTO';
import { VehiculeService } from '../../../../services/serviceVehicule/VehiculeService';
import { ImageDTOv } from '../../../../interfaces/gestions/image/ImageDTOv';

@Pipe({ name: 'filePreview' })
export class FilePreviewPipe implements PipeTransform {
  transform(file: File | null): string | null {
    if (!file) return null;
    return URL.createObjectURL(file);
  }
}
@Component({
  selector: 'app-image-vehi-p',
  imports: [ReactiveFormsModule,FormsModule, CommonModule,FilePreviewPipe],
  templateUrl: './image-vehi-p.html',
  styleUrl: './image-vehi-p.css'
})
export class ImageVehiP implements OnInit {

  file: File | null = null;
    libelle: string = '';
    immatriculationVehicule: string = '';
     currentUser: Utilisateurs | null = null;
    message: string = '';
    errorMessage = '';
    isSuccess: boolean = false;
  
    vehicules: VehiculeDTO[] = [];
  
    imagesVehicules:ImageDTOv[]=[];
  
  
  
    constructor(
      private imageService: ServiceImage,
      private vehiculeService: VehiculeService,
      private utilisateurService:UtilisateurService,
      private router:Router
    ) {}
  
    ngOnInit(): void {
      this.loadCurrentUser();
      this.loadVehicules();
      this.getVehiculesConnected();
    }

    loadCurrentUser():void{
      this.currentUser = this.utilisateurService.currentUser();
      if (this.currentUser?.id){
        this.getVehiculesConnected();
      } else{
        this.errorMessage='utilisateur non connecter';
      }
    }
  
    getImageFileUrl(fileName: string): string {
    return this.imageService.getImageFileUrl(fileName);
  }
  
  getImageUrl(img: ImageDTOv): string {
    if (img?.nomFichier) return this.imageService.getImageFileUrl(img.nomFichier);
    return 'https://via.placeholder.com/400x200';
  }
  
  getImmatriculationFromId(vehiculeId?: number): string {
    if (!vehiculeId) return '';
    const vehicule = this.vehicules.find(v => v.id === vehiculeId);
    return vehicule ? vehicule.immatriculation : '';
  }
  
  
  
  
    getVehiculesConnected():void{
      this.imageService.getVehiculesConnected().subscribe({
        next:data => this.imagesVehicules=data,
        error:err =>console.error('Erreur de chargement des images',err)
      });
      
    }
  
    loadVehicules(): void {
      this.vehiculeService.listVehicules().subscribe({
        next: (data) => this.vehicules = data,
        error: (err) => {
          console.error('Erreur de chargement des véhicules', err);
          this.message = 'Impossible de charger les véhicules.';
          this.isSuccess = false;
        }
      });
    }
  
    onFileSelected(event: any): void {
      const selected = event.target.files?.[0];
      if (selected) {
        this.file = selected;
      }
    }
  
    uploadImage(): void {
      // Validation
      if (!this.file) {
        this.message = 'Veuillez sélectionner un fichier.';
        this.isSuccess = false;
        return;
      }
      if (!this.libelle.trim()) {
        this.message = 'Veuillez saisir un libellé.';
        this.isSuccess = false;
        return;
      }
      if (!this.immatriculationVehicule) {
        this.message = 'Veuillez sélectionner un véhicule.';
        this.isSuccess = false;
        return;
      }
  
      // Appel service
      this.imageService.uploadImageToVehicule(
         this.libelle,
        this.file,
        this.immatriculationVehicule
       
      ).subscribe({
        next: (response) => {
          this.message = 'Image ajoutée avec succès !';
          this.isSuccess = true;
          console.log('Upload réussi:', response);
          this.resetForm();
        },
        error: (err) => {
          this.message = err.error || 'Erreur lors de l\'upload de l\'image.';
          this.isSuccess = false;
          console.error('Erreur upload:', err);
        }
      });
    }
  
    resetForm(): void {
      this.file = null;
      this.libelle = '';
      this.immatriculationVehicule = '';
      // Réinitialiser le input type="file"
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  
  
  
    // Modifier une image
  editImage(img: ImageDTOv): void {
    if (!img.id) return;
  
    const updatedLibelle = prompt('Entrez le nouveau libellé', img.libelle);
    if (updatedLibelle === null) return; // annulation
  
    const updatedDto: ImageDTOv = {
      libelle: updatedLibelle,
      nomFichier: img.nomFichier,
      vehiculeId: img.vehiculeId,
      previewUrl: this.imageService.getImageFileUrl(img.nomFichier) 
    };
  
    this.imageService.updateVehiculeImage(img.id, updatedDto).subscribe({
      next: (res) => {
        this.message = 'Image mise à jour avec succès !';
        this.isSuccess = true;
        // Actualiser la liste
        this.getVehiculesConnected();
      },
      error: (err) => {
        this.message = 'Erreur lors de la mise à jour de l\'image.';
        this.isSuccess = false;
        console.error(err);
      }
    });
  }
  
  // Supprimer une image
  deleteImage(id?: number): void {
    if (!id) return;
    const confirmDelete = confirm('Voulez-vous vraiment supprimer cette image ?');
    if (!confirmDelete) return;
  
    this.imageService.deleteVehiculeImage(id).subscribe({
      next: () => {
        this.message = 'Image supprimée avec succès !';
        this.isSuccess = true;
        // Actualiser la liste
        this.getVehiculesConnected();
      },
      error: (err) => {
        this.message = 'Erreur lors de la suppression de l\'image.';
        this.isSuccess = false;
        console.error(err);
      }
    });
  }
  

}
