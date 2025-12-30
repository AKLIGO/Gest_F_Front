import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class confirm {

    private apiUrl = 'http://localhost:8082/api/auth';
    
    constructor(private http:HttpClient) { }


    activateAccount(token: string): Observable<any> {
        const params=new HttpParams().set('token',token);
        return this.http.post(`${this.apiUrl}/activation-account`,null,{params, responseType: 'text'});
    }
 }