import { Utilisateurs } from "./Utilisateurs";

export interface AuthenticationResponse{
    token:string;
    user:Utilisateurs
}