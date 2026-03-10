import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProprietesTimerQr {
  periode: number;
  tempsRestant: number;
  taille: number;
}

/**
 * Timer circulaire entourant le QR Code.
 * Animation fluide de décompte avant rotation.
 */
export const TimerQr = ({ periode, tempsRestant, taille }: ProprietesTimerQr) => {
  const progress = useSharedValue(1);
  const rayon = (taille - 10) / 2;
  const circonference = 2 * Math.PI * rayon;

  useEffect(() => {
    const ratio = tempsRestant / periode;
    progress.value = withTiming(ratio, { 
      duration: 1000, 
      easing: Easing.linear 
    });
  }, [tempsRestant]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circonference * (1 - progress.value),
    };
  });

  return (
    <View style={[styles.conteneur, { width: taille, height: taille }]}>
      <Svg width={taille} height={taille}>
        {/* Cercle de fond (gris sombre) */}
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleurs.bordure}
          strokeWidth="3"
          fill="transparent"
          opacity={0.3}
        />
        {/* Cercle animé (Teal) */}
        <AnimatedCircle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleurs.primaire}
          strokeWidth="3"
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
