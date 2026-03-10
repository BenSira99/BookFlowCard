import { create } from 'zustand';

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

export interface Categorie {
  id: string;
  nom: string;
  imageFond: string;
}

interface EtatCatalogue {
  livres: Livre[];
  categories: Categorie[];
  termeRecherche: string;
  filtreCategorie: string | null;
  
  // Actions
  setTermeRecherche: (terme: string) => void;
  setFiltreCategorie: (id: string | null) => void;
  basculerFavori: (id: string) => void;
  rechercherParISBN: (isbn: string) => Livre | undefined;
  importerLivres: (nouveauxLivres: Livre[]) => void;
}

export const utiliserMagasinCatalogue = create<EtatCatalogue>((set, get) => ({
  termeRecherche: '',
  filtreCategorie: null,

  categories: [
    { id: '1', nom: 'Science-Fiction', imageFond: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' },
    { id: '2', nom: 'Philosophie', imageFond: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=400' },
    { id: '3', nom: 'Histoire', imageFond: 'https://images.unsplash.com/photo-1461360228754-6e81c478bc88?auto=format&fit=crop&q=80&w=400' },
    { id: '4', nom: 'Classiques', imageFond: 'https://images.unsplash.com/photo-1458040937381-49c067dfd49a?auto=format&fit=crop&q=80&w=400' },
    { id: '5', nom: 'Jeunesse', imageFond: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80&w=400' },
  ],

  livres: [
    {
      id: '1',
      titre: 'Dune',
      auteur: 'Frank Herbert',
      description: 'Sur la planète désertique Arrakis, le jeune Paul Atréides doit faire face à son destin.',
      categorie: 'Science-Fiction',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      estDisponible: true,
      exemplairesDisponibles: 3,
      isbn: '9780441172719',
      rayon: 'A-SF-01',
      estFavori: false,
    },
    {
      id: '2',
      titre: 'Méditations',
      auteur: 'Marc Aurèle',
      description: 'Les pensées intimes de l\'empereur philosophe sur le stoïcisme.',
      categorie: 'Philosophie',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      estDisponible: false,
      exemplairesDisponibles: 0,
      isbn: '9782081295328',
      rayon: 'P-PH-04',
      estFavori: true,
    },
    {
      id: '3',
      titre: 'Le Seigneur des Anneaux',
      auteur: 'J.R.R. Tolkien',
      description: 'L\'odyssée épique pour détruire l\'Anneau Unique.',
      categorie: 'Science-Fiction',
      image: 'https://images.unsplash.com/photo-1621350238376-ec361d0723b5?auto=format&fit=crop&q=80&w=400',
      estDisponible: true,
      exemplairesDisponibles: 5,
      isbn: '9780261103252',
      rayon: 'A-SF-12',
      estFavori: false,
    },
    {
      id: '4',
      titre: 'Sapiens',
      auteur: 'Yuval Noah Harari',
      description: 'Une brève histoire de l\'humanité, des grottes à la modernité.',
      categorie: 'Histoire',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      estDisponible: true,
      exemplairesDisponibles: 2,
      isbn: '9782226257017',
      rayon: 'H-HI-08',
      estFavori: false,
    },
  ],

  setTermeRecherche: (terme) => set({ termeRecherche: terme }),
  
  setFiltreCategorie: (id) => set({ filtreCategorie: id }),

  basculerFavori: (id) => set((etat) => ({
    livres: etat.livres.map(l => l.id === id ? { ...l, estFavori: !l.estFavori } : l)
  })),

  rechercherParISBN: (isbn) => {
    return get().livres.find(l => l.isbn === isbn);
  },

  importerLivres: (nouveauxLivres) => {
    set({ livres: nouveauxLivres });
  }
}));
