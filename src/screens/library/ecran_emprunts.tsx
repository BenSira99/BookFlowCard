import React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinTransactions, TransactionEmprunt } from '../../store/magasin_transactions';
import { CarteLivreEmprunte } from '../../components/library/carte_livre_emprunte';

/**
 * Écran d'affichage des Emprunts en cours.
 * Chargé depuis le magasin synchronisé avec l'App Desktop.
 */
export default function EcranEmprunts() {
  const { emprunts } = utiliserMagasinTransactions();
  
  // Convertir le Record en tableau et filtrer les emprunts actifs
  const listeEmprunts = Object.values(emprunts);
  const actifs = listeEmprunts.filter(e => e.statut?.toLowerCase() !== 'retourné');

  const gererProlongation = (id: string) => {
    Alert.alert('Info', 'Veuillez vous présenter au guichet pour prolonger cet emprunt.');
  };

  const gererRetour = (id: string) => {
    Alert.alert('Info', 'Livre à retourner physiquement à la bibliothèque.');
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
             key={String(emprunt.id_emprunt)} 
             emprunt={emprunt} 
             surProlonger={() => gererProlongation(String(emprunt.id_emprunt))}
             surRetourner={() => gererRetour(String(emprunt.id_emprunt))}
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
