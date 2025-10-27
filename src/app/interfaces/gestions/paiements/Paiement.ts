import{ModePaiement}from'./ModePaiement';
import{StatutPaiement}from'./StatutPaiement';

export interface Paiement {
  id: number;
  montant: number;
  datePaiement: string;
  modePaiement: ModePaiement;
  statut: StatutPaiement;
  reservationId?: number;
  utilisateurId?: number;
}
