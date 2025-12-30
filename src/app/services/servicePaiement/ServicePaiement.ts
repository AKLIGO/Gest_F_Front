import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModePaiement } from '../../interfaces/gestions/paiements/ModePaiement';
import { PaiementDTO } from '../../interfaces/gestions/paiements/PaiementDTO';
// import { PaiementDTO } from '../../interfaces/gestions/paiements/PaiementDTO';
@Injectable({
  providedIn: 'root'
})
export class ServicePaiement {

  private apiUrl = 'http://localhost:8082/api/paiement';
  constructor(private http: HttpClient) {   };

    private getHeaders(overrideToken?: string): HttpHeaders {
    // Priorité: overrideToken > localStorage token > window test token
    const token = overrideToken ?? localStorage.getItem('access_token') ?? (window as any).__TEST_ACCESS_TOKEN__;
    const headersObj: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersObj.Authorization = `Bearer ${token}`;
    }
    return new HttpHeaders(headersObj);
  }

effectuerPaiement(reservationId: number, montant: number, modePaiement: ModePaiement, overrideToken?: string): Observable<PaiementDTO> {
  const headers = this.getHeaders(overrideToken);

  const params = new HttpParams()
    .set('reservationId', reservationId.toString())
    .set('montant', montant.toString())
    .set('modePaiement', String(modePaiement));

  return this.http.post<PaiementDTO>(`${this.apiUrl}/ajouter`, null, { headers, params });
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
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/supprimer/${id}`, { headers });
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

    const headers = this.getHeaders();
    return this.http.put<PaiementDTO>(`${this.apiUrl}/modifier/${id}`, null, { params, headers });
  }

}