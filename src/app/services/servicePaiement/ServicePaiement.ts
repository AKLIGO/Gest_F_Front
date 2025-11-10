import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModePaiement } from '../../interfaces/gestions/paiements/ModePaiement';
import { Paiement } from '../../pages/paiement/paiement';
import { PaiementDTO } from '../../interfaces/gestions/paiements/PaiementDTO';
@Injectable({
  providedIn: 'root'
})
export class ServicePaiement {

  private apiUrl = 'http://localhost:8082/api/paiement';
  constructor(private http: HttpClient) {   };

    private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

effectuerPaiement(reservationId: number, montant: number, modePaiement: ModePaiement): Observable<Paiement> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const params = new HttpParams()
    .set('reservationId', reservationId.toString())
    .set('montant', montant.toString())
    .set('modePaiement', modePaiement);

  return this.http.post<Paiement>(
    `${this.apiUrl}/ajouter`,
    null,
    { headers, params }
  );
}


    // Récupérer tous les paiements
    getAllPaiements(): Observable<PaiementDTO[]> {
      return this.http.get<PaiementDTO[]>(`${this.apiUrl}/tous`);
    }

    // Récupérer un paiement par reservation
      getPaiementsByReservation(reservationId: number): Observable<PaiementDTO[]> {
            return this.http.get<PaiementDTO[]>(`${this.apiUrl}/reservation/${reservationId}`);
      }

        // Supprimer un paiement
  supprimerPaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimer/${id}`);
  }

    // Modifier un paiement
  modifierPaiement(
    id: number,
    montant?: number,
    modePaiement?: string,
    statut?: string
  ): Observable<PaiementDTO> {
    // Construction des paramètres optionnels
    const params: any = {};
    if (montant !== undefined) params.montant = montant;
    if (modePaiement) params.modePaiement = modePaiement;
    if (statut) params.statut = statut;

    return this.http.put<PaiementDTO>(`${this.apiUrl}/modifier/${id}`, null, { params });
  }

}