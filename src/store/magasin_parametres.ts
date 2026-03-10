import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EtatParametres {
  estModeSombre: boolean;
  estBiometrieActive: boolean;
  taillePolice: number; // 1: Petit, 2: Normal, 3: Grand
  notifications: {
    emprunts: boolean;
    reservations: boolean;
    actualites: boolean;
  };
  poidsCache: string;
  setModeSombre: (actif: boolean) => void;
  setBiometrie: (actif: boolean) => void;
  setTaillePolice: (taille: number) => void;
  setNotification: (type: keyof EtatParametres['notifications'], actif: boolean) => void;
  viderCache: () => Promise<void>;
}

export const utiliserMagasinParametres = create<EtatParametres>()(
  persist(
    (set) => ({
      estModeSombre: true,
      estBiometrieActive: false,
      taillePolice: 2,
      notifications: {
        emprunts: true,
        reservations: true,
        actualites: false,
      },
      poidsCache: '24.5 MB',

      setModeSombre: (actif) => set({ estModeSombre: actif }),
      setBiometrie: (actif) => set({ estBiometrieActive: actif }),
      setTaillePolice: (taille) => set({ taillePolice: taille }),
      setNotification: (type, actif) => 
        set((etat) => ({
          notifications: { ...etat.notifications, [type]: actif }
        })),
      
      viderCache: async () => {
        // Simulation d'un vidage de cache
        await new Promise(resolve => setTimeout(resolve, 2000));
        set({ poidsCache: '0.0 MB' });
      },
    }),
    {
      name: 'bookflow-parametres',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
