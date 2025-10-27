export interface UserDto {
    id: number;
    nom: string;
    prenoms: string;
    email: string;
    roles: string[];
    hasReservation: boolean;
  }