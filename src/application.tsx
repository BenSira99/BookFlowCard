import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigateurRacine from './navigation/navigateur_racine';
import { StatusBar } from 'expo-status-bar';

import { Alert, BackHandler } from 'react-native';
import { utilitaireTampering } from './utils/utilitaire_tampering';
import { useDesignSystem } from './hooks/useDesignSystem';
import { GestionnaireTachesFond } from './services/gestionnaire_taches_fond';
import { ServiceNotifProactives } from './services/service_notif_proactives';

export default function Application() {
  const { estModeSombre } = useDesignSystem();

  React.useEffect(() => {
    const initialiserApplication = async () => {
      // 1. Vérification de l'intégrité
      await verifierIntegriteApplication();
      
      // 2. Initialisation des notifications proactives
      const aAcces = await ServiceNotifProactives.demanderPermissions();
      if (aAcces) {
        await GestionnaireTachesFond.enregistrer();
        // Une première vérification immédiate au lancement
        await ServiceNotifProactives.verifierEtDeclencher();
      }
    };

    initialiserApplication();
  }, []);

  const verifierIntegriteApplication = async () => {
    const { estSain, motif } = await utilitaireTampering.verifierIntegrite();
    if (!estSain) {
      Alert.alert(
        "⚠️ Sécurité Compromise",
        `${motif}\n\nL'application s'arrête par mesure de sécurité pour protéger vos données.`,
        [{ text: "Quitter", onPress: () => BackHandler.exitApp() }]
      );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={estModeSombre ? 'light' : 'dark'} />
      <NavigateurRacine />
    </SafeAreaProvider>
  );
}

