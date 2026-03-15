import { create } from 'zustand';

export type TypeNotification = 'rappel_retour' | 'reservation_dispo' | 'info' | 'alerte';

export interface Notification {
  id: string;
  titre: string;
  message: string;
  date: string; // ISO string
  estLu: boolean;
  type: TypeNotification;
}

interface EtatNotifications {
  notifications: Notification[];
  ajouterNotification: (notif: Omit<Notification, 'id' | 'date' | 'estLu'>) => void;
  marquerCommeLu: (id: string) => void;
  marquerToutCommeLu: () => void;
  supprimerNotification: (id: string) => void;
  toutSupprimer: () => void;
  nbNonLues: () => number;
}

const MAX_NOTIFICATIONS = 50;

export const utiliserMagasinNotifications = create<EtatNotifications>((set, get) => ({
  notifications: [
    {
      id: '1',
      titre: 'Bienvenue sur BookFlow Card',
      message: 'Explorez votre nouvelle bibliothèque numérique et gérez vos emprunts facilement.',
      date: new Date().toISOString(),
      estLu: false,
      type: 'info',
    },
    {
      id: '2',
      titre: 'Rappel de retour',
      message: 'Le livre "Clean Architecture" doit être rendu dans 3 jours.',
      date: new Date(Date.now() - 3600000).toISOString(),
      estLu: true,
      type: 'rappel_retour',
    }
  ],

  ajouterNotification: (nouvelle) => {
    set((etat) => {
      const notif: Notification = {
        ...nouvelle,
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString(),
        estLu: false,
      };
      
      const nouvellesNotifs = [notif, ...etat.notifications].slice(0, MAX_NOTIFICATIONS);
      return { notifications: nouvellesNotifs };
    });
  },

  marquerCommeLu: (id) => {
    set((etat) => ({
      notifications: etat.notifications.map((n) =>
        n.id === id ? { ...n, estLu: true } : n
      ),
    }));
  },

  marquerToutCommeLu: () => {
    set((etat) => ({
      notifications: etat.notifications.map((n) => ({ ...n, estLu: true })),
    }));
  },

  supprimerNotification: (id) => {
    set((etat) => ({
      notifications: etat.notifications.filter((n) => n.id !== id),
    }));
  },

  toutSupprimer: () => {
    set({ notifications: [] });
  },

  nbNonLues: () => {
    return get().notifications.filter((n) => !n.estLu).length;
  },
}));

// Simulation de WebSocket / Notifs temps réel
if (typeof window !== 'undefined') {
  setInterval(() => {
    const chance = Math.random();
    if (chance > 0.95) { // 5% de chance toutes les 30s de recevoir une notif (pour démo)
      const magasin = utiliserMagasinNotifications.getState();
      const types: TypeNotification[] = ['info', 'alerte', 'reservation_dispo'];
      const titres = ['Nouveau message', 'Alerte système', 'Livre disponible !'];
      const messages = [
        'Une nouvelle ressource est disponible au rayon info.',
        'La maintenance du réseau local est prévue demain.',
        'Le livre que vous avez réservé vous attend à l\'accueil.'
      ];
      const index = Math.floor(Math.random() * types.length);
      
      magasin.ajouterNotification({
        titre: titres[index],
        message: messages[index],
        type: types[index] as TypeNotification,
      });
    }
  }, 30000);
}
