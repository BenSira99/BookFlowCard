import * as OTPAuth from 'otpauth';

/**
 * Service de génération de QR Codes dynamiques (TOTP).
 * Conforme à la RFC 6238.
 * Sécurité : CWE-330 (Non-prévisibilité) et CWE-319 (Transmission sécurisée).
 */
export const generateurTOTP = {
  /**
   * Génère un jeton TOTP basé sur un secret et le temps actuel.
   * @param secret La clé secrète partagée.
   * @returns Un code à 6 chiffres.
   */
  genererCode: (secret: string): string => {
    const totp = new OTPAuth.TOTP({
      issuer: 'BiblioCard',
      label: 'Membre',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });
    return totp.generate();
  },

  /**
   * Calcule le temps restant avant la rotation du prochain code (en secondes).
   */
  tempsRestant: (): number => {
    return 30 - (Math.floor(Date.now() / 1000) % 30);
  },
};
