import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinTransactions } from '../../store/magasin_transactions';
import { JaugeKarmaLiquide } from '../../components/library/jauge_karma_liquide';
import { BoutonPaiement } from '../../components/library/bouton_paiement';

const { width } = Dimensions.get('window');

/**
 * Dashboard Karma et gestion des amendes.
 * Si une amende est présente, un effet "Glitch" est appliqué sur son conteneur.
 */
export default function EcranAmendesKarma() {
  const { amendes } = utiliserMagasinTransactions();
  
  const listeAmendes = Object.values(amendes);
  const amendeActive = listeAmendes.find(a => a.statut?.toLowerCase() === 'impayée');
  
  // Simulation de score karma basé sur les amendes impayées
  const scoreKarma = amendeActive ? 30 : 95;

  // Valeurs pour l'effet Glitch (si amende)
  const glitchX = useSharedValue(0);
  const pulseEcran = useSharedValue(1);

  useEffect(() => {
    if (amendeActive) {
      // Effet Glitch : translations très rapides horizontales
      glitchX.value = withRepeat(
        withSequence(
          withDelay(3000, withTiming(4, { duration: 50 })), // Pause longue, puis glitch
          withTiming(-4, { duration: 50 }),
          withTiming(4, { duration: 50 }),
          withTiming(-2, { duration: 50 }),
          withTiming(0, { duration: 50 })
        ),
        -1, // Infini
        false
      );

      // Pulse d'alerte global (rouge sombre)
      pulseEcran.value = withRepeat(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      glitchX.value = 0;
      pulseEcran.value = 1;
    }
  }, [amendeActive]);

  const styleGlitch = useAnimatedStyle(() => ({
    transform: [{ translateX: glitchX.value }],
    shadowColor: glitchX.value !== 0 ? couleurs.erreur : 'transparent',
    shadowOpacity: glitchX.value !== 0 ? 0.8 : 0,
    shadowRadius: glitchX.value !== 0 ? 10 : 0,
    elevation: glitchX.value !== 0 ? 5 : 0,
  }));

  const stylePulseFond = useAnimatedStyle(() => ({
    backgroundColor: amendeActive 
      ? `rgba(239, 68, 68, ${ (pulseEcran.value - 1) * 2 })` // Rouge très transparent qui pulse
      : 'transparent'
  }));

  const gererPaiement = async () => {
    Alert.alert(
      'Paiement au Guichet',
      'Le paiement des amendes s\'effectue physiquement au guichet de la bibliothèque. Votre application se mettra à jour lors du prochain scan.'
    );
    return false;
  };

  return (
    <Animated.View style={[styles.conteneurGlobal, stylePulseFond]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* En-tête : Jauge de Karma */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.sectionJauge}>
           <Text style={styles.titreSection}>Mètre de Confiance</Text>
           <Text style={styles.sousTitre}>Votre implication dans notre écosystème.</Text>
           
           <View style={styles.espaceJauge}>
             <JaugeKarmaLiquide score={scoreKarma} taille={180} />
           </View>
        </Animated.View>

        {/* Section Amendes (si existe) */}
        {amendeActive ? (
          <Animated.View style={[styles.carteSanction, styleGlitch]}>
             <Text style={styles.texteAlerte}>⚠️ ATTENTION REQUISE</Text>
             
             <View style={styles.contenuSanction}>
               <Text style={styles.motifAlerte}>{amendeActive.motif || 'Reliquat de frais'}</Text>
               <Text style={styles.montantAlerte}>{amendeActive.montant ? amendeActive.montant.toFixed(0) : '0'} FCFA</Text>
             </View>

             <BoutonPaiement surPayer={gererPaiement} />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.delay(500)} style={styles.etatSain}>
            <Text style={styles.texteSain}>🌿 Votre dossier est parfait.</Text>
            <Text style={styles.texteSecondaire}>Continuez à rendre vos livres à l'heure !</Text>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  scrollContent: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  sectionJauge: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  titreSection: {
    color: couleurs.textePrincipal,
    fontSize: 22,
    fontWeight: 'bold',
  },
  sousTitre: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    marginTop: 5,
  },
  espaceJauge: {
    marginTop: 30,
  },
  carteSanction: {
    width: width * 0.9,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: couleurs.erreur,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  texteAlerte: {
    color: couleurs.erreur,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
  },
  contenuSanction: {
    alignItems: 'center',
    marginBottom: 10,
  },
  motifAlerte: {
    color: couleurs.textePrincipal,
    fontSize: 16,
    textAlign: 'center',
  },
  montantAlerte: {
    color: couleurs.erreur,
    fontSize: 36,
    fontWeight: '900',
    marginTop: 5,
  },
  etatSain: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(13, 148, 136, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.2)',
  },
  texteSain: {
    color: couleurs.succes,
    fontSize: 18,
    fontWeight: 'bold',
  },
  texteSecondaire: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    marginTop: 8,
  }
});
