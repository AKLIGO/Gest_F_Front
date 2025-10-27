import{ModePaiement}from'./ModePaiement';
import{StatutPaiement}from'./StatutPaiement';


export interface PaiementDTO {
  id: number;
  montant: number;
  datePaiement: string; // ou Date si tu utilises des objets Date en Angular
  modePaiement: ModePaiement;
  statut: StatutPaiement;
  reservationId: number;
  utilisateurId?: number;
  utilisateurNom?: string;
  utilisateurTelephone?: string;
}