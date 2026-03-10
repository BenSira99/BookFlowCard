import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs } from '../../theme/couleurs';

interface ProprietesPhotoMembre {
  uri?: string;
  taille: number;
}

/**
 * Photo de membre avec bordure rotative animée.
 * Animation : Gradient Teal tournant lentement comme un anneau lumineux.
 */
export const PhotoMembre = ({ uri, taille }: ProprietesPhotoMembre) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const styleBordureAnime = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.conteneur, { width: taille, height: taille }]}>
      {/* Anneau lumineux rotatif */}
      <Animated.View style={[styles.anneauConteneur, styleBordureAnime]}>
        <LinearGradient
          colors={[couleurs.primaire, 'transparent', couleurs.accentDoré]}
          style={styles.anneau}
        />
      </Animated.View>

      {/* Container photo avec masque */}
      <View style={[styles.masquePhoto, { width: taille - 6, height: taille - 6, borderRadius: (taille - 6) / 2 }]}>
        {uri ? (
          <Image source={{ uri }} style={styles.img} />
        ) : (
          <View style={styles.placeholder}>
             {/* Icône par défaut si pas de photo */}
             <View style={styles.cercleInterne} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  anneauConteneur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    overflow: 'hidden',
  },
  anneau: {
    flex: 1,
  },
  masquePhoto: {
    backgroundColor: '#020617',
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#020617',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: couleurs.carteArrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cercleInterne: {
    width: '60%',
    height: '60%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
});
