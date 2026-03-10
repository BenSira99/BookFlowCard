import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../theme/couleurs';

import EcranAccueil from '../screens/app/ecran_accueil';
import EcranCarte from '../screens/app/ecran_carte';
import EcranProfilPlaceholder from '../screens/app/ecran_profil_placeholder'; // à créer brièvement

const Onglets = createBottomTabNavigator();

export default function NavigateurPrincipal() {
  return (
    <Onglets.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: couleurs.carteArrierePlan,
          borderTopColor: couleurs.bordure,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: couleurs.primaire,
        tabBarInactiveTintColor: couleurs.texteSecondaire,
        tabBarIcon: ({ focused, color, size }) => {
          let nomIcone: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Accueil') {
            nomIcone = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Carte') {
            nomIcone = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profil') {
            nomIcone = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={nomIcone} size={size} color={color} />;
        },
      })}
    >
      <Onglets.Screen 
        name="Accueil" 
        component={EcranAccueil} 
        options={{ title: 'Accueil' }}
      />
      <Onglets.Screen 
        name="Carte" 
        component={EcranCarte} 
        options={{ title: 'Ma Carte' }}
      />
      <Onglets.Screen 
        name="Profil" 
        component={EcranProfilPlaceholder} 
        options={{ title: 'Profil' }}
      />
    </Onglets.Navigator>
  );
}
