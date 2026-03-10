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
 * Spécifications des types Desktop
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
 * Valide et parse une chaîne issue d'un scan QR (Format JSON ou Desktop).
 */
export const validerDonneesQR = (source: string): { success: true, data: any, format: 'JSON' | 'DESKTOP' } | { success: false, error: string } => {
  // 1. Tenter le format DESKTOP (nom_prenom_date_info_TYPE)
  const segments = source.split('_');
  if (segments.length >= 5) {
    const suffixe = segments[segments.length - 1].toUpperCase();
    if (['ELV', 'PER', 'ADM'].includes(suffixe)) {
      const typeMap: Record<string, TypeUtilisateurDesktop> = {
        'ELV': 'ELEVE',
        'PER': 'PERSONNEL',
        'ADM': 'ADMIN'
      };
      
      return {
        success: true,
        format: 'DESKTOP',
        data: {
          nom: segments[0],
          prenom: segments[1],
          dateInscription: segments[2],
          infoSpecifique: segments.slice(3, -1).join('_'), // Gère les segments multiples pour l'info
          type: typeMap[suffixe]
        } as DonneesUtilisateurDesktop
      };
    }
  }

  // 2. Tenter le format JSON
  try {
    const objet = JSON.parse(source);
    const validation = SchemaPayloadSynchronisation.safeParse(objet);
    if (validation.success) {
      return { success: true, format: 'JSON', data: validation.data };
    }
    return { success: false, error: 'SCHEMA_INVALIDE' };
  } catch (e) {
    return { success: false, error: 'FORMAT_INCONNU' };
  }
};
