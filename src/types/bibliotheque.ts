export interface Emprunt {
  id: string;
  titre: string;
  auteur: string;
  imageCouverture: string;
  dateRetourPrevue: string;
  estEnRetard: boolean;
  estRetourne: boolean;
  renouvellementsEffectues: number;
  renouvellementsMax: number;
}

export interface Reservation {
  id: string;
  titre: string;
  auteur: string;
  imageCouverture: string;
  positionFileAttente: number;
  estDisponible: boolean;
  dateLimiteRecuperation?: string;
}

export interface Amende {
  id: string;
  montant: number;
  motif: string;
  dateEmission: string;
  estPayee: boolean;
}
