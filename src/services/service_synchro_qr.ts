import { validerDonneesQR } from '../utils/parseur_donnees_qr';
import { utiliserMagasinCatalogue } from '../store/magasin_catalogue';
import { utiliserMagasinBibliotheque } from '../store/magasin_bibliotheque';
import { utiliserMagasinAuth } from '../store/magasin_auth';

/**
 * Service orchestrant la synchronisation des données via QR Code.
 * Transforme les payloads scannés en mises à jour d'état globales.
 */
export const serviceSynchroQR = {
  /**
   * Traite une chaîne de caractères issue d'un scan QR.
   */
  traiterScan: (contenu: string) => {
    const resultat = validerDonneesQR(contenu);
    
    if (!resultat.success) {
      return { success: false, erreur: 'DONNEES_INVALIDES' };
    }

    const payload = (resultat as any).data;

    // Dispatching des données vers les magasins appropriés
    switch (payload.type) {
      case 'CATALOGUE':
        if (payload.donnees.livres) {
          utiliserMagasinCatalogue.getState().importerLivres(payload.donnees.livres as any);
        }
        break;
      
      case 'SESSION_UTILISATEUR':
        if (payload.donnees.membre) {
          // Mise à jour du profil utilisateur et connexion automatique
          const m = payload.donnees.membre;
          utiliserMagasinAuth.getState().importerUtilisateur({
            id: m.id,
            nom: m.nom,
            prenom: m.prenom,
            numeroMembre: m.id // Réutilisation de l'ID comme numéro de membre si non spécifié
          });
        }
        
        // Mise à jour de la situation bibliothèque (emprunts, etc.)
        utiliserMagasinBibliotheque.getState().importerSession({
          emprunts: payload.donnees.emprunts as any,
          reservations: payload.donnees.reservations as any,
          amendes: payload.donnees.amendes as any,
          scoreKarma: payload.donnees.scoreKarma
        });
        break;

      case 'MAJ_MANUELLE':
        // Mise à jour ciblée (ex: on vient de rendre un livre ou payer une amende)
        utiliserMagasinBibliotheque.getState().importerSession({
          emprunts: payload.donnees.emprunts as any,
          reservations: payload.donnees.reservations as any,
          amendes: payload.donnees.amendes as any,
          scoreKarma: payload.donnees.scoreKarma
        });
        break;
    }

    return { 
      success: true, 
      type: payload.type,
      message: `Synchronisation ${payload.type} réussie` 
    };
  }
};
