import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegistrationRequest } from '../interfaces/RegistrationRequest';
import { Observable } from 'rxjs';
import { Authentication } from '../interfaces/Authentication';
import { AuthenticationResponse } from '../interfaces/AuthenticationResponse';
import { Utilisateurs } from '../interfaces/Utilisateurs';
import { jwtDecode } from 'jwt-decode';
import { UserDto } from '../interfaces/UserDto';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private readonly baseUrl = 'http://localhost:8082/api/auth';
  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<Utilisateurs | null>(null);
  private _isLoading = signal<boolean>(false);
  private _isInitializing = signal<boolean>(true);

  constructor(private httpclient: HttpClient) {
    this.checkInitialAuthState();
  }

  register(request: RegistrationRequest): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}/addUser`, request);
  }

  authenticate(request: Authentication): Observable<AuthenticationResponse> {
    return this.httpclient.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, request);
  }

  activateAccount(token: string): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}/activation-account?token=${token}`, {});
  }

  checkToken(token: string): Observable<any> {
    return this.httpclient.get(`${this.baseUrl}/check-token?token=${token}`);
  }

  logout(): Observable<any> {
    return this.httpclient.post(`${this.baseUrl}/logout`, {});
  }

  storeToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

private checkInitialAuthState(): void {
    const token = this.getToken();
    if (token) {
        // Vérifier si le token est expiré
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationDate = new Date(payload.exp * 1000);
            if (expirationDate < new Date()) {
                // Token expiré
                this.removeToken();
                this._isAuthenticated.set(false);
                this._currentUser.set(null);
                return;
            }
        } catch (error) {
            // Token invalide
            this.removeToken();
            this._isAuthenticated.set(false);
            this._currentUser.set(null);
            return;
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this._isAuthenticated.set(true);

        this.httpclient.get<Utilisateurs>(`${this.baseUrl}/users/me`, { headers }).subscribe({
            next: (user) => {
                console.log('Utilisateur récupéré:', user);
                this._currentUser.set(user);
                this._isInitializing.set(false);
            },
            error: (error) => {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                this._isAuthenticated.set(false);
                this._currentUser.set(null);
                this.removeToken();
                this._isInitializing.set(false);
            }
        });
    } else {
        this._isAuthenticated.set(false);
        this._currentUser.set(null);
        this._isInitializing.set(false);
    }
}

  get isAuthenticatedd() {
    return this._isAuthenticated.asReadonly();
  }

  get currentUser() {
    return this._currentUser.asReadonly();
  }

  get isLoading() {
    return this._isLoading.asReadonly();
  }

  get isInitializing() {
    return this._isInitializing.asReadonly();
  }
  getUserInfo(): Observable<UserDto> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpclient.get<UserDto>(`${this.baseUrl}/users/me`, { headers });
  }

  login(user: Utilisateurs): void {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  logoutt(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this.removeToken();
  }

  updateUser(user: Utilisateurs): void {
    this._currentUser.set(user);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  hasRole(role: string): boolean {
    const user = this._currentUser();
    return user?.roles?.some(r => r.name === role) || false;
  }
}