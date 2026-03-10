export type TypeAbonnement = 'BRONZE' | 'SILVER' | 'GOLD';

export interface Membre {
  id: string;
  nom: string;
  prenom: string;
  pseudonyme: string;
  photo: string;
  typeAbonnement: TypeAbonnement;
  dateExpiration: string;
  secretQR: string;
}
