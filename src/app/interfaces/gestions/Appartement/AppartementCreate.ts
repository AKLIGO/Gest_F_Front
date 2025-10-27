import { ImagesCreate } from "../image/ImagesCreate";
import { StatutAppartement } from "./StatutAppartement";
import { TypeAppartement } from "./TypeAppartement";

export interface AppartementCreate{
    id: number;
    nom: string;
    
    adresse: string;
    prix:number;
    numero: number;
    superficie: string;
    nbrDePieces: number;
    description: string;
    type: TypeAppartement; 
    statut: StatutAppartement;
    createdAt: string; 
    lastModifiedDate?: string;
    immeubleId?: number; 
    proprietaireId:number;
    images?: ImagesCreate[];
}