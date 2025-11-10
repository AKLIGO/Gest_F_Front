import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceApp } from '../../../../services/serviceApp/service-app';
import { ServiceImage } from '../../../../services/servicesImage/service-image';
import { ImageDTO } from '../../../../interfaces/gestions/image/ImageDTO';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import{UtilisateurService} from '../../../../services/utilisateur-service';
import { Utilisateurs } from '../../../../interfaces/Utilisateurs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-image-app-p',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './image-app-p.html',
  styleUrl: './image-app-p.css'
})
export class ImageAppP implements OnInit{
  libelle:string='';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isUploading: boolean = false;
  dragOver: boolean = false;
  appartementId: number | null = null;
  message: string = '';
  errorMessage: string='';
  isSuccess: boolean = false;
  currentUser: Utilisateurs | null = null;
  appartements:{id:number, nom:string}[]=[];

  images:ImageDTO[]=[];
  selectedImage:ImageDTO | null = null;


loadCurrentUser():void{
  this.currentUser = this.utilisateurService.currentUser();
  if (this.currentUser?.id){
    this.getAppartementsConnected();
  } else{
    this.errorMessage='utilisateur non connecter';
  }
}


getAppartementsConnected(): void {
  this.serviceImage.getAppartementsConnected().subscribe({
    next: (data) => {
      this.images = data.map(img => ({
        ...img,
        previewUrl: this.serviceImage.getImageFileUrl(img.nomFichier)
      }));
    },
    error: (err) => console.error('Erreur de chargement des images', err)
  });
}


editImageAppart(img: ImageDTO): void {
  if (!img.id) return;

  // Ouvre une boîte de dialogue pour modifier le libellé
  const updatedLibelle = prompt('Entrez le nouveau libellé de l’image :', img.libelle);
  if (updatedLibelle === null || updatedLibelle.trim() === '') return; // annulation ou champ vide

  // Crée un nouvel objet DTO à partir de l’image existante
  const updatedDto: ImageDTO = {
    id: img.id,
    libelle: updatedLibelle.trim(),
    nomFichier: img.nomFichier,
    typeMime: img.typeMime,
    appartementId: img.appartementId,
    previewUrl: this.serviceImage.getImageFileUrl(img.nomFichier) // URL d’affichage
  };

  // Appel du service pour mettre à jour
  this.serviceImage.updateAppartementImage(img.id, updatedDto).subscribe({
    next: (res) => {
      this.message = '✅ Image mise à jour avec succès !';
      this.isSuccess = true;
      this.getAppartementsConnected(); // recharge la liste
    },
    error: (err) => {
      this.message = '❌ Erreur lors de la mise à jour de l’image.';
      this.isSuccess = false;
      console.error('Erreur update image appartement:', err);
    }
  });
}

deleteImageAppart(id: number): void {
  if (!confirm('Voulez-vous vraiment supprimer cette image ?')) return;

  this.serviceImage.deleteAppartementImage(id).subscribe({
    next: () => {
      this.message = 'Image supprimée avec succès !';
      this.isSuccess = true;
      // Actualiser la liste après suppression
      this.getAppartementsConnected();
    },
    error: (err) => {
      this.message = 'Erreur lors de la suppression de l\'image.';
      this.isSuccess = false;
      console.error(err);
    }
  });
}



  constructor(
    private serviceImage:ServiceImage,
    private router:Router,
    private serviceApp:ServiceApp,
    private utilisateurService:UtilisateurService
  ){}

  ngOnInit():void{
    this.loadAppartements();
    this.getAppartementsConnected();

  }
    loadAppartements():void{
      this.serviceApp.getAllAppartementDto().subscribe({
        next:(data)=> this.appartements=data.map(appart=>({id:appart.id as number, nom:appart.nom})),
        error:(err)=> console.error('Erreur lors du chargement des appartements:', err)
      });
    }

  // selection du fichier

  onFileSelected(event:any):void{

    const file=event.target.files[0];

    if(file){
      this.handleFileSelection(file);
    }

  }

  private handleFileSelection(file:File): void{
      this.selectedFile=file;
      this.createPreview(file);
  }



  //creation de l'appercu de l'image
  private createPreview(file:File):void{
    const reader = new FileReader();
    reader.onload=(e:any)=> {
      this.previewUrl=e.target.result;
    };

    reader.readAsDataURL(file);
  }

  //Upload de l'image

  uploadImage():void{
    if (!this.selectedFile) {
      console.warn("Aucun fichier sélectionné !");
      return;
    }
    this.isUploading=true;
    this.serviceImage.uploadImageWithAppartement(this.libelle, this.selectedFile,this.appartementId as number)
          .subscribe({
             next:(response)=>{
              this.router.navigate(['/appartement']);
             }
          })

  }

  /**
   * Reinitialisation du formulaire
   */

  private resetForm(): void{
    this.libelle='';
    this.selectedFile=null;
    this.previewUrl=null;
    this.isUploading=false;
    this.appartementId=null;
  }

  /**
   * Suppression de l'appercu
   */

  removePreview():void {
    this.selectedFile=null;
    this.previewUrl = null;
  }


  //gestion du drag et du drog

  onDragOver(event:DragEvent):void{
    event.preventDefault();
    event.stopPropagation();
    this.dragOver=true;
  }

  onDragLeave(event:DragEvent):void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver=false;
  }

  onDrop(event:DragEvent):void{
    event.preventDefault();
    event.stopPropagation();
    this.dragOver= false;

    const files =event.dataTransfer?.files;
    if(files && files?.length > 0) {
      this.handleFileSelection(files[0]);
    }
}
}
