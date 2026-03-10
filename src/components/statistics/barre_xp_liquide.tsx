import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesBarreXP {
  xp: number;
  xpMax: number;
  niveau: string;
}

/**
 * Particule lumineuse flottante.
 */
const ParticuleXP = ({ delai }: { delai: number }) => {
  const vY = useSharedValue(0);
  const vOpacity = useSharedValue(0);

  useEffect(() => {
    vY.value = withRepeat(
      withDelay(delai, withTiming(-40, { duration: 2000, easing: Easing.out(Easing.quad) })),
      -1,
      false
    );
    vOpacity.value = withRepeat(
      withDelay(delai, withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 1500 })
      )),
      -1,
      false
    );
  }, []);

  const styleAnime = useAnimatedStyle(() => ({
    opacity: vOpacity.value,
    transform: [{ translateY: vY.value }, { scale: interpolate(vOpacity.value, [0, 1], [0.5, 1]) }]
  }));

  return (
    <Animated.View style={[styles.particule, styleAnime, { left: Math.random() * 100 + '%' }]} />
  );
};

export const BarreXPLiquide = ({ xp, xpMax, niveau }: ProprietesBarreXP) => {
  const largeur = useSharedValue(0);
  const ratio = Math.min(1, xp / xpMax);

  useEffect(() => {
    largeur.value = withTiming(ratio, { duration: 1500, easing: Easing.out(Easing.exp) });
  }, [xp]);

  const styleBarre = useAnimatedStyle(() => ({
    width: `${largeur.value * 100}%`,
  }));

  return (
    <View style={styles.conteneurGlobal}>
      <View style={styles.entete}>
        <Text style={styles.texteNiveau}>Niveau : <Text style={styles.gras}>{niveau}</Text></Text>
        <Text style={styles.texteXP}>{xp} / {xpMax} XP</Text>
      </View>
      
      <View style={styles.rail}>
        <Animated.View style={[styles.remplissage, styleBarre]}>
          {/* Particules à l'intérieur du liquide */}
          {Array.from({ length: 5 }).map((_, i) => (
            <ParticuleXP key={i} delai={i * 400} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneurGlobal: {
    width: '100%',
    marginVertical: 15,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  texteNiveau: {
    color: couleurs.textePrincipal,
    fontSize: 14,
  },
  gras: {
    fontWeight: 'bold',
    color: couleurs.primaire,
  },
  texteXP: {
    color: couleurs.texteSecondaire,
    fontSize: 12,
  },
  rail: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  remplissage: {
    height: '100%',
    backgroundColor: couleurs.primaire,
    borderRadius: 6,
    flexDirection: 'row', // Pour aligner les particules
  },
  particule: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: 'white',
    shadowRadius: 4,
    shadowOpacity: 1,
  }
});
