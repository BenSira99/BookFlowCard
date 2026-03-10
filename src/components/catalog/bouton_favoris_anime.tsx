import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  FadeOut,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';

interface ProprietesFavori {
  estFavori: boolean;
  onPress: () => void;
  taille?: number;
}

const ParticuleCoeur = ({ delay }: { delay: number }) => {
  const opacite = useSharedValue(0);
  const vY = useSharedValue(0);
  const vX = useSharedValue(0);

  useEffect(() => {
    vY.value = withTiming(-40 - Math.random() * 40, { duration: 800 });
    vX.value = withTiming((Math.random() - 0.5) * 50, { duration: 800 });
    opacite.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 600 })
    );
  }, []);

  const styleParticule = useAnimatedStyle(() => ({
    opacity: opacite.value,
    transform: [{ translateY: vY.value }, { translateX: vX.value }, { scale: opacite.value }],
    position: 'absolute',
  }));

  return (
    <Animated.View style={styleParticule}>
      <Ionicons name="heart" size={8} color={couleurs.erreur} />
    </Animated.View>
  );
};

export const BoutonFavorisAnime = ({ estFavori, onPress, taille = 24 }: ProprietesFavori) => {
  const scale = useSharedValue(1);
  const [afficherParticules, setAfficherParticules] = React.useState(false);

  const styleCœur = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gererAppui = () => {
    scale.value = withSequence(
      withSpring(1.5, { damping: 10 }),
      withSpring(1)
    );
    if (!estFavori) {
      setAfficherParticules(true);
      setTimeout(() => setAfficherParticules(false), 800);
    }
    onPress();
  };

  return (
    <TouchableOpacity onPress={gererAppui} activeOpacity={0.7} style={styles.conteneur}>
      {afficherParticules && (
        <View style={styles.particulesWrapper}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ParticuleCoeur key={i} delay={i * 50} />
          ))}
        </View>
      )}
      <Animated.View style={styleCœur}>
        <Ionicons 
          name={estFavori ? "heart" : "heart-outline"} 
          size={taille} 
          color={estFavori ? couleurs.erreur : "white"} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  particulesWrapper: {
    position: 'absolute',
    width: 1,
    height: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
