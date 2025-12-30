import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProprietaireContactDTO } from '../../interfaces/ProprietaireContactDTO';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {

  private baseUrl = 'http://localhost:8082/api/proprio'; // mettre ton URL backend

  constructor(private http: HttpClient) { }

  getContactAppartement(appartementId: number): Observable<ProprietaireContactDTO> {
    return this.http.get(`${this.baseUrl}/appartement/${appartementId}`, { 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map((response: any) => {
        console.log('Réponse brute du serveur:', response);
        console.log('Body:', response.body);
        console.log('Headers:', response.headers);
        
        try {
          // Essayer de parser comme JSON
          const parsed = JSON.parse(response.body);
          console.log('JSON parsé avec succès:', parsed);
          return parsed as ProprietaireContactDTO;
        } catch (e) {
          // Si ce n'est pas du JSON, traiter comme texte brut
          console.log('Pas du JSON, traitement comme texte brut');
          const text = response.body.trim();
          
          // Si c'est un email
          if (text.includes('@')) {
            return {
              nom: '',
              email: text,
              telephone: '',
              mailtoLink: `mailto:${text}`
            };
          }
          // Sinon c'est probablement un numéro de téléphone
          return {
            nom: '',
            email: '',
            telephone: text,
            mailtoLink: ''
          };
        }
      }),
      catchError(err => {
        console.error('Erreur dans le service:', err);
        throw err;
      })
    );
  }

  getContactVehicule(vehiculeId: number): Observable<ProprietaireContactDTO> {
    return this.http.get(`${this.baseUrl}/vehicule/${vehiculeId}`, { 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map((response: any) => {
        console.log('Réponse brute du serveur:', response);
        console.log('Body:', response.body);
        
        try {
          // Essayer de parser comme JSON
          const parsed = JSON.parse(response.body);
          console.log('JSON parsé avec succès:', parsed);
          return parsed as ProprietaireContactDTO;
        } catch (e) {
          // Si ce n'est pas du JSON, traiter comme texte brut
          console.log('Pas du JSON, traitement comme texte brut');
          const text = response.body.trim();
          
          // Si c'est un email
          if (text.includes('@')) {
            return {
              nom: '',
              email: text,
              telephone: '',
              mailtoLink: `mailto:${text}`
            };
          }
          // Sinon c'est probablement un numéro de téléphone
          return {
            nom: '',
            email: '',
            telephone: text,
            mailtoLink: ''
          };
        }
      }),
      catchError(err => {
        console.error('Erreur dans le service:', err);
        throw err;
      })
    );
  }
}
