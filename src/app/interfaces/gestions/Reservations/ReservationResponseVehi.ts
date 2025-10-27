export interface ReservationResponseVehi {
  id: number;                     // ID de la réservation
  dateDebut: string;              // Date de début (ISO string)
  dateFin: string;                // Date de fin (ISO string)
  vehiculeMarque: string;         // Marque du véhicule
  vehiculeImmatriculation: string;// Immatriculation du véhicule
  utilisateurNom: string;         // Nom de l'utilisateur
  utilisateurPrenoms: string;    // Prénoms de l'utilisateur
  statut: string;                 // Statut de la réservation
}