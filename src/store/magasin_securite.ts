import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface EtatSecurite {
  pinHahed: string | null;
  estVerrouille: boolean;
  tentativesRestantes: number;
  initialiserPin: (nouveauPin: string) => Promise<void>;
  verifierPin: (pin: string) => Promise<boolean>;
  changerPin: (ancienPin: string, nouveauPin: string) => Promise<{ succes: boolean; message: string }>;
}

// Note: Pour une vraie app, on utiliserait un hash (bcrypt/argon2)
// Ici on simule pour l'exercice.
export const utiliserMagasinSecurite = create<EtatSecurite>()(
  persist(
    (set, get) => ({
      pinHahed: '1234', // PIN par défaut pour le test
      estVerrouille: false,
      tentativesRestantes: 5,

      initialiserPin: async (nouveauPin) => {
        set({ pinHahed: nouveauPin });
      },

      verifierPin: async (pin) => {
        return pin === get().pinHahed;
      },

      changerPin: async (ancienPin, nouveauPin) => {
        if (ancienPin !== get().pinHahed) {
          return { succes: false, message: "L'ancien code PIN est incorrect." };
        }
        set({ pinHahed: nouveauPin });
        return { succes: true, message: "Code PIN mis à jour avec succès." };
      },
    }),
    {
      name: 'bookflow-securite',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
