import { cacheDirectory, writeAsStringAsync, EncodingType } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { utiliserMagasinCatalogue } from '../store/magasin_catalogue';

/**
 * Service gérant le partage Peer-to-Peer hors ligne.
 * Convertit le catalogue local en fichier structuré .bcf (BookFlow Card Format)
 * et invoque le menu de partage natif (Nearby Share/AirDrop).
 */
export const servicePartageP2P = {
  /**
   * Génère un fichier contenant le catalogue et l'envoie via le système.
   */
  partagerCatalogue: async (): Promise<{ success: boolean; message: string }> => {
    try {
      // 1. Récupération des livres
      const livres = utiliserMagasinCatalogue.getState().livres;
      
      if (livres.length === 0) {
        return { success: false, message: 'Le catalogue est vide.' };
      }

      // 2. Structuration du Payload (Format Synchronisation)
      const payload = {
        type: 'CATALOGUE',
        horodatage: new Date().toISOString(),
        donnees: {
          livres: livres
        }
      };

      // 3. Création du fichier physique (.bcf pour être spécifique)
      const contenuJson = JSON.stringify(payload);
      const nomFichier = `BookFlow_Catalogue_${Date.now()}.bcf`;
      const cheminFichier = `${cacheDirectory}${nomFichier}`;

      await writeAsStringAsync(cheminFichier, contenuJson, {
        encoding: EncodingType.UTF8,
      });

      // 4. Lancement du partage natif (Ex: Nearby Share)
      const partageDisponible = await Sharing.isAvailableAsync();
      
      if (!partageDisponible) {
        return { success: false, message: "Le partage natif n'est pas disponible sur cet appareil." };
      }

      await Sharing.shareAsync(cheminFichier, {
        mimeType: 'application/json',
        dialogTitle: 'Partager le Catalogue BookFlow',
        UTI: 'public.json' // Pour iOS
      });

      return { success: true, message: 'Partage initié avec succès.' };
      
    } catch (erreur) {
      console.error('Erreur lors du partage P2P:', erreur);
      return { success: false, message: 'Une erreur est survenue lors du partage.' };
    }
  }
};
