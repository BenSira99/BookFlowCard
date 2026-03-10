import { create } from 'zustand';

// Types pour le Module Emprunts
export interface Emprunt {
  id: string;
  titre: string;
  auteur: string;
  imageCouverture: string;
  dateRetourPrevue: string; // ISO string 
  estEnRetard: boolean;
  estRetourne: boolean;
  renouvellementsEffectues: number;
  renouvellementsMax: number;
}

// Types pour le Module Réservations
export interface Reservation {
  id: string;
  titre: string;
  auteur: string;
  imageCouverture: string;
  positionFileAttente: number;
  estDisponible: boolean;
  dateLimiteRecuperation?: string; // Apparaît si estDisponible = true
}

// Types pour le Module Karma / Amendes
export interface Amende {
  id: string;
  montant: number;
  motif: string;
  dateEmission: string;
  estPayee: boolean;
}

// État global de la Bibliothèque (Mocké pour la démo)
interface EtatBibliotheque {
  emprunts: Emprunt[];
  reservations: Reservation[];
  amendes: Amende[];
  scoreKarma: number; // 0 à 100
  
  // Actions
  prolongerEmprunt: (id: string) => Promise<boolean>;
  retournerEmprunt: (id: string) => void;
  annulerReservation: (id: string) => void;
  payerAmende: (id: string) => Promise<boolean>;
  importerSession: (donnees: { emprunts?: Emprunt[], reservations?: Reservation[], amendes?: Amende[], scoreKarma?: number }) => void;
}

// Données initiales factices
const empruntsInitiaux: Emprunt[] = [
  {
    id: 'emp-1',
    titre: 'Clean Architecture',
    auteur: 'Robert C. Martin',
    imageCouverture: 'https://m.media-amazon.com/images/I/41-sN-mzwKL._SY445_SX342_.jpg',
    // Date prévue : dans 3 jours
    dateRetourPrevue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estEnRetard: false,
    estRetourne: false,
    renouvellementsEffectues: 0,
    renouvellementsMax: 1,
  },
  {
    id: 'emp-2',
    titre: 'Le Design des Choses du Quotidien',
    auteur: 'Don Norman',
    imageCouverture: 'https://m.media-amazon.com/images/I/410VTJZtq+L._SY445_SX342_.jpg',
    // Date prévue : il y a 1 jour (en retard)
    dateRetourPrevue: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estEnRetard: true,
    estRetourne: false,
    renouvellementsEffectues: 1,
    renouvellementsMax: 1,
  }
];

const reservationsInitiales: Reservation[] = [
  {
    id: 'res-1',
    titre: 'Refactoring UI',
    auteur: 'Adam Wathan',
    imageCouverture: 'https://refactoringui.com/images/book-cover.png',
    positionFileAttente: 3,
    estDisponible: false,
  },
  {
    id: 'res-2',
    titre: 'Design Patterns',
    auteur: 'Gang of Four',
    imageCouverture: 'https://m.media-amazon.com/images/I/51szD9HC9pL._SY445_SX342_.jpg',
    positionFileAttente: 0,
    estDisponible: true,
    // Dispo depuis aujourd'hui, 48h pour récupérer
    dateLimiteRecuperation: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  }
];

const amendesInitiales: Amende[] = [
  {
    id: 'amd-1',
    montant: 4.50,
    motif: 'Retard de 3 jours sur "1984"',
    dateEmission: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    estPayee: false,
  }
];

export const utiliserMagasinBibliotheque = create<EtatBibliotheque>((set, get) => ({
  emprunts: empruntsInitiaux,
  reservations: reservationsInitiales,
  amendes: amendesInitiales,
  scoreKarma: 45, // Score initial simulé (faible à cause du retard et de l'amende)

  prolongerEmprunt: async (id: string) => {
    // Simulation d'appel réseau
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    set(etat => ({
      emprunts: etat.emprunts.map(emp => {
        if (emp.id === id && emp.renouvellementsEffectues < emp.renouvellementsMax) {
          // Ajout de 14 jours
          const nouvelleDate = new Date(emp.dateRetourPrevue);
          nouvelleDate.setDate(nouvelleDate.getDate() + 14);
          return {
            ...emp,
            dateRetourPrevue: nouvelleDate.toISOString(),
            renouvellementsEffectues: emp.renouvellementsEffectues + 1,
            estEnRetard: false, // Plus en retard après prolongation
          };
        }
        return emp;
      })
    }));
    return true; // Succès
  },

  retournerEmprunt: (id: string) => {
    set(etat => {
      const empruntsMaj = etat.emprunts.map(emp => 
        emp.id === id ? { ...emp, estRetourne: true } : emp
      );
      // Retirer les emprunts retournés de la liste active pour l'animation
      // Dans une vraie app, ils iraient dans l'historique
      return { 
        emprunts: empruntsMaj,
        // Bonus Karma pour avoir ramené un livre
        scoreKarma: Math.min(100, etat.scoreKarma + 10) 
      };
    });
  },

  annulerReservation: (id: string) => {
    set(etat => ({
      reservations: etat.reservations.filter(res => res.id !== id)
    }));
  },

  payerAmende: async (id: string) => {
    // Simulation d'appel réseau pour le paiement multiplateforme
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    set(etat => ({
      amendes: etat.amendes.map(amd => 
        amd.id === id ? { ...amd, estPayee: true } : amd
      ),
      // Gros bonus Karma quand on paie ses dettes !
      scoreKarma: Math.min(100, etat.scoreKarma + 30)
    }));
    return true;
  },

  importerSession: (donnees) => {
    set(etat => ({
      emprunts: donnees.emprunts || etat.emprunts,
      reservations: donnees.reservations || etat.reservations,
      amendes: donnees.amendes || etat.amendes,
      scoreKarma: donnees.scoreKarma ?? etat.scoreKarma,
    }));
  }
}));
