import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../theme/couleurs';

import EcranAccueil from '../screens/app/ecran_accueil';
import EcranCarteMembre from '../screens/card/ecran_carte_membre';
import EcranProfil from '../screens/profile/ecran_profil';
import NavigateurBibliotheque from './navigateur_bibliotheque';
import EcranNotifications from '../screens/notifications/ecran_notifications';
import { IconeClocheAnimee } from '../components/notifications/icone_cloche_animee';

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
          } else if (route.name === 'Bibliotheque') {
            nomIcone = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Notifications') {
            return <IconeClocheAnimee focused={focused} color={color} size={size} />;
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
        component={EcranCarteMembre} 
        options={{ title: 'Ma Carte' }}
      />
      <Onglets.Screen 
        name="Bibliotheque" 
        component={NavigateurBibliotheque} 
        options={{ title: 'Mes Livres' }}
      />
      <Onglets.Screen 
        name="Notifications" 
        component={EcranNotifications} 
        options={{ title: 'Alertes' }}
      />
      <Onglets.Screen 
        name="Profil" 
        component={EcranProfil} 
        options={{ title: 'Profil' }}
      />
    </Onglets.Navigator>
  );
}
