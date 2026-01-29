import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationRequest } from '../../interfaces/gestions/Reservations/ReservationRequest';
import { Reservations } from '../../interfaces/gestions/Reservations/Reservations';
import { ReservationResponseDTO } from '../../interfaces/gestions/Reservations/ReservationResponseDTO';
import { ReservationRequestVehi } from '../../interfaces/gestions/Reservations/ReservationRequestVehi';
import { ReservationResponseVehi } from '../../interfaces/gestions/Reservations/ReservationResponseVehi';
import { CancellationInfoDTO } from '../../interfaces/gestions/Reservations/CancellationInfoDTO';
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

    // Mise à jour complète d'une réservation
    updateReservation(id: number, request: ReservationRequest): Observable<ReservationResponseDTO> {
    return this.http.put<ReservationResponseDTO>(`${this.apiUrl}/${id}`, request);
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

  // Mise à jour complète d'une réservation de véhicule
  updateReservationVehi(id: number, request: ReservationRequestVehi): Observable<ReservationResponseVehi> {
    return this.http.put<ReservationResponseVehi>(`${this.apiUrls}/${id}`, request);
  }

  // Récupérer toutes les réservations de véhicules
  getAllReservationsVehicules(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/vehicules`);
  }

  //Vehi Récupérer les réservations d'un propriétaire spécifique pour véhicules
  getReservationsVehiByProprietaire(proprietaireId: number): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/proprietaire/${proprietaireId}`);
  }

  //Vehi Récupérer les réservations de véhicules de l'utilisateur connecté
  getMesReservationsVehicules(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/mes-reservations-vehicules`);
  }

  //App Service pour récupérer les réservations du propriétaire connecté
getReservationsByCurrentUser(): Observable<ReservationResponseDTO[]> {
  return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/mes-reservations`);
}

// Service pour récupérer les réservations d'un propriétaire spécifique
getReservationsByProprietaire(proprietaireId: number): Observable<ReservationResponseDTO[]> {
  return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
}




  // 🔹 Réservations appartements de l'utilisateur connecté
  getAppartementsCurrentUser(): Observable<ReservationResponseDTO[]> {
    return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/appartements/me`);
  }



  // 🔹 Réservations appartements d'un utilisateur spécifique
  getAppartementsByUser(userId: number): Observable<ReservationResponseDTO[]> {
    return this.http.get<ReservationResponseDTO[]>(`${this.apiUrl}/appartements/user/${userId}`);
  }



    // 🔹 Réservations véhicules de l'utilisateur connecté
  getVehiculesCurrentUser(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/vehicules/me`);
  }

    getVehiculesCurrentUserP(): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/vehicules/mes`);
  }


    // 🔹 Réservations véhicules d'un utilisateur spécifique
  getVehiculesByUser(userId: number): Observable<ReservationResponseVehi[]> {
    return this.http.get<ReservationResponseVehi[]>(`${this.apiUrls}/vehicules/user/${userId}`);
  }

  // 🔹 Annulation de réservation (dans les 24h)
  /**
   * Vérifie si une réservation peut être annulée
   */
  canCancelReservation(reservationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${reservationId}/can-cancel`);
  }

  /**
   * Obtient les informations détaillées sur la possibilité d'annulation
   */
  getCancellationInfo(reservationId: number): Observable<CancellationInfoDTO> {
    return this.http.get<CancellationInfoDTO>(`${this.apiUrl}/${reservationId}/cancellation-info`);
  }

  /**
   * Annule une réservation
   */
  cancelReservation(reservationId: number): Observable<ReservationResponseDTO> {
    return this.http.post<ReservationResponseDTO>(`${this.apiUrl}/${reservationId}/cancel`, {});
  }

  // 🔹 Annulation de réservation véhicule (dans les 24h)
  /**
   * Vérifie si une réservation véhicule peut être annulée
   */
  canCancelReservationVehi(reservationId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrls}/${reservationId}/can-cancel`);
  }

  /**
   * Obtient les informations détaillées sur la possibilité d'annulation véhicule
   */
  getCancellationInfoVehi(reservationId: number): Observable<CancellationInfoDTO> {
    return this.http.get<CancellationInfoDTO>(`${this.apiUrls}/${reservationId}/cancellation-info`);
  }

  /**
   * Annule une réservation véhicule
   */
  cancelReservationVehi(reservationId: number): Observable<ReservationResponseVehi> {
    return this.http.post<ReservationResponseVehi>(`${this.apiUrls}/${reservationId}/cancel`, {});
  }

  // 🔹 Export Excel - Réservations Véhicules
  /**
   * Exporte toutes les réservations de véhicules en fichier Excel (Admin)
   */
  exportReservationsVehiculesToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrls}/vehicules/export/excel`, {
      responseType: 'blob'
    });
  }

  /**
   * Exporte les réservations de véhicules de l'utilisateur connecté en fichier Excel
   */
  exportMyReservationsVehiculesToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrls}/vehicules/me/export/excel`, {
      responseType: 'blob'
    });
  }

  // 🔹 Export Excel - Réservations Appartements
  /**
   * Exporte toutes les réservations d'appartements en fichier Excel (Admin)
   */
  exportReservationsAppartementsToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/appartements/export/excel`, {
      responseType: 'blob'
    });
  }

  /**
   * Exporte les réservations d'appartements de l'utilisateur connecté en fichier Excel
   */
  exportMyReservationsAppartementsToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/appartements/me/export/excel`, {
      responseType: 'blob'
    });
  }
}
