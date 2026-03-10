import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import Animated, { FadeIn, SlideOutRight } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinTransactions } from '../../store/magasin_transactions';
import { CarteReservation } from '../../components/library/carte_reservation';

export default function EcranReservations() {
  const { reservations } = utiliserMagasinTransactions();
  const listeReservations = Object.values(reservations);

  const handleAnnuler = (id: string) => {
    Alert.alert(
      'Annulation au Guichet',
      'Pour annuler une réservation, veuillez scanner votre QR Code au guichet de la bibliothèque.'
    );
  };

  return (
    <View style={styles.conteneurGlobal}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {listeReservations.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.etatVide}>
             <Text style={styles.texteVide}>Vous n'avez aucune réservation en cours.</Text>
          </Animated.View>
        ) : (
          <Text style={styles.titreSection}>Vos Réservations ({listeReservations.length})</Text>
        )}

        {listeReservations.map((res) => (
          <Animated.View key={String(res.id_reservation)} exiting={SlideOutRight}>
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
