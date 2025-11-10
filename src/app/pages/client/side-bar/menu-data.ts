import { MenuItem } from "./MenuItem";

/** 🔹 Menu ADMIN */
export const FULL_MENU: MenuItem[] = [
  { title: 'Dashboard', icon: 'fa fa-home', route: '/admin/dashboard' },

 {
  title: 'Utilisateurs', icon: 'fa fa-users', children: [
    { title: 'Liste des utilisateurs', route: '/admin/utilisateurs', icon: 'fa fa-list' },
    // { title: 'Gestion des rôles', route: '/admin/roles', icon: 'fa fa-user-shield' }
  ]
},

  {
    title: 'Biens', icon: 'fa fa-building', children: [
      { title: 'Appartements', route: '/admin/biens', icon: 'fa fa-building' },
      { title: 'Véhicules', route: '/admin/gestionVehicules', icon: 'fa fa-car' },
      { title: 'Images Appartements', route: '/admin/image', icon: 'fa fa-image' },
      { title: 'Images Véhicules', route: '/admin/uploadImageVehicule', icon: 'fa fa-image' },
      { title: 'Immeubles', route: '/admin/immeuble', icon: 'fa fa-city' },
    ]
  },
  {
    title: 'Réservations', icon: 'fa fa-calendar-check', children: [
      { title: 'Réservation Appartement', route: '/admin/reservationsApp', icon: 'fa fa-home' },
      { title: 'Réservation Véhicule', route: '/admin/reservationVehicule', icon: 'fa fa-car' },
    ]
  },
  {
    title: 'Paiements', icon: 'fa fa-credit-card', children: [
      { title: 'Paiement ', route: '/admin/paiementAppartement', icon: 'fa fa-home' },
      // { title: 'Paiement Véhicule', route: '/admin/paiementVehicule', icon: 'fa fa-car' },
    ]
  },
];

/** 🔹 Menu PROPRIETAIRE */
export const PROPRIETAIRE_MENU: MenuItem[] = [
  {
    title: 'Biens', icon: 'fa fa-building', children: [
      { title: 'Appartements', route: '/proprietaire/biens', icon: 'fa fa-building' },
      { title: 'Véhicules', route: '/proprietaire/gestionVehicules', icon: 'fa fa-car' },
      { title: 'Images Appartements', route: '/proprietaire/image', icon: 'fa fa-image' },
      { title: 'Images Véhicules', route: '/proprietaire/uploadImageVehicule', icon: 'fa fa-image' },
      // { title: 'Immeubles', route: '/proprietaire/immeuble', icon: 'fa fa-city' },
    ]
  },
  {
    title: 'Réservations', icon: 'fa fa-calendar-check', children: [
      { title: 'Réservation Appartement', route: '/proprietaire/reservationsApp', icon: 'fa fa-home' },
      { title: 'Réservation Véhicule', route: '/proprietaire/reservationVehicule', icon: 'fa fa-car' },
    ]
  },
  // {
  //   title: 'Paiements', icon: 'fa fa-credit-card', children: [
  //     { title: 'Paiement Appartement', route: '/proprietaire/paiementAppartement', icon: 'fa fa-home' },
  //     { title: 'Paiement Véhicule', route: '/proprietaire/paiementVehicule', icon: 'fa fa-car' },
  //   ]
  // },
];

/** 🔹 Client */
export const CLIENT_MENU: MenuItem[] = [
  {
    title: 'Mes Réservations',
    icon: 'fa fa-calendar-check',
    children: [
      {
        title: 'Voir mes réservations',
        route: '/client/voirMesReservation',
        icon: 'fa fa-eye'
      },
        {
        title: 'Voir mes réservations Vehicules',
        route: '/client/voirReservationVeh',
        icon: 'fa fa-eye'
      }
    ]
  }
];

