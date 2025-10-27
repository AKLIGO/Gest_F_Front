import { ImageDTOv } from "../image/ImageDTOv";
import { Carburant } from "./Carburant";
import{ StatutVehicule } from "./StatutVehicule";
import { TypeVehicule } from "./TypeVehicule";


export interface VehiculeDTO {
  id?: number;
  marque: string;
  modele: string;
  immatriculation: string;
  prix: number;
  carburant: Carburant;
  statut: StatutVehicule;
  type: TypeVehicule;
  images?: ImageDTOv[]; // Liste des images associées
  createdAt?: string;
  lastModifiedDate?: string;
}