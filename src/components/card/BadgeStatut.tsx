import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesBadgeStatut {
  estActif: boolean;
}

/**
 * Badge de statut animé.
 * Animation : Pulsation (breathing) verte pour "Actif", shimmer pour les autres.
 */
export const BadgeStatut = ({ estActif }: ProprietesBadgeStatut) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (estActif) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [estActif]);

  const styleCercleAnime = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
      opacity: interpolate(pulse.value, [1, 1.2], [0.8, 0.3]),
    };
  });

  return (
    <View style={styles.conteneur}>
      <View style={styles.badge}>
        {estActif && (
          <Animated.View style={[styles.pulseCercle, styleCercleAnime]} />
        )}
        <View style={[styles.point, { backgroundColor: estActif ? couleurs.succes : couleurs.attention }]} />
        <Text style={styles.texte}>{estActif ? 'ACTIF' : 'EXPIRÉ'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pulseCercle: {
    position: 'absolute',
    left: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: couleurs.succes,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  texte: {
    color: couleurs.textePrincipal,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
