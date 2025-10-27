import { Utilisateurs } from "./Utilisateurs";

export interface Token{
    id:number;
    token: string;
    createdAt?: Date;
    expiresAt?: Date;
    validatedAt?: Date;
    utilisateur?: Utilisateurs;
}