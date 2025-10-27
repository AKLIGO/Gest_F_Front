
export interface ReservationRequest{
  dateDebut: string;      // en ISO string (ex: "2025-10-06")
  dateFin: string;        // idem
  appartementId: number;  // ID de l'appartement choisi
}