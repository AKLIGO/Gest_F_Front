import { AppartementCreate } from "../Appartement/AppartementCreate";
import { TypeImmeuble } from "./TypeImmeuble ";

export interface ImmeubleCreate{
    id: number;
    nbrAppartment: number;
    nbrEtage: number;
    nom: string;
    ville: string;
    description: string;
    type: TypeImmeuble; // TypeImmeuble 
    appartements?: AppartementCreate[]; // facultatif si tu ne charges pas les appartements

    createdAt: string; 
    lastModifiedDate?: string; // facultatif
}