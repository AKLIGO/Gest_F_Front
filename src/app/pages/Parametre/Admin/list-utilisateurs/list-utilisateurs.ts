import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistrationRequest } from '../../../../interfaces/RegistrationRequest';
import { RoleUser } from '../../../../interfaces/RoleUser';
import { Utilisateurs } from '../../../../interfaces/Utilisateurs';
import { UtilisateurService } from '../../../../services/utilisateur-service';

@Component({
  selector: 'app-list-utilisateurs',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './list-utilisateurs.html',
  styleUrl: './list-utilisateurs.css'
})
export class ListUtilisateurs implements OnInit{

  utilisateurs:Utilisateurs[]=[];
  roles: string[] = ['PROPRIETAIRE'];
  newUser:RegistrationRequest = {
    nom: '',
    prenoms: '',
    password: '',
    email: '',
    telephone: '',
    adresse: ''
  }

  selectedUser:Utilisateurs | null =null;

  roleUser:RoleUser ={
    email:'',
    name:''
  };

  constructor(private userService:UtilisateurService){}



  ngOnInit(): void {
      this.loadUtilisateurs();
  }

loadUtilisateurs(): void {
  this.userService.getAllUtilisateurs().subscribe({
    next: (users) => {
      this.utilisateurs = users; // <- mise à jour du tableau affiché
      console.log('Liste des utilisateurs rechargée:', this.utilisateurs);
    },
    error: (err) => console.error(err)
  });
}

  addUser():void {
    this.userService.register(this.newUser).subscribe({
      next:() => {
        alert('Utilisateur ajouter avec succes ! ');
        this.newUser = {
          nom: '',
          prenoms: '',
          password: '',
          email: '',
          telephone: '',
          adresse: ''
        };
        this.loadUtilisateurs();
      },
      error:(err) => console.error(err)

    });
  }


   editUser(user: Utilisateurs): void {
  setTimeout(() => {
    this.selectedUser = { ...user };
  }, 0);
}

updateUser(): void {
  if (!this.selectedUser || !this.selectedUser.id) return;

  console.log('Updating user:', this.selectedUser);

  this.userService.updateUtilisateur(this.selectedUser.id, this.selectedUser).subscribe({
    next: (res) => {
      console.log('Update success:', res);
      this.selectedUser = null;
      this.loadUtilisateurs(); // <- recharge la liste
    },
    error: (err) => console.error('Update failed:', err)
  });
}

  deleteUser(id:number):void {
    if(confirm('voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next:() => this.loadUtilisateurs(),
        error: (err) => console.error(err)
      });
    }
  }

  /**
   * Bloquer un compte utilisateur
   */
  bloquerCompte(userId: number): void {
    if(confirm('Voulez-vous vraiment bloquer ce compte utilisateur ?')) {
      this.userService.bloquerCompte(userId).subscribe({
        next: (message) => {
          alert(message);
          this.loadUtilisateurs(); // Recharger la liste pour mettre à jour l'état
        },
        error: (err) => {
          console.error('Erreur lors du blocage:', err);
          alert('Erreur lors du blocage du compte');
        }
      });
    }
  }

  /**
   * Débloquer un compte utilisateur
   */
  debloquerCompte(userId: number): void {
    if(confirm('Voulez-vous vraiment débloquer ce compte utilisateur ?')) {
      this.userService.debloquerCompte(userId).subscribe({
        next: (message) => {
          alert(message);
          this.loadUtilisateurs(); // Recharger la liste pour mettre à jour l'état
        },
        error: (err) => {
          console.error('Erreur lors du déblocage:', err);
          alert('Erreur lors du déblocage du compte');
        }
      });
    }
  }

activerCompte(userId: number): void {
  if (confirm("Voulez-vous vraiment activer ce compte utilisateur ?")) {

    this.userService.activerCompte(userId).subscribe({
      next: (message) => {
        alert(message);
        this.loadUtilisateurs(); // recharge la liste
      },

      error: (err) => {
        console.error("Erreur lors de l'activation :", err);
        alert("Erreur lors de l'activation du compte");
      }

    });

  }
}

  getRolesAsString(user: any): string {
  return user.roles?.map((r: any) => r.name).join(', ') || 'Aucun rôle';
}


  assignRole():void {
    if (!this.roleUser.email || !this.roleUser.name) return;
    this.userService.addRoleToUser(this.roleUser).subscribe({
      next :() => {
        alert(`Rôle ${this.roleUser.name} assigné à ${this.roleUser.email}`);
        this.roleUser={email:'',name:''};
      },
      error: (err) => console.error(err)
    })
  }

}
