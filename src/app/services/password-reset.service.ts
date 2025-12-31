import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:8082/api/password-reset';

  constructor(private http: HttpClient) {}

  /**
   * Demande un code de réinitialisation par email
   */
  forgotPassword(email: string): Observable<void> {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, null, { params });
  }

  /**
   * Vérifie le code de réinitialisation
   */
  verifyCode(email: string, code: string): Observable<void> {
    const params = new HttpParams()
      .set('email', email)
      .set('code', code);
    return this.http.post<void>(`${this.apiUrl}/verify-code`, null, { params });
  }

  /**
   * Réinitialise le mot de passe avec le code validé
   */
  resetPassword(email: string, code: string, newPassword: string): Observable<void> {
    const params = new HttpParams()
      .set('email', email)
      .set('code', code)
      .set('newPassword', newPassword);
    return this.http.post<void>(`${this.apiUrl}/reset-password`, null, { params });
  }
}
