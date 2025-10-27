import { ImageDTO } from "../image/ImageDTO";
import { StatutAppartement } from "./StatutAppartement";
import { TypeAppartement } from "./TypeAppartement";

export interface AppartementDTO {
    id: number;
    nom: string;
    adresse: string;
    numero: number;
    superficie: string;
    nbrDePieces: number;
    description: string;
    prix: number;
    type: TypeAppartement; 
    statut: StatutAppartement;
    createdAt: string;
    lastModifiedDate: string; 
    images: ImageDTO[];
  }