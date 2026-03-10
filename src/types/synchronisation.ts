import { Livre } from './livre';
import { Emprunt, Reservation, Amende } from './bibliotheque';
import { Membre } from './membre';

export type TypePayloadQR = 'CATALOGUE' | 'SESSION_UTILISATEUR' | 'MAJ_MANUELLE';

export interface PayloadSynchronisation {
  type: TypePayloadQR;
  horodatage: string;
  signature?: string;
  donnees: {
    livres?: Livre[];
    membre?: Membre;
    emprunts?: Emprunt[];
    reservations?: Reservation[];
    amendes?: Amende[];
    scoreKarma?: number;
    notifications?: any[];
  };
}
