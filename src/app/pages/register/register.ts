import { Component, OnInit } from '@angular/core';

import { Authentication } from '../../interfaces/Authentication';
import { UtilisateurService } from '../../services/utilisateur-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token-service';
import { RegistrationRequest } from '../../interfaces/RegistrationRequest';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit{

  registerRequest:RegistrationRequest = {
    nom: '',
    prenoms: '',
    password: '',
    email: '',
    telephone: '',
    adresse: '',

  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: UtilisateurService,
    private router:Router
  ){}

  

  ngOnInit(): void {

    /**
     * rediriger vers l'accuiel si l'utilisateur est deja connecter
     */

    if (this.authService.isAuthenticated()){
      this.router.navigate(['/']);
    }
    
  }
  onSubmit(): void {

    this.isLoading=true;
    this.errorMessage='';
    this.successMessage='';

    this.authService.register(this.registerRequest).subscribe ({
      next:(response) => {
        this.successMessage = 'Inscription reussie ! verifier votre email pour activer votre compte.';
        this.isLoading= false;

        // rediriger vers la page apres 3 secondes

        setTimeout(()=>{
          this.router.navigate(['/activate-account']);

        }, 3000);

      },
      error:(error) => {

        this.errorMessage='Erreur lors de l\'inscription.Veuillez reessayer.';
        this.isLoading = false;
        
      },

    });



  }

}
