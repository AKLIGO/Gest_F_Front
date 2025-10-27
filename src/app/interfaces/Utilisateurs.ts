import { Role } from "./Role";

export interface Utilisateurs{
    id?: number;
    nom: string;
    prenoms:string;
    password?: string;  
    email: string;
    telephone?: string;
    adresse?: string;
    roles?: Role[];
    createdAt?: Date;
    lastModifiedDate?: Date;
    accountLocked?: boolean;
    enabled?: boolean;
    
    // Méthodes utilitaires
    getFullName?: () => string;
    
}