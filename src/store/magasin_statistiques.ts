import { create } from 'zustand';

export type NiveauLecteur = 'Bronze' | 'Argent' | 'Or' | 'Platine';

export interface Badge {
  id: string;
  titre: string;
  description: string;
  icone: string;
  estDebloque: boolean;
  dateDeblocage?: string;
}

export interface DonneeMensuelle {
  mois: string;
  quantite: number;
}

export interface CategorieStat {
  nom: string;
  pourcentage: number;
  couleur: string;
}

interface EtatStatistiques {
  xp: number;
  niveau: NiveauLecteur;
  totalLivresLus: number;
  streakSemaines: number;
  historiqueMensuel: DonneeMensuelle[];
  categoriesFavorites: CategorieStat[];
  badges: Badge[];
  
  // Actions
  ajouterXP: (montant: number) => void;
  debloquerBadge: (id: string) => void;
}

export const utiliserMagasinStatistiques = create<EtatStatistiques>((set, get) => ({
  xp: 750,
  niveau: 'Argent',
  totalLivresLus: 42,
  streakSemaines: 5,
  
  historiqueMensuel: [
    { mois: 'Oct', quantite: 4 },
    { mois: 'Nov', quantite: 6 },
    { mois: 'Déc', quantite: 3 },
    { mois: 'Jan', quantite: 8 },
    { mois: 'Fév', quantite: 5 },
    { mois: 'Mar', quantite: 7 },
  ],

  categoriesFavorites: [
    { nom: 'Science-Fiction', pourcentage: 40, couleur: '#0d9488' },
    { nom: 'Philosophie', pourcentage: 25, couleur: '#f59e0b' },
    { nom: 'Histoire', pourcentage: 20, couleur: '#3b82f6' },
    { nom: 'Autres', pourcentage: 15, couleur: '#64748b' },
  ],

  badges: [
    { id: '1', titre: 'Premier Pas', description: 'Avoir emprunté son premier livre.', icone: 'rocket', estDebloque: true, dateDeblocage: '2024-01-12' },
    { id: '2', titre: 'Rat de Bibliothèque', description: 'Avoir lu plus de 10 livres.', icone: 'book', estDebloque: true, dateDeblocage: '2024-02-05' },
    { id: '3', titre: 'Collectionneur d\'Or', description: 'Atteindre 50 livres lus.', icone: 'trophy', estDebloque: false },
    { id: '4', titre: 'Globe-Trotteur', description: 'Lire des livres de 5 catégories différentes.', icone: 'planet', estDebloque: true, dateDeblocage: '2024-03-01' },
    { id: '5', titre: 'Lecteur Assidu', description: 'Maintenir un streak de 4 semaines.', icone: 'flame', estDebloque: true, dateDeblocage: '2024-02-28' },
  ],

  ajouterXP: (montant) => set((etat) => ({ xp: etat.xp + montant })),
  
  debloquerBadge: (id) => set((etat) => ({
    badges: etat.badges.map(b => b.id === id ? { ...b, estDebloque: true, dateDeblocage: new Date().toISOString() } : b)
  })),
}));
