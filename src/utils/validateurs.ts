/**
 * Utilitaires de validation pour BiblioCard (Ben Sira Quality).
 */
export const validateurs = {
  /**
   * Valide le format d'un PIN à 6 chiffres.
   */
  estPinValide: (pin: string): boolean => {
    return /^\d{6}$/.test(pin);
  },

  /**
   * Valide un code d'activation (8 caractères alphanumériques).
   */
  estCodeActivationValide: (code: string): boolean => {
    return /^[A-Z0-9]{8}$/i.test(code);
  },

  /**
   * Valide un ISBN-13 ou ISBN-10 simple.
   */
  estISBNValide: (isbn: string): boolean => {
    const clean = isbn.replace(/[-\s]/g, '');
    return clean.length === 10 || clean.length === 13;
  }
};
