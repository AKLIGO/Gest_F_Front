import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagesCreate } from '../../interfaces/gestions/image/ImagesCreate';
import { ImageDTOv } from '../../interfaces/gestions/image/ImageDTOv';
import { ImageDTO } from '../../interfaces/gestions/image/ImageDTO';
@Injectable({
  providedIn: 'root'
})
export class ServiceImage {

  private apiUrl = 'http://localhost:8082/api/image';

  constructor(private http: HttpClient) {}

    /**
   * Upload image en liant à un appartement via son ID
   */
    uploadImageWithAppartement(libelle: string, file: File, appartementId: number): Observable<ImagesCreate> {
      const formData = new FormData();
      formData.append('libelle', libelle);
      formData.append('file', file);
      formData.append('appartementId', appartementId.toString());
  
      return this.http.post<ImagesCreate>(`${this.apiUrl}/ajoutImageApp`, formData);
    }

    uploadImageToVehicule(
    
    libelle: string,
    file: File,
    immatriculationVehicule: string,
  ): Observable<ImagesCreate | string> {

    const formData = new FormData();
    formData.append('libelle', libelle);
    formData.append('file', file);
    formData.append('immatriculationVehicule', immatriculationVehicule);

    return this.http.post<ImagesCreate | string>(`${this.apiUrl}/ajoutImageTovehicule`, formData);
  }

      //   //liste des images
      //   getAllImages():Observable<ImagesCreate[]>{
      //     return this.http.get<ImagesCreate[]>(this.apiUrl);
  
      // }

        /**
   * Upload image en liant à un appartement via son nom
   */
  uploadImageWithAppartementByName(libelle: string, file: File, appartementNom: string): Observable<ImagesCreate> {
    const formData = new FormData();
    formData.append('libelle', libelle);
    formData.append('file', file);
    formData.append('appartementNom', appartementNom);

    return this.http.post<ImagesCreate>(`${this.apiUrl}/ajoutImaAppNom`, formData);
  }

  /**
   * recuperer une image a partir de son identifiant
   */

  getImageById(id:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Recuperation du fichier physique
   */

  getImageFileUrl(fileName: string): string {
    return `${this.apiUrl}/file/${encodeURIComponent(fileName)}`;
  }

  /**
   * 
   * @param fileName facultative
   * @returns 
   */
  getImageFileUrls(fileName: string): string {
    return `${this.apiUrl}/file/${fileName}`;  
}
    // Récupérer toutes les images libres
  getAllImagesLibres(): Observable<ImagesCreate[]> {
    return this.http.get<ImagesCreate[]>(`${this.apiUrl}/libres`);
  }

    // Uploader une image libre
  uploadImageLibre(libelle: string, file: File): Observable<ImagesCreate> {
    const formData = new FormData();
    formData.append('libelle', libelle);
    formData.append('file', file, file.name);
    return this.http.post<ImagesCreate>(`${this.apiUrl}/upload`, formData);
  }

   //creer une url d'image
//    createImageUrl(blob:Blob):string{   
//     return URL.createObjectURL(blob);
// }

 listImagesVehicules(): Observable<ImageDTOv[]> {
    return this.http.get<ImageDTOv[]>(`${this.apiUrl}/vehicules`);
  }


  // --------- VEHICULE ---------
  updateVehiculeImage(id: number, dto: ImageDTOv): Observable<ImageDTOv> {
    return this.http.put<ImageDTOv>(`${this.apiUrl}/vehicule/${id}`, dto);
  }

  deleteVehiculeImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicule/${id}`);
  }

  // --------- APPARTEMENT ---------
  updateAppartementImage(id: number, dto: ImageDTO): Observable<ImageDTO> {
    return this.http.put<ImageDTO>(`${this.apiUrl}/appartement/${id}`, dto);
  }

  deleteAppartementImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appartement/${id}`);
  }



  listImagesAppartements(): Observable<ImageDTO[]> {
    return this.http.get<ImageDTO[]>(`${this.apiUrl}/appartements`);
  }

  
}
