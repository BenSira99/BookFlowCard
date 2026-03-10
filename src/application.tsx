import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigateurRacine from './navigation/navigateur_racine';

export default function Application() {
  return (
    <SafeAreaProvider>
      <NavigateurRacine />
    </SafeAreaProvider>
  );
}

