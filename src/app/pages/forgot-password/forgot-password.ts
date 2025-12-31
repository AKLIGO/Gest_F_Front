import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.errorMessage = 'Veuillez saisir votre adresse email.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.passwordResetService.forgotPassword(this.email).subscribe({
      next: () => {
        this.successMessage = 'Un code de réinitialisation a été envoyé à votre email.';
        this.loading = false;
        // Rediriger vers la page de vérification après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/verify-code'], { 
            queryParams: { email: this.email } 
          });
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la demande de réinitialisation', err);
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
}
