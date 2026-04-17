import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehiculeDTO } from '../../interfaces/gestions/Vehicules/VehiculeDTO';
import { ImageDTOv } from '../../interfaces/gestions/image/ImageDTOv';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private baseUrl = `${environment.apiBaseUrl}/api/vehicules`;

  constructor(private http: HttpClient) {}


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
  

  // Ajouter un véhicule
  addVehicule(vehicule: VehiculeDTO): Observable<VehiculeDTO> {
    return this.http.post<VehiculeDTO>(`${this.baseUrl}/ajouter`, vehicule);
  }

  // Mettre à jour un véhicule
  updateVehicule(id: number, vehicule: VehiculeDTO): Observable<VehiculeDTO> {
    return this.http.put<VehiculeDTO>(`${this.baseUrl}/modifier/${id}`, vehicule);
  }

  // Supprimer un véhicule
  removeVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/supprimer/${id}`);
  }

  // Changer le statut d’un véhicule
  changerStatut(id: number, statut: string): Observable<VehiculeDTO> {
    return this.http.patch<VehiculeDTO>(`${this.baseUrl}/${id}/statut?statut=${statut}`, {});
  }

  // Lister tous les véhicules
  listVehicules(): Observable<VehiculeDTO[]> {
    return this.http.get<VehiculeDTO[]>(`${this.baseUrl}/list`);
  }

    // 1️⃣ Lister tous les véhicules
  listVehiculesVue(): Observable<VehiculeDTO[]> {
    return this.http.get<VehiculeDTO[]>(`${this.baseUrl}/lists`);
  }

  // Vérifier si un véhicule est disponible
  isDisponible(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${id}/disponible`);
  }

  // Obtenir un véhicule par id
  getVehiculeById(id: number): Observable<VehiculeDTO> {
    return this.http.get<VehiculeDTO>(`${this.baseUrl}/${id}`);
  }

  // Obtenir les images associées à un véhicule
  getImagesVehicule(id: number): Observable<ImageDTOv[]> {
    return this.http.get<ImageDTOv[]>(`${this.baseUrl}/${id}/images`);
  }

  // Récupérer les véhicules d'un propriétaire spécifique
  getVehiculesByProprietaire(proprietaireId: number): Observable<VehiculeDTO[]> {
    return this.http.get<VehiculeDTO[]>(`${this.baseUrl}/proprietaire/${proprietaireId}`);
  }

  // Récupérer mes véhicules (pour l'utilisateur connecté)
  getMesVehicules(): Observable<VehiculeDTO[]> {
    return this.http.get<VehiculeDTO[]>(`${this.baseUrl}/mes-vehicules`);
  }

  /**
   * Publier / dépublier un véhicule (autoriser l'affichage)
   */
  autoriserAffichage(id: number, publie: boolean): Observable<VehiculeDTO> {
    return this.http.put<VehiculeDTO>(`${this.baseUrl}/${id}/publication?publie=${publie}`, {}, { headers: this.getHeaders() });
  }

  /**
   * 17-12-2025
 * 🔎 Rechercher des véhicules (marque + prix)
 */
rechercherVehicules(
  marque?: string,
  prixMin?: number,
  prixMax?: number
): Observable<VehiculeDTO[]> {

  let params: any = {};

  if (marque && marque.trim() !== '') {
    params.marque = marque;
  }

  if (prixMin !== undefined && prixMin !== null) {
    params.prixMin = prixMin;
  }

  if (prixMax !== undefined && prixMax !== null) {
    params.prixMax = prixMax;
  }

  return this.http.get<VehiculeDTO[]>(
    `${this.baseUrl}/recherche`,
    { params }
  );
}

}
