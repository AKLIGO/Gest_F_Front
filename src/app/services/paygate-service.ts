import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientRequestDto } from '../interfaces/paiement/ClientRequestDto';
import { DepositResponseDto } from '../interfaces/paiement/DepositResponseDto';
import { CheckTransactionDto } from '../interfaces/paiement/CheckTransactionDto';
import { CheckResponseDTO } from '../interfaces/paiement/CheckResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class PaygateService {
  private baseUrl = 'http://localhost:8082/api/payGate';

  constructor(private http: HttpClient) {}

  /**
   * Initier un paiement mobile money
   */
  initiatePayment(request: ClientRequestDto): Observable<DepositResponseDto> {
    return this.http.post<DepositResponseDto>(`${this.baseUrl}/deposit`, request);
  }

  /**
   * Vérifier le statut d'une transaction
   */
  checkTransactionStatus(request: CheckTransactionDto): Observable<CheckResponseDTO> {
    return this.http.post<CheckResponseDTO>(`${this.baseUrl}/check-status`, request);
  }

  /**
   * Vérifier périodiquement le statut d'une transaction
   * @param txReference Référence de la transaction
   * @param authToken Token d'authentification
   * @param intervalMs Intervalle entre chaque vérification (par défaut 3000ms)
   * @param maxAttempts Nombre maximum de tentatives (par défaut 20)
   */
  pollTransactionStatus(
    txReference: string,
    authToken: string,
    intervalMs: number = 3000,
    maxAttempts: number = 20
  ): Observable<CheckResponseDTO> {
    return new Observable(observer => {
      let attempts = 0;
      
      const checkStatus = () => {
        if (attempts >= maxAttempts) {
          observer.error({ message: 'Délai d\'attente dépassé', status: 'timeout' });
          return;
        }

        attempts++;
        
        this.checkTransactionStatus({ tx_reference: txReference, auth_token: authToken })
          .subscribe({
            next: (response) => {
              // Status 1 = succès, 0 = en attente, -1 = échec
              if (response.status === 1) {
                observer.next(response);
                observer.complete();
              } else if (response.status === -1) {
                observer.error({ message: 'Paiement échoué', response });
              } else {
                // Continuer à vérifier
                setTimeout(checkStatus, intervalMs);
              }
            },
            error: (error) => {
              observer.error(error);
            }
          });
      };

      checkStatus();
    });
  }
}
