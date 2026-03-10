import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandSecureStorage } from '../utils/storage_securise_zustand';
import { cryptoUtils } from '../utils/crypto_utils';

interface EtatSecurite {
  pinHashed: string | null;
  salt: string | null;
  estVerrouille: boolean;
  tentativesRestantes: number;
  initialiserPin: (nouveauPin: string) => Promise<void>;
  verifierPin: (pin: string) => Promise<boolean>;
  changerPin: (ancienPin: string, nouveauPin: string) => Promise<{ succes: boolean; message: string }>;
  incrementerEchecs: () => void;
  reinitialiserEchecs: () => void;
}

/**
 * Magasin de sécurité gérant le code PIN et le verrouillage.
 * OWASP M2/M4: Stockage chiffré et hachage salé.
 */
export const utiliserMagasinSecurite = create<EtatSecurite>()(
  persist(
    (set, get) => ({
      pinHashed: null,
      salt: null,
      estVerrouille: false,
      tentativesRestantes: 5,

      initialiserPin: async (nouveauPin) => {
        const nouveauSalt = cryptoUtils.genererSalt();
        const hash = await cryptoUtils.hacherPIN(nouveauPin, nouveauSalt);
        set({ 
          pinHashed: hash, 
          salt: nouveauSalt, 
          tentativesRestantes: 5, 
          estVerrouille: false 
        });
      },

      verifierPin: async (pin) => {
        const { pinHashed, salt, estVerrouille } = get();
        if (estVerrouille || !pinHashed || !salt) return false;
        
        const estValide = await cryptoUtils.verifierPIN(pin, pinHashed, salt);
        return estValide;
      },

      changerPin: async (ancienPin, nouveauPin) => {
        const { pinHashed, salt } = get();
        if (!pinHashed || !salt) return { succes: false, message: "Aucun code PIN configuré." };

        const estAncienValide = await cryptoUtils.verifierPIN(ancienPin, pinHashed, salt);
        if (!estAncienValide) {
          return { succes: false, message: "L'ancien code PIN est incorrect." };
        }

        const nouveauSalt = cryptoUtils.genererSalt();
        const nouveauHash = await cryptoUtils.hacherPIN(nouveauPin, nouveauSalt);
        set({ pinHashed: nouveauHash, salt: nouveauSalt });
        return { succes: true, message: "Code PIN mis à jour avec succès." };
      },

      incrementerEchecs: () => {
        const reste = get().tentativesRestantes - 1;
        set({ 
          tentativesRestantes: Math.max(0, reste),
          estVerrouille: reste <= 0
        });
      },

      reinitialiserEchecs: () => set({ tentativesRestantes: 5, estVerrouille: false }),
    }),
    {
      name: 'bookflow-securite-storage',
      storage: createJSONStorage(() => zustandSecureStorage),
    }
  )
);
