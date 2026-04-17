import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class confirm {

  private apiUrl = `${environment.apiBaseUrl}/api/auth`;
    
    constructor(private http:HttpClient) { }


    activateAccount(token: string): Observable<any> {
        const params=new HttpParams().set('token',token);
        return this.http.post(`${this.apiUrl}/activation-account`,null,{params, responseType: 'text'});
    }
 }