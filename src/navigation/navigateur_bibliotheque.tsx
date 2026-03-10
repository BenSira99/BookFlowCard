import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { couleurs } from '../theme/couleurs';

// Écrans de la Bibliothèque
import EcranEmprunts from '../screens/library/ecran_emprunts';
import EcranReservations from '../screens/library/ecran_reservations';
import EcranAmendesKarma from '../screens/library/ecran_amendes_karma';

const OngletsHauts = createMaterialTopTabNavigator();

export default function NavigateurBibliotheque() {
  return (
    <View style={styles.conteneurGlobal}>
      <OngletsHauts.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: couleurs.carteArrierePlan,
            elevation: 0, // Enlever l'ombre Android
            shadowOpacity: 0, // Enlever l'ombre iOS
            borderBottomWidth: 1,
            borderBottomColor: couleurs.bordure,
          },
          tabBarIndicatorStyle: {
            backgroundColor: couleurs.primaire,
            height: 3,
            borderRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
          tabBarActiveTintColor: couleurs.primaire,
          tabBarInactiveTintColor: couleurs.texteSecondaire,
        }}
      >
        <OngletsHauts.Screen 
          name="Emprunts" 
          component={EcranEmprunts} 
          options={{ title: 'Emprunts' }}
        />
        <OngletsHauts.Screen 
          name="Reservations" 
          component={EcranReservations} 
          options={{ title: 'Réservés' }}
        />
        <OngletsHauts.Screen 
          name="Karma" 
          component={EcranAmendesKarma} 
          options={{ title: 'Karma' }}
        />
      </OngletsHauts.Navigator>
    </View>
  );
}

// Un conteneur pour éviter que le Top Tab ne passe sous la StatusBar ou le notch
const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  }
});
