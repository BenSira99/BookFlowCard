export type StatutEmprunt = 'ACTIF' | 'RENDU' | 'RETARD' | 'PROLONGE';

export interface Emprunt {
  id: string;
  livreId: string;
  dateEmprunt: string;
  dateRetourPrevue: string;
  statut: StatutEmprunt;
  nbProlongations: number;
}
