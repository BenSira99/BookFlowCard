import { z } from 'zod';

// Schémas atomiques
const SchemaLivre = z.object({
  id: z.string(),
  titre: z.string(),
  auteur: z.string(),
  isbn: z.string(),
  resume: z.string(),
  categorie: z.string(),
  couverture: z.string(),
  disponible: z.boolean(),
  nombrePages: z.number(),
  editeur: z.string(),
  anneePublication: z.number(),
});

const SchemaEmprunt = z.object({
  id: z.string(),
  livreId: z.string(),
  dateEmprunt: z.string(),
  dateRetourPrevue: z.string(),
  statut: z.enum(['ACTIF', 'RENDU', 'RETARD', 'PROLONGE']),
  nbProlongations: z.number(),
});

const SchemaMembre = z.object({
  id: z.string(),
  nom: z.string(),
  prenom: z.string(),
  pseudonyme: z.string(),
  photo: z.string(),
  typeAbonnement: z.enum(['BRONZE', 'SILVER', 'GOLD']),
  dateExpiration: z.string(),
  secretQR: z.string(),
});

// Schéma Global du Payload QR
export const SchemaPayloadSynchronisation = z.object({
  type: z.enum(['CATALOGUE', 'SESSION_UTILISATEUR', 'MAJ_MANUELLE']),
  horodatage: z.string(),
  signature: z.string().optional(),
  donnees: z.object({
    livres: z.array(SchemaLivre).optional(),
    membre: SchemaMembre.optional(),
    emprunts: z.array(SchemaEmprunt).optional(),
  }),
});

/**
 * Spécifications des types Desktop (Ancien format court)
 */
export type TypeUtilisateurDesktop = 'ELEVE' | 'PERSONNEL' | 'ADMIN';

export interface DonneesUtilisateurDesktop {
  nom: string;
  prenom: string;
  dateInscription: string;
  infoSpecifique: string; // Classe_Num, Role ou NumCNI
  type: TypeUtilisateurDesktop;
}

/**
 * Schémas stricts pour l'inscription depuis JSON Desktop
 */
const SchemaInscriptionCommune = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  sexe: z.string(),
  numero_telephone: z.string().optional(),
  numero_telephone_second: z.string().optional(),
  date_inscription: z.string(),
  date_expiration: z.string().optional(),
  photo_profil: z.string().optional().nullable(),
  qr_code: z.string().min(1),
  user: z.object({}).passthrough().optional().nullable(), // Souvent un objet ou chaine
  inscrit_sur: z.string().optional().nullable(),
});

export const SchemaInscriptionEleve = SchemaInscriptionCommune.extend({
  type: z.literal("élève"),
  nom_parent: z.string(),
  prenom_parent: z.string(),
  numero_telephone_parent: z.string(),
  numero_telephone_parent_second: z.string().optional(),
  classe: z.string(),
  numero_classe: z.string(),
});

export const SchemaInscriptionAdmin = SchemaInscriptionCommune.extend({
  type: z.literal("admin"),
  email: z.string().email().optional().or(z.literal('')),
  email_second: z.string().email().optional().or(z.literal('')),
  num_cni: z.string(),
  num_nni: z.string().optional(),
});

export const SchemaInscriptionPersonnel = SchemaInscriptionCommune.extend({
  type: z.string(), // enseignant, etc.
  nom_proche_urgence: z.string(),
  numero_telephone_proche: z.string(),
  numero_telephone_proche_second: z.string().optional(),
  role_administrative: z.string(),
});

export const SchemaInscriptionDesktopJSON = z.union([
  SchemaInscriptionEleve,
  SchemaInscriptionAdmin,
  SchemaInscriptionPersonnel
]);

export type DonneesInscriptionDesktopJSON = z.infer<typeof SchemaInscriptionDesktopJSON>;

/**
 * Valide et parse une chaîne issue d'un scan QR (Format JSON ou Desktop).
 */
export const validerDonneesQR = (source: string): 
  | { success: true, data: any, format: 'JSON_SYNCHRO' | 'JSON_INSCRIPTION' | 'DESKTOP_COURT' } 
  | { success: false, error: string } => {
  
  // 1. Tenter le format JSON
  try {
    const objet = JSON.parse(source);
    
    // A. Validation Inscription JSON Stricte (App Desktop)
    const validationInscription = SchemaInscriptionDesktopJSON.safeParse(objet);
    if (validationInscription.success) {
      return { success: true, format: 'JSON_INSCRIPTION', data: validationInscription.data };
    }

    // B. Validation Synchro (Catalogue, Emprunts, Session)
    const validationSynchro = SchemaPayloadSynchronisation.safeParse(objet);
    if (validationSynchro.success) {
      return { success: true, format: 'JSON_SYNCHRO', data: validationSynchro.data };
    }
    
    console.warn("Erreurs Zod (Inscription / Synchro): ", validationInscription.error?.message);
    return { success: false, error: 'SCHEMA_INVALIDE' };
    
  } catch (e) {
    // 2. Si ce n'est pas un JSON, Tenter le format DESKTOP court (nom_prenom_date_info_TYPE)
    const segments = source.split('_');
    if (segments.length >= 5) {
      const suffixe = segments[segments.length - 1].toUpperCase();
      if (['ELV', 'PER', 'ADM'].includes(suffixe)) {
        const typeMap: Record<string, TypeUtilisateurDesktop> = {
          'ELV': 'ELEVE', 'PER': 'PERSONNEL', 'ADM': 'ADMIN'
        };
        return {
          success: true,
          format: 'DESKTOP_COURT',
          data: {
            nom: segments[0],
            prenom: segments[1],
            dateInscription: segments[2],
            infoSpecifique: segments.slice(3, -1).join('_'),
            type: typeMap[suffixe]
          } as DonneesUtilisateurDesktop
        };
      }
    }
    
    return { success: false, error: 'FORMAT_INCONNU' };
  }
};
