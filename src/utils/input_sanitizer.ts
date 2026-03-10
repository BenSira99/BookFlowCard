/**
 * Utilitaire de Sanitization (CWE-20, CWE-79).
 * Prévient les injections XSS en nettoyant les chaînes de caractères.
 */
export const inputSanitizer = {
  /**
   * Nettoie une chaîne de caractères en supprimant les balises HTML et scripts.
   */
  nettoyerTexte: (texte: string): string => {
    if (!texte) return '';
    // Supprime les balises HTML <...>
    let propre = texte.replace(/<[^>]*>/g, '');
    // Neutralise les entités potentiellement dangereuses
    propre = propre
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    return propre.trim();
  },

  /**
   * Valide et nettoie les données provenant d'un QR Code (JSON).
   */
  sanitiserObjet: <T extends Record<string, any>>(obj: T): T => {
    const resultat = { ...obj };
    for (const cle in resultat) {
      if (typeof resultat[cle] === 'string') {
        resultat[cle] = inputSanitizer.nettoyerTexte(resultat[cle]) as any;
      } else if (typeof resultat[cle] === 'object' && resultat[cle] !== null) {
        resultat[cle] = inputSanitizer.sanitiserObjet(resultat[cle]);
      }
    }
    return resultat;
  },

  /**
   * Vérifie si une chaîne contient des caractères suspects (SQL/Script).
   */
  estSuspect: (texte: string): boolean => {
    const patternsSuspects = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /SELECT.*FROM/i,
      /UNION.*SELECT/i,
      /DROP.*TABLE/i
    ];
    return patternsSuspects.some(pattern => pattern.test(texte));
  }
};
