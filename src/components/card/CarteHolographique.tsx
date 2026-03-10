import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARTE_LARGEUR = width * 0.9;
const CARTE_HAUTEUR = 200;

interface ProprietesCarteHolographique {
  children: React.ReactNode;
}

/**
 * Composant de carte avec effet Holographique réagissant au gyroscope.
 * Animations : Effet de reflet, inclinaison 3D, bords lumineux.
 */
export const CarteHolographique = ({ children }: ProprietesCarteHolographique) => {
  const [estDisponible, setEstDisponible] = useState(false);
  
  // Valeurs du gyroscope
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    Gyroscope.isAvailableAsync().then(setEstDisponible);
    
    if (estDisponible) {
      Gyroscope.setUpdateInterval(16); // ~60fps
      const abonnement = Gyroscope.addListener(donnees => {
        // Accumulation douce pour éviter les saccades
        x.value = withSpring(donnees.x * 0.1, { damping: 20 });
        y.value = withSpring(donnees.y * 0.1, { damping: 20 });
      });
      return () => abonnement.remove();
    }
  }, [estDisponible]);

  // Style pour l'inclinaison 3D
  const styleCarteAnime = useAnimatedStyle(() => {
    const rotationX = interpolate(y.value, [-1, 1], [15, -15]);
    const rotationY = interpolate(x.value, [-1, 1], [-15, 15]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotationX}deg` },
        { rotateY: `${rotationY}deg` },
      ],
    };
  });

  // Style pour le reflet holographique (Glassmorphism effect)
  const styleRefletAnime = useAnimatedStyle(() => {
    const deplacementX = interpolate(x.value, [-1, 1], [-CARTE_LARGEUR, CARTE_LARGEUR]);
    
    return {
      transform: [{ translateX: deplacementX }],
    };
  });

  return (
    <Animated.View style={[styles.conteneurCarte, styleCarteAnime]}>
      <LinearGradient
        colors={[couleurs.primaireFonce, '#065f46', '#020617']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientFond}
      >
        {/* Bordures lumineuses Teal */}
        <View style={styles.borduresLumineuses} />
        
        {/* Contenu de la carte */}
        <View style={styles.contenu}>
          {children}
        </View>

        {/* Reflet Holographique dynamique */}
        <Animated.View style={[styles.refletConteneur, styleRefletAnime]}>
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.08)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reflet}
          />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  conteneurCarte: {
    width: CARTE_LARGEUR,
    height: CARTE_HAUTEUR,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    // Ombre portée animée
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientFond: {
    flex: 1,
  },
  borduresLumineuses: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: couleurs.primaireClair,
    borderRadius: 20,
    opacity: 0.5,
  },
  contenu: {
    flex: 1,
    padding: 20,
    zIndex: 2,
  },
  refletConteneur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  reflet: {
    width: '150%',
    height: '100%',
    opacity: 0.6,
  },
});
