import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  interpolate,
  FadeIn,
  ZoomIn
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';

interface ProprietesJauge {
  enCours: boolean;
  termine: boolean;
}

export const JaugeNettoyageCache = ({ enCours, termine }: ProprietesJauge) => {
  const progression = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);

  React.useEffect(() => {
    if (enCours) {
      progression.value = withTiming(1, { duration: 2000 });
      shimmerPosition.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        false
      );
    } else if (!enCours && !termine) {
      progression.value = 0;
    }
  }, [enCours]);

  const styleBarre = useAnimatedStyle(() => ({
    width: `${progression.value * 100}%`,
  }));

  const styleShimmer = useAnimatedStyle(() => ({
    left: `${shimmerPosition.value * 100}%`,
  }));

  return (
    <View style={styles.conteneur}>
      <View style={styles.fondBarre}>
        <Animated.View style={[styles.barreProgression, styleBarre]}>
          <Animated.View style={[styles.shimmer, styleShimmer]} />
        </Animated.View>
      </View>
      
      {termine && (
        <Animated.View entering={ZoomIn.springify()} style={styles.conteneurCheck}>
          <Ionicons name="checkmark-circle" size={24} color={couleurs.succes} />
          <Text style={styles.texteTermine}>Cache vidé !</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginTop: 10,
    width: '100%',
  },
  fondBarre: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barreProgression: {
    height: '100%',
    backgroundColor: couleurs.primaire,
    borderRadius: 3,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  conteneurCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  texteTermine: {
    color: couleurs.succes,
    fontSize: 14,
    fontWeight: '600',
  }
});
