import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { Badge } from '../../store/magasin_statistiques';

interface ProprietesCarteBadge {
  badge: Badge;
}

export const CarteBadge = ({ badge }: ProprietesCarteBadge) => {
  const rotationX = useSharedValue(0);
  const rotationY = useSharedValue(0);

  const style3D = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotationX.value}deg` },
        { rotateY: `${rotationY.value}deg` },
      ],
      opacity: badge.estDebloque ? 1 : 0.4,
      backgroundColor: badge.estDebloque ? couleurs.carteArrierePlan : 'rgba(255, 255, 255, 0.05)',
    };
  });

  const styleReflet = useAnimatedStyle(() => {
    const translateX = interpolate(rotationY.value, [-15, 15], [-50, 50]);
    return {
      transform: [{ translateX }],
      opacity: badge.estDebloque ? 0.3 : 0,
    };
  });

  const surToucher = () => {
    rotationX.value = withSpring(0);
    rotationY.value = withSpring(0);
  };

  const surAppui = () => {
    // Petit effet de bascule aléatoire au clic
    rotationX.value = withSpring((Math.random() - 0.5) * 30);
    rotationY.value = withSpring((Math.random() - 0.5) * 30);
    setTimeout(surToucher, 500);
  };

  return (
    <TouchableOpacity onPress={surAppui} activeOpacity={0.9}>
      <Animated.View style={[styles.carte, style3D]}>
        {/* Reflet brillant dynamique */}
        <Animated.View style={[styles.reflet, styleReflet]} />
        
        <View style={[styles.iconeConteneur, badge.estDebloque && styles.iconeDebloque]}>
          <Ionicons 
            name={badge.icone as any} 
            size={32} 
            color={badge.estDebloque ? couleurs.accentDoré : couleurs.texteSecondaire} 
          />
        </View>
        
        <Text style={styles.titre}>{badge.titre}</Text>
        
        {!badge.estDebloque && (
          <Ionicons name="lock-closed" size={14} color={couleurs.texteSecondaire} style={styles.cadenas} />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  carte: {
    width: 100,
    height: 120,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  reflet: {
    position: 'absolute',
    top: -50,
    left: -20,
    width: 40,
    height: 200,
    backgroundColor: 'white',
    transform: [{ rotate: '25deg' }],
  },
  iconeConteneur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconeDebloque: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  titre: {
    color: couleurs.textePrincipal,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cadenas: {
    position: 'absolute',
    top: 8,
    right: 8,
  }
});
