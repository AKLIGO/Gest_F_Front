import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../interfaces/ContactMessage';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiBaseUrl}/api/contact`;

  constructor(private http: HttpClient) {}

  sendMessage(data: ContactMessage): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}