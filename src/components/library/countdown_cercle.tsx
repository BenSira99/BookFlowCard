import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  withTiming, 
  useSharedValue,
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProprietesCountdownCercle {
  joursRestants: number;
  estEnRetard: boolean;
  taille?: number;
}

/**
 * Anneau circulaire affichant le nombre de jours restants.
 * Couleur dynamique : Teal (>3j) -> Orange (<=3j) -> Rouge (Retard).
 */
export const CountdownCercle = ({ joursRestants, estEnRetard, taille = 40 }: ProprietesCountdownCercle) => {
  const progres = useSharedValue(0);
  const rayon = (taille - 4) / 2;
  const circonference = 2 * Math.PI * rayon;

  // Déterminer la couleur
  let couleurAnneau = couleurs.primaire;
  if (estEnRetard) couleurAnneau = couleurs.erreur;
  else if (joursRestants <= 3) couleurAnneau = couleurs.attention;

  // Calculer le ratio d'emplissage (ex: on considère max 14 jours pour faire un tour complet)
  const ratio = estEnRetard ? 1 : Math.min(1, Math.max(0, joursRestants / 14));

  useEffect(() => {
    progres.value = withTiming(ratio, { duration: 1000 });
  }, [ratio]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circonference * (1 - progres.value),
    };
  });

  return (
    <View style={[styles.conteneur, { width: taille, height: taille }]}>
      <Svg width={taille} height={taille}>
        {/* Cercle de fond */}
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          fill="transparent"
        />
        {/* Cercle animé dynamique */}
        <AnimatedCircle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleurAnneau}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circonference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${taille / 2}, ${taille / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject} style={styles.conteneurTexte}>
        <Text style={[styles.texte, { color: couleurAnneau }]}>
          {estEnRetard ? '!!' : joursRestants}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteneurTexte: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texte: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});
