import { Component, OnInit } from '@angular/core';
import { Authentication } from '../../interfaces/Authentication';
import { UtilisateurService } from '../../services/utilisateur-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  isLoading = false;
  errorMessage = '';

  authRequest:Authentication={
    email:'',
    password:''
  };

  constructor(
    private authService:UtilisateurService,
    private tokenService:TokenService,
    private router:Router
  ){}

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.authService.authenticate(this.authRequest).subscribe({
      next: (response) => {
        // Stocker le token
        this.tokenService.setAccessToken(response.token);
  
        // Mettre à jour l'utilisateur courant dans le service
        this.authService.login(response.user);
  
        // Redirection
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = 'Erreur de connexion. Vérifiez vos identifiants';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  




}
