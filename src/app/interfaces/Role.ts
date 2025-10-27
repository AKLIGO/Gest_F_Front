import { Utilisateurs } from "./Utilisateurs";

export interface Role{
    id?: number;
    name: string;
    utilisateur?: Utilisateurs[];

}