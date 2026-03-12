import { validerDonneesQR, SchemaPayloadSynchronisation, DonneesInscriptionDesktopJSON } from '../utils/parseur_donnees_qr';
import { utiliserMagasinCatalogue, Livre } from '../store/magasin_catalogue';
import { utiliserMagasinAuth } from '../store/magasin_auth';
import { utiliserMagasinTransactions } from '../store/magasin_transactions';
import { inputSanitizer } from '../utils/input_sanitizer';

/**
 * Service orchestrant la synchronisation des données issues des QR Codes.
 * Fait le pont entre le parseur (validation) et les magasins Zustand (persistance).
 */
export const serviceSynchroQR = {
  /**
   * Traite une chaîne de caractères issue d'un scan QR.
   * Retourne un objet de succès avec les données de delta pour l'affichage.
   */
  traiterScan: (contenu: string): any => {
    // 1. Sanitization de la chaîne brute (CWE-79)
    const contenuPropre = inputSanitizer.nettoyerTexte(contenu);
    
    const validation = validerDonneesQR(contenuPropre);
    
    if (!validation.success) {
      return { success: false, erreur: validation.error };
    }

    // 2. Sanitization récursive de l'objet (CWE-20)
    const data = inputSanitizer.sanitiserObjet(validation.data);
    const format = validation.format;

    // A. Cas Synchronisation JSON (Catalogue / Session)
    if (format === 'JSON_SYNCHRO') {
      const payload = data;
      
      switch (payload.type) {
        case 'CATALOGUE':
          if (Array.isArray(payload.donnees.livres)) {
            const resultat = utiliserMagasinCatalogue.getState().fusionnerCatalogue(payload.donnees.livres as Livre[]);
            return { 
              success: true, 
              type: 'CATALOGUE', 
              ajoutes: resultat.ajoutes, 
              misAJour: resultat.misAJour 
            };
          }
          break;

        case 'SESSION_UTILISATEUR':
          if (payload.donnees.membre) {
            const m = payload.donnees.membre;
            utiliserMagasinAuth.getState().importerUtilisateur({
              id: m.id,
              nom: m.nom,
              prenom: m.prenom,
              pseudonyme: m.pseudonyme,
              photo: m.photo,
              dateExpiration: m.dateExpiration,
              typeRole: m.typeAbonnement as any,
              secretQR: m.secretQR
            });
            return { success: true, type: 'SESSION', message: 'Session utilisateur importée.' };
          }
          break;
      }
    }

    // B. Cas Transactions Desktop (Emprunts, Réservations, Amendes)
    if (format === 'JSON_TRANSACTIONS') {
      const delta = utiliserMagasinTransactions.getState().synchroniserTransactions(data);
      return {
        success: true,
        type: 'TRANSACTIONS',
        delta
      };
    }

    // C. Cas Inscription Desktop (JSON complet ou format court)
    if (format === 'JSON_INSCRIPTION' || format === 'DESKTOP_COURT') {
      return serviceSynchroQR.traiterInscriptionDesktop(contenu);
    }

    return { success: false, erreur: 'TYPE_NON_GERE' };
  },

  /**
   * Logique spécifique pour l'inscription (Nouvelle installation / activation).
   */
  traiterInscriptionDesktop: (chaine: string): any => {
    const validation = validerDonneesQR(chaine);
    if (!validation.success) return { success: false, erreur: validation.error };

    const format = validation.format;
    const data = validation.data;

    // Normalisation vers l'interface Utilisateur du magasin_auth
    if (format === 'JSON_INSCRIPTION') {
      const d = data as DonneesInscriptionDesktopJSON;
      utiliserMagasinAuth.getState().importerUtilisateur({
        id: d.qr_code,
        nom: d.nom,
        prenom: d.prenom,
        dateExpiration: d.date_expiration || '',
        typeRole: d.type as any,
        photo: d.photo_profil || undefined,
        secretQR: d.qr_code
      });
      return { success: true, type: 'INSCRIPTION', message: 'Inscription réussie.' };
    } 

    if (format === 'DESKTOP_COURT') {
      const d = data;
      utiliserMagasinAuth.getState().importerUtilisateur({
        id: d.infoSpecifique, // On utilise l'info specifique (ex: ID unique)
        nom: d.nom,
        prenom: d.prenom,
        typeRole: d.type as any,
        secretQR: d.infoSpecifique
      });
      return { success: true, type: 'INSCRIPTION', message: 'Inscription réussie (Format court).' };
    }
    return { success: false, erreur: 'FORMAT_INSCRIPTION_INVALIDE' };
  },

  /**
   * Analyse un QR code d'inscription sans importer les données.
   * Utile pour la pré-visualisation avant validation.
   */
  analyserInscription: (chaine: string): any => {
    const validation = validerDonneesQR(inputSanitizer.nettoyerTexte(chaine));
    if (!validation.success) return { success: false, erreur: validation.error };

    const format = validation.format;
    const data = validation.data;

    if (format === 'JSON_INSCRIPTION') {
      return { success: true, format, data };
    } 

    if (format === 'DESKTOP_COURT') {
      return { success: true, format, data };
    }

    return { success: false, erreur: 'FORMAT_INSCRIPTION_INVALIDE' };
  }
};
