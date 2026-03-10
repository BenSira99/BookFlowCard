import { create } from 'zustand';

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  numeroMembre: string;
}

interface EtatAuth {
  estConnecte: boolean;
  utilisateur: Utilisateur | null;
  jeton: string | null;
  estVerrouille: boolean;
  tentativesEchouees: number;
  
  // Actions
  connecter: (jeton: string, utilisateur: Utilisateur) => void;
  deconnecter: () => void;
  verrouiller: () => void;
  deverrouiller: () => void;
  incrementerTentatives: () => void;
  reinitialiserTentatives: () => void;
  importerUtilisateur: (utilisateur: Utilisateur) => void;
}

export const utiliserMagasinAuth = create<EtatAuth>((set) => ({
  estConnecte: false,
  utilisateur: null,
  jeton: null,
  estVerrouille: false,
  tentativesEchouees: 0,
  
  connecter: (jeton, utilisateur) => set({ 
    estConnecte: true, 
    jeton, 
    utilisateur, 
    estVerrouille: false, 
    tentativesEchouees: 0 
  }),
  
  deconnecter: () => set({ 
    estConnecte: false, 
    jeton: null, 
    utilisateur: null, 
    estVerrouille: false, 
    tentativesEchouees: 0 
  }),
  
  verrouiller: () => set({ estVerrouille: true }),
  
  deverrouiller: () => set({ estVerrouille: false, tentativesEchouees: 0 }),
  
  incrementerTentatives: () => set((etat) => {
    const nouvellesTentatives = etat.tentativesEchouees + 1;
    return {
      tentativesEchouees: nouvellesTentatives,
      // Verrouille le compte après 5 tentatives échouées (OWASP CWE-307)
      estVerrouille: nouvellesTentatives >= 5
    };
  }),
  
  reinitialiserTentatives: () => set({ tentativesEchouees: 0 }),

  importerUtilisateur: (utilisateur) => set({ utilisateur, estConnecte: true })
}));
