import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /**
   * stockage du token d'access
   */
  
    setAccessToken(token: string):void {
      localStorage.setItem('access_token',token);

    }

    /**
     * recuperation du token
     */

    getAccessToken(): string | null {
      return localStorage.getItem('access_token');
    }

    /**
     * verifier si un token existe
     */

    hasToken():boolean{
      return !! this.getAccessToken()
    }

    /**
     * verifier si le token est expirer
     */
    isTokenExpired():boolean{
      const token = this.getAccessToken();
      if (!token)
        return true;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(payload.exp*1000);
        return expirationDate < new Date();
      } catch (error) {
        return true;
      }
    }
    /**
     * Decodage du token pour avoir obtenir les informations utilisateur
     */

    getTokenPayLoad():any {
      const token = this.getAccessToken();
      if(!token)
        return null;
      try {
        return JSON.parse(atob(token.split('.')[1]));

      } catch (error){
        return null;
      }
    }
}
