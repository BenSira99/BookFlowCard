import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { Livre } from '../../store/magasin_catalogue';

const { width } = Dimensions.get('window');

/**
 * Écran de Résumé de Synchronisation.
 * Affiche les livres ajoutés et mis à jour après un scan ou un partage P2P.
 * Emploie des animations de célébration pour une expérience "Premium".
 */
export default function EcranResumeImportation() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Récupération des données passées en paramètres de navigation
  const { ajoutes, misAJour } = route.params as { ajoutes: Livre[], misAJour: Livre[] };

  useEffect(() => {
    // Audit log / Analytique si besoin
    console.log(`Résumé: ${ajoutes.length} nouveaux, ${misAJour.length} MAJ.`);
  }, []);

  return (
    <View style={styles.conteneurGlobal}>
      <ConfettiCannon 
        count={150} 
        origin={{x: width / 2, y: -20}} 
        fadeOut={true} 
        fallSpeed={3000}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <View style={styles.cercleIcone}>
            <Ionicons name="checkmark-done-circle" size={60} color={couleurs.succes} />
          </View>
          <Text style={styles.titre}>Synchronisation Réussie !</Text>
          <Text style={styles.sousTitre}>
            Votre bibliothèque locale a été mise à jour avec succès.
          </Text>
        </Animated.View>

        {/* Section Nouveautés */}
        {ajoutes.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.enteteSection}>
              <Ionicons name="sparkles" size={20} color={couleurs.primaire} />
              <Text style={styles.titreSection}>Nouveautés ({ajoutes.length})</Text>
            </View>
            {ajoutes.map((livre, index) => (
              <View key={`add-${index}`} style={styles.carteLivre}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.primaire }]} />
                <View style={styles.infoLivre}>
                  <Text style={styles.livreTitre} numberOfLines={1}>{livre.titre}</Text>
                  <Text style={styles.livreAuteur}>{livre.auteur}</Text>
                </View>
                <View style={styles.badgeNouveau}>
                  <Text style={styles.texteBadge}>NOUVEAU</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Section Mises à Jour */}
        {misAJour.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <View style={styles.enteteSection}>
              <Ionicons name="refresh-circle" size={20} color={couleurs.attention} />
              <Text style={styles.titreSection}>Stocks mis à jour ({misAJour.length})</Text>
            </View>
            {misAJour.map((livre, index) => (
              <View key={`upd-${index}`} style={styles.carteLivre}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.attention }]} />
                <View style={styles.infoLivre}>
                  <Text style={styles.livreTitre} numberOfLines={1}>{livre.titre}</Text>
                  <Text style={styles.livreAuteur}>{livre.auteur}</Text>
                </View>
                <Text style={styles.stockLabel}>Stock refait</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Bouton de retour */}
        <Animated.View entering={FadeInUp.delay(800)}>
          <TouchableOpacity 
            style={styles.boutonAction} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.texteBoutonAction}>Retourner à la Bibliothèque</Text>
          </TouchableOpacity>
        </Animated.View>

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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  cercleIcone: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 16,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  enteteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  titreSection: {
    fontSize: 18,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginLeft: 8,
  },
  carteLivre: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  indicateur: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 15,
  },
  infoLivre: {
    flex: 1,
  },
  livreTitre: {
    fontSize: 16,
    fontWeight: '600',
    color: couleurs.textePrincipal,
  },
  livreAuteur: {
    fontSize: 14,
    color: couleurs.texteSecondaire,
    marginTop: 2,
  },
  badgeNouveau: {
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  texteBadge: {
    color: couleurs.primaire,
    fontSize: 10,
    fontWeight: 'bold',
  },
  stockLabel: {
    fontSize: 12,
    color: couleurs.attention,
    fontWeight: '500',
  },
  boutonAction: {
    backgroundColor: couleurs.primaire,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  texteBoutonAction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
