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
            typeRole: 'Utilisateur', // Par défaut pour la session via login synchro
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
  },

  /**
   * Traite spécifiquement les données d'inscription du logiciel Desktop.
   */
  traiterInscriptionDesktop: (contenu: string) => {
    const resultat = validerDonneesQR(contenu);
    
    // On accepte soit le dictionnaire complet JSON_INSCRIPTION, soit la chaîne courte DESKTOP_COURT
    if (!resultat.success || (resultat.format !== 'DESKTOP_COURT' && resultat.format !== 'JSON_INSCRIPTION')) {
      return { success: false, erreur: 'FORMAT_INSCRIPTION_INVALIDE' };
    }

    const d = resultat.data;

    if (resultat.format === 'JSON_INSCRIPTION') {
      // Cas: Le QR Code est le JSON généré par la méthode get_data() du Desktop
      utiliserMagasinAuth.getState().importerUtilisateur({
        id: d.qr_code, 
        nom: d.nom,
        prenom: d.prenom,
        typeRole: d.type,
        sexe: d.sexe,
        telephone: d.numero_telephone,
        dateInscription: d.date_inscription,
        donneesBrutes: d // Stocke l'entièreté de l'objet pour s'y référer plus tard !
      });

      return {
        success: true,
        data: d,
        message: `Inscription ${d.type} détectée pour ${d.nom} ${d.prenom} (Format Completely Secure)`
      };
    } else {
      // Cas: Le QR Code n'est que la petite chaine (nom_prenom_date_info_TYPE)
      utiliserMagasinAuth.getState().importerUtilisateur({
        id: `ID-${d.type}-${Date.now()}`, 
        nom: d.nom,
        prenom: d.prenom,
        typeRole: d.type,
        dateInscription: d.dateInscription
      });

      return {
        success: true,
        data: d,
        message: `Inscription ${d.type} détectée pour ${d.nom} ${d.prenom} (Format Court)`
      };
    }
  }
};
