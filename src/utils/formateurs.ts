import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Utilitaires de formatage pour l'interface (Ben Sira Quality).
 */
export const formateurs = {
  /**
   * Formate une date au format lisible (ex: 12 Mars 2024).
   */
  dateLisible: (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd MMMM yyyy', { locale: fr });
  },

  /**
   * Formate une date relative (ex: il y a 2 jours).
   */
  dateRelative: (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true, locale: fr });
  },

  /**
   * Formate un numéro de membre (ex: MEM-0012-34).
   */
  numeroMembre: (id: string): string => {
    const clean = id.replace(/[^A-Z0-9]/gi, '');
    if (clean.length < 6) return id.toUpperCase();
    return `MEM-${clean.slice(0, 4)}-${clean.slice(-2)}`.toUpperCase();
  }
};
