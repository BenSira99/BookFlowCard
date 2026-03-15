import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { ServiceNotifProactives } from './service_notif_proactives';

const NOM_TACHE_FOND = 'TacheNotificationsProactives';

/**
 * Définit la tâche de fond qui s'exécutera périodiquement.
 */
TaskManager.defineTask(NOM_TACHE_FOND, async () => {
  try {
    // Exécuter la vérification des notifications
    await ServiceNotifProactives.verifierEtDeclencher();
    
    // Retourner le succès pour indiquer au système que la tâche a réussi
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (erreur) {
    console.error('[BackgroundFetch] Erreur lors de la vérification :', erreur);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Service pour enregistrer et gérer les tâches de fond.
 */
export const GestionnaireTachesFond = {
  /**
   * Enregistre la tâche de fond pour une exécution périodique.
   * L'intervalle minimum est de 15 minutes par défaut sur iOS/Android.
   */
  enregistrer: async () => {
    try {
      const estEnregistree = await TaskManager.isTaskRegisteredAsync(NOM_TACHE_FOND);
      
      if (!estEnregistree) {
        await BackgroundFetch.registerTaskAsync(NOM_TACHE_FOND, {
          minimumInterval: 15 * 60, // 15 minutes (en secondes)
          stopOnTerminate: false,    // Continuer même si l'app est fermée
          startOnBoot: true,        // Démarrer au redémarrage du téléphone
        });
        console.log(`[BackgroundFetch] Tâche "${NOM_TACHE_FOND}" enregistrée avec succès.`);
      }
    } catch (erreur) {
      console.error('[BackgroundFetch] Échec de l\'enregistrement :', erreur);
    }
  },

  /**
   * Désenregistre la tâche (si nécessaire).
   */
  desenregistrer: async () => {
    try {
      if (await TaskManager.isTaskRegisteredAsync(NOM_TACHE_FOND)) {
        await BackgroundFetch.unregisterTaskAsync(NOM_TACHE_FOND);
        console.log(`[BackgroundFetch] Tâche "${NOM_TACHE_FOND}" désenregistrée.`);
      }
    } catch (erreur) {
      console.error('[BackgroundFetch] Échec du désenregistrement :', erreur);
    }
  }
};
