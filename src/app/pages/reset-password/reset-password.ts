import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PasswordResetService } from '../../services/password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer email et code depuis les query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';
    });

    // Si email ou code manquant, rediriger vers forgot-password
    if (!this.email || !this.code) {
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(): void {
    // Validation
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.passwordResetService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe réinitialisé avec succès !';
        this.loading = false;
        // Rediriger vers la page de connexion
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la réinitialisation du mot de passe', err);
        this.errorMessage = err.error || 'Une erreur est survenue. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): string {
    if (!this.newPassword) return '';
    if (this.newPassword.length < 6) return 'Faible';
    if (this.newPassword.length < 10) return 'Moyen';
    return 'Fort';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength === 'Faible') return 'text-red-600';
    if (strength === 'Moyen') return 'text-yellow-600';
    if (strength === 'Fort') return 'text-green-600';
    return '';
  }
}
