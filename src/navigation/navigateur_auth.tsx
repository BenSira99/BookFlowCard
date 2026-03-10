import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { couleurs } from '../theme/couleurs';

import EcranBienvenue from '../screens/auth/ecran_bienvenue';
import EcranConnexion from '../screens/auth/ecran_connexion';
import EcranActivation from '../screens/auth/ecran_activation';
import EcranCreationCode from '../screens/auth/ecran_creation_code';
import EcranConfigurationBiometrie from '../screens/auth/ecran_configuration_biometrie';

const PileAuth = createNativeStackNavigator();

export default function NavigateurAuth() {
  return (
    <PileAuth.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: couleurs.arrierePlan },
        headerTintColor: couleurs.primaire,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: couleurs.arrierePlan },
      }}
    >
      <PileAuth.Screen 
        name="Bienvenue" 
        component={EcranBienvenue} 
        options={{ headerShown: false }}
      />
      <PileAuth.Screen 
        name="Connexion" 
        component={EcranConnexion}
        options={{ title: 'Se Connecter' }}
      />
      <PileAuth.Screen 
        name="Activation" 
        component={EcranActivation}
        options={{ title: 'Activer la Carte' }}
      />
      <PileAuth.Screen 
        name="CreationCode" 
        component={EcranCreationCode}
        options={{ title: 'Sécurité' }}
      />
      <PileAuth.Screen 
        name="ConfigurationBiometrie" 
        component={EcranConfigurationBiometrie}
        options={{ title: 'Biométrie' }}
      />
    </PileAuth.Navigator>
  );
}
