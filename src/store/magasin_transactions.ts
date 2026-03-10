import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandSecureStorage } from '../utils/storage_securise_zustand';

// --- Interfaces correspondant aux retours JSON générés par l'App Desktop ---

export interface TransactionEmprunt {
  id_emprunt: string | number;
  date_emprunt?: string;
  date_retour_prevue?: string;
  statut?: string; // Ex: 'actif', 'retourné', 'en retard', 'remboursé', 'amendé'
  date_d_amende?: string;
  id_ressource?: string | number;
  titre?: string;
  auteur?: string;
  type_ressource?: string;
  nom_emprunteur?: string;
  prenom_emprunteur?: string;
}

export interface TransactionReservation {
  id_reservation: string | number;
  date_reservation?: string;
  date_expiration_reservation?: string;
  statut?: string; // Ex: 'en cours', 'annulée', 'expirée', 'validée'
  date_annulation_reservation?: string;
  id_ressource?: string | number;
  titre?: string;
  auteur?: string;
  type_ressource?: string;
  nom_reservant?: string;
  prenom_reservant?: string;
}

export interface TransactionAmende {
  id_amende: string | number;
  montant?: number;
  motif?: string; // Ex: 'retard de livre', 'perte de livre', 'degat quasi du livre', 'degat total du livre'
  date_emission?: string;
  statut?: string; // Ex: 'impayée', 'payée', 'pas payant'
  emprunt_id?: string | number;
  id_ressource?: string | number;
  titre?: string;
  auteur?: string;
  nom_amende?: string;
  prenom_amende?: string;
}

export interface PayloadTransactions {
  user_id?: string | number;
  emprunts?: TransactionEmprunt[];
  reservations?: TransactionReservation[];
  amendes?: TransactionAmende[];
}

export interface ResultatDeltaTransactions {
  empruntsAjoutes: TransactionEmprunt[];
  empruntsModifies: TransactionEmprunt[];
  reservationsAjoutees: TransactionReservation[];
  reservationsModifiees: TransactionReservation[];
  amendesAjoutees: TransactionAmende[];
  amendesModifiees: TransactionAmende[];
}

interface EtatTransactions {
  emprunts: Record<string, TransactionEmprunt>;
  reservations: Record<string, TransactionReservation>;
  amendes: Record<string, TransactionAmende>;

  // Actions
  synchroniserTransactions: (payload: PayloadTransactions) => ResultatDeltaTransactions;
  reinitialiser: () => void;
}

/**
 * Magasin Zustand pour stocker les transactions de l'utilisateur.
 * Détecte les différences (ajouts, modifications) lors d'un apport extérieur (QR Code, Fichier P2P).
 */
export const utiliserMagasinTransactions = create<EtatTransactions>()(
  persist(
    (set, get) => ({
      emprunts: {},
      reservations: {},
      amendes: {},

      synchroniserTransactions: (payload: PayloadTransactions) => {
        const etatPrecedent = get();
        
        const empruntsActuels = { ...etatPrecedent.emprunts };
        const reservationsActuelles = { ...etatPrecedent.reservations };
        const amendesActuelles = { ...etatPrecedent.amendes };

        const delta: ResultatDeltaTransactions = {
          empruntsAjoutes: [],
          empruntsModifies: [],
          reservationsAjoutees: [],
          reservationsModifiees: [],
          amendesAjoutees: [],
          amendesModifiees: []
        };

        // --- 1. Emprunts ---
        if (payload.emprunts && Array.isArray(payload.emprunts)) {
          payload.emprunts.forEach(nouvelEmprunt => {
            const idSTR = String(nouvelEmprunt.id_emprunt);
            const empruntLocal = empruntsActuels[idSTR];

            if (!empruntLocal) {
              // Nouveau
              delta.empruntsAjoutes.push(nouvelEmprunt);
            } else {
              // Existant -> Vérifie s'il y a des changements (le statut est le critère majeur)
              // Pour plus de simplicité, on le considère modifié s'il est repassé dans le payload
              // En réalité, on compare généralement les dates ou status.
              const estModifie = empruntLocal.statut !== nouvelEmprunt.statut || 
                                 empruntLocal.date_retour_prevue !== nouvelEmprunt.date_retour_prevue;
              if (estModifie) {
                delta.empruntsModifies.push(nouvelEmprunt);
              }
            }
            empruntsActuels[idSTR] = nouvelEmprunt;
          });
        }

        // --- 2. Réservations ---
        if (payload.reservations && Array.isArray(payload.reservations)) {
          payload.reservations.forEach(nouvelleResa => {
            const idSTR = String(nouvelleResa.id_reservation);
            const resaLocale = reservationsActuelles[idSTR];

            if (!resaLocale) {
              delta.reservationsAjoutees.push(nouvelleResa);
            } else {
              const estModifie = resaLocale.statut !== nouvelleResa.statut;
              if (estModifie) {
                delta.reservationsModifiees.push(nouvelleResa);
              }
            }
            reservationsActuelles[idSTR] = nouvelleResa;
          });
        }

        // --- 3. Amendes ---
        if (payload.amendes && Array.isArray(payload.amendes)) {
          payload.amendes.forEach(nouvelleAmende => {
            const idSTR = String(nouvelleAmende.id_amende);
            const amendeLocale = amendesActuelles[idSTR];

            if (!amendeLocale) {
              delta.amendesAjoutees.push(nouvelleAmende);
            } else {
              const estModifie = amendeLocale.statut !== nouvelleAmende.statut;
              if (estModifie) {
                delta.amendesModifiees.push(nouvelleAmende);
              }
            }
            amendesActuelles[idSTR] = nouvelleAmende;
          });
        }

        // --- APPLIQUER LES CHANGEMENTS AU STORE ---
        set({
          emprunts: empruntsActuels,
          reservations: reservationsActuelles,
          amendes: amendesActuelles
        });

        return delta;
      },

      reinitialiser: () => {
        set({ emprunts: {}, reservations: {}, amendes: {} });
      }
    }),
    {
      name: 'transactions-storage', // On store les transactions
      storage: createJSONStorage(() => zustandSecureStorage), // Chiffrement AES-256
    }
  )
);
