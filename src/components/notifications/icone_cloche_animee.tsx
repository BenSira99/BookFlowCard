import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinNotifications } from '../../store/magasin_notifications';

interface ProprietesIconeCloche {
  focused: boolean;
  color: string;
  size: number;
}

export const IconeClocheAnimee = ({ focused, color, size }: ProprietesIconeCloche) => {
  const nbNonLues = utiliserMagasinNotifications((etat) => etat.nbNonLues());
  const vScale = useSharedValue(1);
  const vRotation = useSharedValue(0);

  // Animation au changement de nombre de notifs (Badge bounce)
  useEffect(() => {
    if (nbNonLues > 0) {
      vScale.value = withSequence(
        withSpring(1.4),
        withSpring(1)
      );
      
      // Petit wiggle de la cloche
      vRotation.value = withSequence(
        withTiming(-15, { duration: 50 }),
        withTiming(15, { duration: 100 }),
        withTiming(-15, { duration: 100 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [nbNonLues]);

  const styleBadge = useAnimatedStyle(() => ({
    transform: [{ scale: vScale.value }],
  }));

  const styleCloche = useAnimatedStyle(() => ({
    transform: [{ rotate: `${vRotation.value}deg` }],
  }));

  return (
    <View style={styles.conteneur}>
      <Animated.View style={styleCloche}>
        <Ionicons 
          name={focused ? 'notifications' : 'notifications-outline'} 
          size={size} 
          color={color} 
        />
      </Animated.View>
      
      {nbNonLues > 0 && (
        <Animated.View style={[styles.badge, styleBadge]}>
          <Text style={styles.texteBadge}>{nbNonLues > 9 ? '9+' : nbNonLues}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: couleurs.erreur,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: couleurs.carteArrierePlan,
  },
  texteBadge: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
