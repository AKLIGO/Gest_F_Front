import { Routes } from '@angular/router';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/visiteur/home/home';
import { GestionDesBiens } from './pages/gestion-des-biens/gestion-des-biens';
import { Image } from './pages/image/image';
import { Immeuble } from './pages/immeuble/immeuble';
import { Reservation } from './pages/reservation/reservation';
import { App } from './app';
import { Appartement } from './pages/appartement/appartement';
import { ActivateAccount } from './pages/activate-account/activate-account';
import { Paiement } from './pages/paiement/paiement';
import { PaiementByReservation } from './pages/paiement-by-reservation/paiement-by-reservation';
import { Vehicules } from './pages/vehicules/vehicules';
import { VehiculesVue } from './pages/vehicules-vue/vehicules-vue';
import { ReservationVehicule } from './pages/reservation-vehicule/reservation-vehicule';
import { PaiementVehicules } from './pages/paiement-vehicules/paiement-vehicules';
import { ImageVehicule } from './pages/image-vehicule/image-vehicule';
import { AppartementP } from './pages/Proprietaire/Biens/appartement-p/appartement-p';
import { ImmeubleP } from './pages/Proprietaire/Biens/immeuble-p/immeuble-p';
import { ReservationAppP } from './pages/Proprietaire/Reservation/reservation-app-p/reservation-app-p';
import { ImageAppP } from './pages/Proprietaire/Biens/image-app-p/image-app-p';
import { PaiementAppP } from './pages/Proprietaire/Paiement/paiement-app-p/paiement-app-p';
import { VehiculeP } from './pages/Proprietaire/Biens/vehicule-p/vehicule-p';
import { ReservationVehiP } from './pages/Proprietaire/Reservation/reservation-vehi-p/reservation-vehi-p';
import { PaiementVehiP } from './pages/Proprietaire/Paiement/paiement-vehi-p/paiement-vehi-p';
import { ImageVehiP } from './pages/Proprietaire/Biens/image-vehi-p/image-vehi-p';
import { GestionsRoleUtilisateur } from './pages/Parametre/Admin/gestions-role-utilisateur/gestions-role-utilisateur';
import { ProfilByUtilisateur } from './pages/Parametre/Admin/profil-by-utilisateur/profil-by-utilisateur';
import { ListUtilisateurs } from './pages/Parametre/Admin/list-utilisateurs/list-utilisateurs';
import { VoirReservationComponent } from './pages/HistriqueClient/voir-reservation/voir-reservation.component';
import { VoirReservationVehicComponent } from './pages/HistriqueClient/voir-reservation-vehic/voir-reservation-vehic.component';
import { About } from './pages/about/about';

export const routes: Routes = [
    {path:'contact', component:Contact},
    {path:'about', component:About},
    {path:'login', component:Login},
    {path:'register',component:Register},
    {path:'appartement', component:Appartement},
    {path:'vehicules', component:VehiculesVue},
    {path:'', component:Home},



    // {path:'biens', component:GestionDesBiens},
    // {path:'image', component:Image},
    // {path:'immeuble', component:Immeuble},
    // {path:'reservationsApp', component:Reservation},

    {path:'activate-account', component:ActivateAccount},
    // {path:'paiementAppartement', component:Paiement},
    // {path:'gestionVehicules', component:Vehicules},

    // {path:'paiement-by-reservation/:reservationId', component:PaiementByReservation},
    // {path:'reservationVehicule', component:ReservationVehicule},
    // {path:'paiementVehicule', component:PaiementVehicules},
    // {path:'uploadImageVehicule', component:ImageVehicule},



  /** 🔹 Routes ADMIN */
  { path: 'admin/biens', component: GestionDesBiens },
  { path: 'admin/image', component: Image },
  { path: 'admin/immeuble', component: Immeuble },
  { path: 'admin/reservationsApp', component: Reservation },
  { path: 'admin/paiementAppartement', component: Paiement },
  {path:  'admin/paiement-by-reservation/:reservationId', component:PaiementByReservation},
  { path: 'admin/gestionVehicules', component: Vehicules },
  { path: 'admin/reservationVehicule', component: ReservationVehicule },
  { path: 'admin/paiementVehicule', component: PaiementVehicules },
  { path: 'admin/uploadImageVehicule', component: ImageVehicule },
  { path: 'admin/roles', component: GestionsRoleUtilisateur },
  {path: 'admin/utilisateurs', component: ListUtilisateurs },
  // Liste + modification des rôles
  { path: 'admin/utilisateur/:id', component: ProfilByUtilisateur } ,
  // Détails d’un utilisateur


  /** 🔹 Routes PROPRIETAIRE */
  { path: 'proprietaire/biens', component: AppartementP },
  { path: 'proprietaire/image', component: ImageAppP },
  { path: 'proprietaire/immeuble', component: ImmeubleP },
  { path: 'proprietaire/reservationsApp', component: ReservationAppP },
  { path: 'proprietaire/paiementAppartement', component: PaiementAppP },
  { path: 'proprietaire/gestionVehicules', component: VehiculeP },
  { path: 'proprietaire/reservationVehicule', component: ReservationVehiP },
  { path: 'proprietaire/paiementVehicule', component: PaiementVehiP },
  { path: 'proprietaire/uploadImageVehicule', component: ImageVehiP },

  /** 🔹 Routes CLIENT */

  {path:'client/voirMesReservation', component:VoirReservationComponent},
  {path:'client/voirReservationVeh', component:VoirReservationVehicComponent},

    { path: '**', redirectTo: '' },


];
