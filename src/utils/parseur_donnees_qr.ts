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
 * Valide et parse une chaîne JSON issue d'un scan QR.
 */
export const validerDonneesQR = (source: string): { success: true, data: any } | { success: false, error: string } => {
  try {
    const objet = JSON.parse(source);
    const validation = SchemaPayloadSynchronisation.safeParse(objet);
    if (validation.success) {
      return { success: true, data: validation.data };
    }
    return { success: false, error: 'SCHEMA_INVALIDE' };
  } catch (e) {
    return { success: false, error: 'JSON_INVALIDE' };
  }
};
