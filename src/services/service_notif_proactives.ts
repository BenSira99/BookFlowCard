import * as Notifications from 'expo-notifications';
import { utiliserMagasinTransactions, TransactionEmprunt, TransactionReservation, TransactionAmende } from '../store/magasin_transactions';
import { utiliserMagasinNotifications } from '../store/magasin_notifications';
import { differenceInHours, differenceInDays, parseISO, isAfter, isBefore, startOfDay, addDays, format } from 'date-fns';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const ServiceNotifProactives = {
  /**
   * Vérifie tous les statuts (emprunts, réservations, amendes) et déclenche les notifications nécessaires.
   */
  verifierEtDeclencher: async () => {
    const { emprunts, reservations, amendes } = utiliserMagasinTransactions.getState();
    const { ajouterNotification } = utiliserMagasinNotifications.getState();
    const maintenant = new Date();
    const heureActuelle = maintenant.getHours();

    // 1. Gestion des Emprunts
    Object.values(emprunts).forEach(async (emprunt) => {
      if (!emprunt.date_retour_prevue || emprunt.statut === 'retourné') return;

      const dateRetour = parseISO(emprunt.date_retour_prevue);
      const joursRestants = differenceInDays(dateRetour, maintenant);
      const estJourJ = joursRestants === 0 && isBefore(maintenant, dateRetour);
      const estEnRetard = isAfter(maintenant, dateRetour);

      // Scénario : Proche de l'échéance (J-3 à Jour J)
      if (joursRestants <= 3 && joursRestants > 0) {
        // Fréquence : Toutes les 6h entre 09h et 00h
        if (heureActuelle >= 9 && heureActuelle <= 23 && heureActuelle % 6 === 0) {
          await envoyerNotification(
            `Rappel : ${emprunt.titre}`,
            `Il vous reste ${joursRestants} jour(s) pour rendre ce livre.`,
            'rappel_retour'
          );
        }
      } 
      // Scénario : Jour J
      else if (estJourJ) {
        // Fréquence : Toutes les 2h
        if (heureActuelle % 2 === 0) {
          await envoyerNotification(
            `Dernier délai : ${emprunt.titre}`,
            `C'est aujourd'hui le dernier jour pour rendre votre emprunt !`,
            'alerte'
          );
        }
      }
      // Scénario : En Retard
      else if (estEnRetard) {
        // Fréquence : Toutes les 1h entre 09h et 22h
        if (heureActuelle >= 9 && heureActuelle <= 22) {
          await envoyerNotification(
            `RETARD CRITIQUE : ${emprunt.titre}`,
            `Vous avez dépassé la date de retour. Merci de le rendre immédiatement.`,
            'alerte'
          );
        }
      }
    });

    // 2. Gestion des Réservations
    Object.values(reservations).forEach(async (resa) => {
      if (resa.statut === 'en cours' && resa.date_expiration_reservation) {
        const expiration = parseISO(resa.date_expiration_reservation);
        if (isAfter(maintenant, expiration)) {
          // Annulation automatique simulée dans les notifs
          await envoyerNotification(
            `Réservation Annulée`,
            `Votre réservation pour "${resa.titre}" a expiré et a été annulée.`,
            'info'
          );
          // Note : Idéalement, on mettrait à jour le store ici aussi.
        }
      }
    });

    // 3. Gestion des Amendes
    Object.values(amendes).forEach(async (amende) => {
      if (amende.statut === 'impayée') {
        // Fréquence : Toutes les 4h
        if (heureActuelle % 4 === 0) {
          await envoyerNotification(
            `Amende Impayée`,
            `Vous avez une amende en attente de ${amende.montant}€. Merci de régulariser.`,
            'alerte'
          );
        }
      }
    });
  },

  /**
   * Demande les permissions de notification
   */
  demanderPermissions: async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }
};

/**
 * Fonction utilitaire pour envoyer une notification locale Push
 */
async function envoyerNotification(titre: string, message: string, type: any) {
  // 1. Ajouter au magasin interne pour l'historique dans l'app
  const { ajouterNotification } = utiliserMagasinNotifications.getState();
  ajouterNotification({
    titre,
    message,
    type,
  });

  // 2. Déclencher la notification système (Push)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titre,
      body: message,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { type },
    },
    trigger: null, // Immédiat car le service tourne en tâche de fond avec sa propre logique de temps
  });
}
