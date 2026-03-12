import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { couleurs } from '../theme/couleurs';

// Importer les états authentifiés
import { utiliserMagasinAuth } from '../store/magasin_auth';
import NavigateurAuth from './navigateur_auth';
import NavigateurPrincipal from './navigateur_principal';
import EcranStatistiquesDetaillees from '../screens/statistics/ecran_statistiques_detaillees';
import EcranCatalogue from '../screens/catalog/ecran_catalogue';
import EcranScannerISBN from '../screens/catalog/ecran_scanner_isbn';
import EcranDetailsLivre from '../screens/catalog/ecran_details_livre';
import EcranInfosBibliotheque from '../screens/info/ecran_infos_bibliotheque';
import EcranParametres from '../screens/settings/ecran_parametres';
import EcranChangementPin from '../screens/settings/ecran_changement_pin';

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
          <>
            <PileReseau.Screen name="Main" component={NavigateurPrincipal} />
            <PileReseau.Screen 
              name="StatsDetaillees" 
              component={EcranStatistiquesDetaillees} 
              options={{ animation: 'slide_from_right' }}
            />
            <PileReseau.Screen 
              name="Catalogue" 
              component={EcranCatalogue} 
              options={{ animation: 'fade_from_bottom' }}
            />
            <PileReseau.Screen 
              name="DetailsLivre" 
              component={EcranDetailsLivre} 
              options={{ animation: 'slide_from_right' }}
            />
            <PileReseau.Screen 
              name="InfosBiblio" 
              component={EcranInfosBibliotheque} 
              options={{ animation: 'fade_from_bottom' }}
            />
            <PileReseau.Screen 
              name="Parametres" 
              component={EcranParametres} 
              options={{ animation: 'slide_from_right' }}
            />
            <PileReseau.Screen 
              name="ChangementPin" 
              component={EcranChangementPin} 
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </>
        )}
        <PileReseau.Screen 
          name="ScannerISBN" 
          component={EcranScannerISBN} 
          options={{ animation: 'slide_from_bottom', presentation: 'fullScreenModal' }}
        />
      </PileReseau.Navigator>
    </NavigationContainer>
  );
}
