export interface Livre {
  id: string;
  titre: string;
  auteur: string;
  description: string;
  categorie: string;
  image: string;
  estDisponible: boolean;
  exemplairesDisponibles: number;
  isbn: string;
  rayon: string;
  estFavori: boolean;
}
