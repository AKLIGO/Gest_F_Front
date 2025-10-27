import { AppartementCreate } from '../Appartement/AppartementCreate';
import{StatusReservation} from './StatutReservation';
import { TypeDeRervation } from './TypeDeRervation';
export interface Reservations{
    id?: number;
    dateDebut: Date;
    dateFin: Date;
    montant: number;
    appartement?: AppartementCreate;
    type:TypeDeRervation;
    status:StatusReservation;
    utilisateurId: number;
    createdAt?: string;
    updatedAt?: string;
}