import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImmeubleCreate } from '../../interfaces/gestions/Immeuble/ImmeubleCreate';
@Injectable({
  providedIn: 'root'
})
export class ServiceImm {

  private apiUrl = 'http://localhost:8082/api/immeubles';

  constructor(private http: HttpClient){};

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // ou sessionStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  /**
   * Recuperer tous les immeubles
   */

  getAllImmeubles():Observable<ImmeubleCreate[]>{
    return this.http.get<ImmeubleCreate[]>(this.apiUrl,{ headers: this.getHeaders() });
  }

  // ajouter un nouvel immeuble

  addImmeuble(newImmeuble: ImmeubleCreate):Observable<ImmeubleCreate>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<ImmeubleCreate>(this.apiUrl,newImmeuble,{ headers});
  }

  /**
   * suprimer un immeuble
   
   */
  
    deleteImmeuble(id:number):Observable<void>{
      console.log('Appel API DELETE:', `${this.apiUrl}/${id}`);
      return this.http.delete<void>(`${this.apiUrl}/${id}`,{ headers: this.getHeaders() });

    }

    /**
     * mettre a jour un immeuble
     */
    
    updateImmeuble(id:number, immeubleUpdate:ImmeubleCreate):Observable<ImmeubleCreate>{
      return this.http.put<ImmeubleCreate>(`${this.apiUrl}/${id}`,immeubleUpdate,{ headers: this.getHeaders() });
    }

    
}
