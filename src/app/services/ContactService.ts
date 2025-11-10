import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../interfaces/ContactMessage';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = 'http://localhost:8082/api/contact';

  constructor(private http: HttpClient) {}

  sendMessage(data: ContactMessage): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}