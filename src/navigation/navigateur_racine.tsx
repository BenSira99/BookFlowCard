import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { couleurs } from '../theme/couleurs';

// Importer les états authentifiés
import { utiliserMagasinAuth } from '../store/magasin_auth';
import NavigateurAuth from './navigateur_auth';
import NavigateurPrincipal from './navigateur_principal';

const PileReseau = createNativeStackNavigator();

const ThemeBiblioCard = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: couleurs.primaire,
    background: couleurs.arrierePlan,
    card: couleurs.carteArrierePlan,
    text: couleurs.textePrincipal,
    border: couleurs.bordure,
    notification: couleurs.accentDoré,
  }
};

export default function NavigateurRacine() {
  const estConnecte = utiliserMagasinAuth(etat => etat.estConnecte);

  return (
    <NavigationContainer theme={ThemeBiblioCard}>
      <PileReseau.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: couleurs.arrierePlan },
        }}
      >
        {!estConnecte ? (
          <PileReseau.Screen name="Auth" component={NavigateurAuth} />
        ) : (
          <PileReseau.Screen name="Main" component={NavigateurPrincipal} />
        )}
      </PileReseau.Navigator>
    </NavigationContainer>
  );
}
