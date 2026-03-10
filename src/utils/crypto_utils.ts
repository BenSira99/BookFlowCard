import * as Crypto from 'expo-crypto';

/**
 * Utilitaires cryptographiques de l'application.
 */
export const cryptoUtils = {
  /**
   * Hache une chaîne de caractères (ex: PIN) avec SHA-256.
   * OWASP: Ne jamais stocker de mots de passe ou PIN en clair.
   */
  hacherPIN: async (pin: string): Promise<string> => {
    // Dans une version plus avancée, on ajouterait un "sel" (salt) unique à l'appareil
    const resultat = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin
    );
    return resultat;
  },

  /**
   * Vérifie si un PIN saisi correspond au hash stocké.
   */
  verifierPIN: async (pinSaisi: string, hashStocke: string): Promise<boolean> => {
    const hashSaisi = await cryptoUtils.hacherPIN(pinSaisi);
    return hashSaisi === hashStocke;
  }
};
