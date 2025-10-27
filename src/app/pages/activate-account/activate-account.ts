import { Component,OnInit } from '@angular/core';
import { confirm } from '../../services/Confirm';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.html',
  styleUrl: './activate-account.css'
})
export class ActivateAccount implements OnInit{

  activateCode='';
  message='';
  
  isLoading=false;
  isSuccess=false;

  constructor(private confirmCode:confirm,
    private route: ActivatedRoute,
    private router: Router ) {}
  ngOnInit(): void {
      const token = this.route.snapshot.queryParamMap.get('token');
  if (token) {
    this.activateCode = token; // pré-remplit le champ
  }
  }
  activate() {
    if(!this.activateCode.trim()){
      this.message = 'Veuillez entrer le code reçu par email.';
      return;
    }

    this.isLoading = true;
    this.message ='';

    this.confirmCode.activateAccount(this.activateCode).subscribe({
      next:(response) => {
        this.isLoading = false;
        this.isSuccess = true;

        // Backend peut renvoyer string ou objet { message: "..." }
      if (typeof response === 'string') {
        this.message = response;
      } else if (response?.message) {
        this.message = response.message;
      } else {
        this.message = 'Activation réussie ! Vous pouvez maintenant vous connecter.';
      }
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error:(err) => {
        
        this.isSuccess = false;
        this.isLoading = false;

      if (typeof err.error === 'string') {
        this.message = err.error;
      } else if (err.error?.message) {
        this.message = err.error.message;
      } else {
        this.message = 'Échec de l’activation. Veuillez réessayer.';
      }
      }
    });
  }

}
