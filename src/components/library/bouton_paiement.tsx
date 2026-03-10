import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { couleurs } from '../../theme/couleurs';

const { width } = Dimensions.get('window');

interface ProprietesBoutonPaiement {
  surPayer: () => Promise<boolean>;
}

/**
 * Bouton de paiement avec effet de loading -> morphing checkmark -> confettis de pièces (Lottie equivalent ressource).
 */
export const BoutonPaiement = ({ surPayer }: ProprietesBoutonPaiement) => {
  const [etat, setEtat] = useState<'initial' | 'chargement' | 'succes'>('initial');
  
  const largeurBouton = useSharedValue(width * 0.8);
  const coinsBurst = useSharedValue(0);

  const lancerPaiement = async () => {
    setEtat('chargement');
    largeurBouton.value = withTiming(60, { duration: 300 }); // Mode circulaire

    const succes = await surPayer();
    
    if (succes) {
      setEtat('succes');
      largeurBouton.value = withSequence(
        withTiming(65, { duration: 100 }), // Petite pulsation
        withTiming(60, { duration: 100 }, () => {
           runOnJS(setEtat)('succes');
        })
      );
      // Simuler l'explosion Lottie avec Confetti Cannon orienté pièces d'or
      setTimeout(() => {
        coinsBurst.value = 1; // Trigger visuel
      }, 200);
    } else {
      setEtat('initial');
      largeurBouton.value = withTiming(width * 0.8, { duration: 300 });
    }
  };

  const styleAnime = useAnimatedStyle(() => ({
    width: largeurBouton.value,
  }));

  return (
    <>
      <Animated.View style={[styles.conteneur, styleAnime]}>
        <TouchableOpacity 
          style={[styles.bouton, etat === 'succes' && styles.boutonSucces]} 
          onPress={lancerPaiement}
          disabled={etat !== 'initial'}
          activeOpacity={0.8}
        >
          {etat === 'initial' && <Text style={styles.texte}>Régler mon amende (Apple/GPay)</Text>}
          {etat === 'chargement' && <Ionicons name="sync" size={24} color="white" style={styles.iconeTourne} />}
          {etat === 'succes' && <Ionicons name="checkmark" size={30} color="white" />}
        </TouchableOpacity>
      </Animated.View>

      {/* Explosion de confettis "Pièces d'or" au succès */}
      {etat === 'succes' && (
        <ConfettiCannon
          count={100}
          origin={{ x: width / 2, y: 0 }}
          colors={['#F59E0B', '#FBBF24', '#D97706', '#FFFFFF']} // Teintes d'or
          fallSpeed={3000}
          explosionSpeed={500}
          fadeOut={true}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    height: 60,
    alignSelf: 'center',
    marginVertical: 20,
  },
  bouton: {
    flex: 1,
    backgroundColor: couleurs.attention,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: couleurs.attention,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  boutonSucces: {
    backgroundColor: couleurs.succes,
    shadowColor: couleurs.succes,
  },
  texte: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconeTourne: {
    // Note: Dans une vraie appli on lierait avec useSharedValue pour faire une rotation infinie
    // Ici l'icône indique l'état.
  }
});
