import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigateurRacine from './navigation/navigateur_racine';

import { Alert, BackHandler } from 'react-native';
import { utilitaireTampering } from './utils/utilitaire_tampering';

export default function Application() {
  React.useEffect(() => {
    verifierIntegriteApplication();
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
      <NavigateurRacine />
    </SafeAreaProvider>
  );
}

