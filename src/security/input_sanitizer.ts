/**
 * Assainissement des entrées pour prévenir les injections (OWASP CWE-79/XSS).
 */
export const inputSanitizer = {
  /**
   * Supprime les balises HTML et les caractères de contrôle.
   */
  assainirTexte: (texte: string): string => {
    return texte
      .replace(/<[^>]*>?/gm, '') // Supprime HTML
      .replace(/[\x00-\x1F\x7F]/g, '') // Supprime caractères de contrôle
      .trim();
  },

  /**
   * Échappe les caractères spéciaux pour affichage sécurisé.
   */
  echapperHtml: (texte: string): string => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return texte.replace(/[&<>"']/g, (m) => map[m]);
  }
};
