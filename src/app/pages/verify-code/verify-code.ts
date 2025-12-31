import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.css'
})
export class VerifyCodeComponent implements OnInit {
  email: string = '';
  code: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'email depuis les query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onSubmit(): void {
    if (!this.email || !this.code) {
      this.errorMessage = 'Veuillez saisir votre email et le code reçu.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.passwordResetService.verifyCode(this.email, this.code).subscribe({
      next: () => {
        this.successMessage = 'Code vérifié avec succès !';
        this.loading = false;
        // Rediriger vers la page de réinitialisation
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { 
            queryParams: { email: this.email, code: this.code } 
          });
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la vérification du code', err);
        this.errorMessage = err.error || 'Code invalide ou expiré. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  resendCode(): void {
    if (!this.email) {
      this.errorMessage = 'Email manquant.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.passwordResetService.forgotPassword(this.email).subscribe({
      next: () => {
        this.successMessage = 'Un nouveau code a été envoyé à votre email.';
        this.loading = false;
        this.code = '';
      },
      error: (err) => {
        console.error('Erreur lors du renvoi du code', err);
        this.errorMessage = 'Impossible de renvoyer le code.';
        this.loading = false;
      }
    });
  }
}
