import { utiliserMagasinParametres } from '../store/magasin_parametres';
import { paletteSombre, paletteClair } from '../theme/couleurs';

/**
 * Hook centralisé pour le Design System.
 * Gère le thème clair/sombre et le redimensionnement dynamique des polices.
 */
export const useDesignSystem = () => {
  const { estModeSombre, taillePolice } = utiliserMagasinParametres();

  // Sélection de la palette selon le mode
  const couleurs = estModeSombre ? paletteSombre : paletteClair;

  /**
   * Calcule une taille de police ajustée.
   * @param base Taille de base (ex: 16)
   * @returns Taille ajustée selon les réglages
   */
  const fs = (base: number) => {
    // Multiplicateurs : 1 (Petit) -> 0.85, 2 (Normal) -> 1, 3 (Grand) -> 1.2
    const multiplicateurs: Record<number, number> = {
      1: 0.85,
      2: 1,
      3: 1.2
    };
    const multiplicateur = multiplicateurs[taillePolice] || 1;
    return Math.round(base * multiplicateur);
  };

  return {
    couleurs,
    estModeSombre,
    fs, // Fonction pour les font-sizes
    taillePolice // Valeur brute (1, 2, 3)
  };
};
