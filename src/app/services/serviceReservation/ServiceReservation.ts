import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationRequest } from '../../interfaces/gestions/Reservations/ReservationRequest';
import { Reservations } from '../../interfaces/gestions/Reservations/Reservations';
import { ReservationResponseDTO } from '../../interfaces/gestions/Reservations/ReservationResponseDTO';
import { ReservationRequestVehi } from '../../interfaces/gestions/Reservations/ReservationRequestVehi';  
import { ReservationResponseVehi } from '../../interfaces/gestions/Reservations/ReservationResponseVehi';
@Injectable({
  providedIn: 'root'
})
export class ServiceReservation {
    private apiUrl = 'http://localhost:8082/api/reservations';
    private apiUrls = 'http://localhost:8082/api/reservations/vehicule';
    constructor(private http: HttpClient) { }

    // Créer une nouvelle réservation
    createreservation(request: ReservationRequest):Observable<Reservations>{
      return this.http.post<Reservations>(this.apiUrl, request);
    }

    // Mise a jour du Statut d'une réservation
    updateReservationStatus(id: number, statut: string): Observable<ReservationResponseDTO> {
    return this.http.put<ReservationResponseDTO>(`${this.apiUrl}/${id}/status?statut=${statut}`, {});
  }

    // Récupérer toutes les réservations d'un appartement
  getReservationsByAppartement(appartementId: number): Observable<ReservationResponseDTO[]> {
    return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/appartement/${appartementId}`);
  }

    // Récupérer toutes les réservations lier uniquement aux appartements
  getAllReservations(): Observable<ReservationResponseDTO[]> {
    return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/appartements`);
  }
  /**
   * recuperer toutes les réservations lier uniquement aux véhicules
   */
  getAllReservationsVehi(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/vehicules`);
  } 
   

  /**
   * Supprimer une réservation par son ID
   * @param id ID de la réservation à supprimer
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * crrer la reservation d'un véhicule
   */
   
  createReservationVehi(request: ReservationRequestVehi): Observable<ReservationResponseVehi> {
    return this.http.post<ReservationResponseVehi>(this.apiUrls, request);
  }

  // Mettre à jour le statut d'une réservation de véhicule
  updateReservationVehiStatus(reservationId: number, nouveauStatut: string): Observable<ReservationResponseVehi> {
    return this.http.put<ReservationResponseVehi>(`${this.apiUrls}/${reservationId}/statut?nouveauStatut=${nouveauStatut}`, {});
  }

  // Récupérer toutes les réservations de véhicules
  getAllReservationsVehicules(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/vehicules`);
  }

  // Récupérer les réservations d'un propriétaire spécifique pour véhicules
  getReservationsVehiByProprietaire(proprietaireId: number): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/proprietaire/${proprietaireId}`);
  }

  // Récupérer les réservations de véhicules de l'utilisateur connecté
  getMesReservationsVehicules(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/mes-reservations-vehicules`);
  }

  // Service pour récupérer les réservations du propriétaire connecté
getReservationsByCurrentUser(): Observable<ReservationResponseDTO[]> {
  return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/mes-reservations`);
}

// Service pour récupérer les réservations d'un propriétaire spécifique
getReservationsByProprietaire(proprietaireId: number): Observable<ReservationResponseDTO[]> {
  return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
}


}