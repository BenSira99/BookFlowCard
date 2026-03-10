import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinBibliotheque } from '../../store/magasin_bibliotheque';
import { CarteLivreEmprunte } from '../../components/library/carte_livre_emprunte';

/**
 * Écran d'affichage des Emprunts en cours.
 * Interactions : Swipe horizontal, bouton de validation de retour avec vol 3D.
 */
export default function EcranEmprunts() {
  const { emprunts, prolongerEmprunt, retournerEmprunt } = utiliserMagasinBibliotheque();

  // Filtrer uniquement les emprunts non retournés
  const actifs = emprunts.filter(e => !e.estRetourne);

  const gererProlongation = async (id: string) => {
    const success = await prolongerEmprunt(id);
    if (success) {
      Alert.alert('Succès', 'Votre emprunt a été prolongé !');
    }
  };

  const gererRetour = (id: string) => {
    // La carte va déclencher cette fonction APRÈS son animation
    retournerEmprunt(id);
  };

  return (
    <GestureHandlerRootView style={styles.conteneurGlobal}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {actifs.length === 0 ? (
          <Animated.View entering={FadeIn} style={styles.etatVide}>
             <Text style={styles.texteVide}>Vous n'avez aucun livre emprunté.</Text>
          </Animated.View>
        ) : (
          <Text style={styles.titreSection}>Vos Emprunts Actifs ({actifs.length})</Text>
        )}

        {actifs.map((emprunt) => (
          <CarteLivreEmprunte 
             key={emprunt.id} 
             emprunt={emprunt} 
             surProlonger={gererProlongation}
             surRetourner={gererRetour}
          />
        ))}

        {actifs.length > 0 && (
          <Animated.View entering={FadeIn.delay(500)}>
            <Text style={styles.instruction}>
              Faites glisser une carte vers la gauche pour prolonger l'emprunt, ou appuyez sur la coche pour simuler un retour (Animation 3D).
            </Text>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </GestureHandlerRootView>
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
  instruction: {
    color: couleurs.texteSecondaire,
    fontSize: 11,
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 20,
    fontStyle: 'italic',
  }
});
