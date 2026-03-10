import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  withTiming, 
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProprietesAnneauProgres {
  progres: number; // 0 à 1
  taille: number;
}

/**
 * Anneau de progression pour l'upload de photo.
 */
export const AnneauProgres = ({ progres, taille }: ProprietesAnneauProgres) => {
  const rayon = (taille - 10) / 2;
  const circonference = 2 * Math.PI * rayon;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(circonference * (1 - progres), { duration: 300 }),
    };
  });

  return (
    <View style={[styles.conteneur, { width: taille, height: taille }]}>
      <Svg width={taille} height={taille}>
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
          fill="transparent"
        />
        <AnimatedCircle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleurs.primaire}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circonference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${taille / 2}, ${taille / 2}`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
