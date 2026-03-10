import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import Animated, { FadeIn, SlideOutRight } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinBibliotheque } from '../../store/magasin_bibliotheque';
import { CarteReservation } from '../../components/library/carte_reservation';

export default function EcranReservations() {
  const { reservations, annulerReservation } = utiliserMagasinBibliotheque();

  const handleAnnuler = (id: string) => {
    Alert.alert(
      'Annuler la réservation',
      'Êtes-vous sûr de vouloir annuler cette réservation ? Vous perdrez votre place dans la file d\'attente.',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui, annuler', 
          style: 'destructive',
          onPress: () => annulerReservation(id)
        }
      ]
    );
  };

  return (
    <View style={styles.conteneurGlobal}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {reservations.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.etatVide}>
             <Text style={styles.texteVide}>Vous n'avez aucune réservation en cours.</Text>
          </Animated.View>
        ) : (
          <Text style={styles.titreSection}>Vos Réservations ({reservations.length}/3)</Text>
        )}

        {reservations.map((res) => (
          <Animated.View key={res.id} exiting={SlideOutRight}>
            <CarteReservation 
              reservation={res} 
              surAnnuler={handleAnnuler}
            />
          </Animated.View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  titreSection: {
    color: couleurs.textePrincipal,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  etatVide: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texteVide: {
    color: couleurs.texteSecondaire,
    fontSize: 16,
    fontStyle: 'italic',
  },
});
