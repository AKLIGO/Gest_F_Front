import { StatusReservation } from "./StatutReservation";

export interface ReservationResponseDTO{
  id: number;                 // ID de la réservation
  dateDebut: string;          // string ISO (YYYY-MM-DD)
  dateFin: string;            // idem
  montant: number;            // Montant total de la réservation
  appartementNom: string;     // Nom de l'appartement
  appartementAdresse: string; // Adresse de l'appartement
  utilisateurNom: string;     // Nom de l'utilisateur
  utilisateurPrenoms: string; // Prénoms de l'utilisateur
  statut: StatusReservation;   // EN_ATTENTE, VALIDEE, ANNULEE
}