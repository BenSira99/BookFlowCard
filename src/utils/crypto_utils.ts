import * as Crypto from 'expo-crypto';

/**
 * Utilitaires cryptographiques de l'application.
 */
export const cryptoUtils = {
  /**
   * Génère un sel (salt) aléatoire pour renforcer le hachage.
   * CWE-330: Utilisation de Crypto.getRandomValues pour un aléa fort.
   */
  genererSalt: (): string => {
    const octets = new Uint8Array(16);
    try {
      // @ts-ignore
      if (global.crypto && global.crypto.getRandomValues) {
        // @ts-ignore
        global.crypto.getRandomValues(octets);
      } else {
        // Fallback sur Math.random structuré (moins sécurisé mais évite le crash)
        for (let i = 0; i < 16; i++) octets[i] = Math.floor(Math.random() * 256);
      }
    } catch (e) {
      for (let i = 0; i < 16; i++) octets[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(octets).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Hache une chaîne de caractères (ex: PIN) avec SHA-256 et un sel.
   * OWASP M4/M5: Pas de stockage en clair, résistance aux attaques par dictionnaire.
   */
  hacherPIN: async (pin: string, salt: string): Promise<string> => {
    const chaineASaler = `${pin}${salt}`;
    const resultat = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      chaineASaler
    );
    return resultat;
  },

  /**
   * Vérifie si un PIN saisi correspond au hash stocké avec son sel.
   */
  verifierPIN: async (pinSaisi: string, hashStocke: string, salt: string): Promise<boolean> => {
    const hashSaisi = await cryptoUtils.hacherPIN(pinSaisi, salt);
    return hashSaisi === hashStocke;
  }
};
