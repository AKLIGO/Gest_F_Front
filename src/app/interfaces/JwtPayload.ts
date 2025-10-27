import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
    sub: string;
    email: string;
    nom: string;
    roles: string[];
    exp: number;
  }