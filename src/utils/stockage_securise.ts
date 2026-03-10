import * as SecureStore from 'expo-secure-store';

/**
 * Utilitaire centralisé pour le stockage sécurisé des secrets (PIN, Tokens)
 * Utilise Keychain (iOS) et Keystore (Android) via Expo SecureStore.
 * Protège contre la vulnérabilité OWASP M2 (Insecure Data Storage).
 */
export const stockageSecurise = {
  sauvegarder: async (cle: string, valeur: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(cle, valeur, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
      });
    } catch (erreur) {
      console.error('Erreur lors de la sauvegarde sécurisée:', erreur);
      throw new Error("Impossible de sécuriser la donnée.");
    }
  },
  
  recuperer: async (cle: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(cle);
    } catch (erreur) {
      console.error('Erreur lors de la récupération sécurisée:', erreur);
      return null;
    }
  },
  
  supprimer: async (cle: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(cle);
    } catch (erreur) {
      console.error('Erreur lors de la suppression sécurisée:', erreur);
    }
  }
};
