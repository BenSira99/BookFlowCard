import Constants from 'expo-constants';
import * as Device from 'expo-device';

/**
 * Utilitaire de détection de tampering (M8).
 * Vérifie si l'appareil est rooté, jailbreaké ou s'il s'agit d'un émulateur.
 */
export const utilitaireTampering = {
  /**
   * Vérifie l'intégrité de l'appareil.
   * Note : Sur mobile, c'est une détection "best-effort".
   */
  verifierIntegrite: async (): Promise<{ estSain: boolean; motif?: string }> => {
    // 1. Détection émulatueur (souvent utilisé pour reverse engineering M9)
    if (!Device.isDevice) {
      return { estSain: false, motif: "Environnement de simulation détecté (Émulateur)." };
    }

    // 2. Détection Root/Jailbreak (Experimental via expo-device)
    const estRooted = await Device.isRootedExperimentalAsync();
    if (estRooted) {
      return { estSain: false, motif: "Appareil rooté ou jailbreaké détecté." };
    }

    // 3. Vérification du mode de développement (si nécessaire)
    if (Constants.appOwnership === 'expo') {
      // Autorisé en dev, mais on pourrait restreindre en prod réelle
    }

    return { estSain: true };
  }
};
