import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path, Circle, Defs, ClipPath } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolateColor,
  useDerivedValue
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ProprietesJaugeKarma {
  score: number; // 0 à 100
  taille: number;
}

/**
 * Jauge Karma liquide.
 * Utilise SVG et Reanimated pour créer un effet de vague fluide (Wave) 
 * dont la hauteur correspond au score de Karma, et la couleur passe du rouge au vert.
 */
export const JaugeKarmaLiquide = ({ score, taille }: ProprietesJaugeKarma) => {
  const vagueOffset = useSharedValue(0);
  const scoreAnime = useSharedValue(0);

  useEffect(() => {
    // Animation continue de la vague (Translation horizontale)
    vagueOffset.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    // Animation d'entrée de la hauteur de la vague
    scoreAnime.value = withTiming(score, { duration: 1500, easing: Easing.out(Easing.exp) });
  }, [score]);

  // Interpolation de la couleur : <30 Rouge, 30-70 Orange, >70 Teal/Vert
  const couleurVague = useDerivedValue(() => {
    return interpolateColor(
      scoreAnime.value,
      [0, 50, 100],
      [couleurs.erreur, couleurs.attention, couleurs.succes]
    );
  });

  const animatedProps = useAnimatedProps(() => {
    // La hauteur de la vague dépend du score (0 = bas, 100 = haut)
    const hauteur = taille - (scoreAnime.value / 100) * taille;
    // La translation horizontale donne l'effet de mouvement
    const deltaX = vagueOffset.value * taille;
    
    // Chemin SVG générant deux arches sinusoides répétées pour le défilement
    const d = `
      M ${-taille + deltaX} ${hauteur}
      Q ${-taille * 0.75 + deltaX} ${hauteur - 15} ${-taille * 0.5 + deltaX} ${hauteur}
      T ${0 + deltaX} ${hauteur}
      T ${taille * 0.5 + deltaX} ${hauteur}
      T ${taille + deltaX} ${hauteur}
      T ${taille * 1.5 + deltaX} ${hauteur}
      V ${taille} 
      H ${-taille} 
      Z
    `;

    return {
      d,
      fill: couleurVague.value,
    };
  });

  return (
    <View style={[styles.conteneur, { width: taille, height: taille, borderRadius: taille / 2 }]}>
      <Svg width={taille} height={taille}>
        <Defs>
           <ClipPath id="cercle">
             <Circle cx={taille / 2} cy={taille / 2} r={taille / 2} />
           </ClipPath>
        </Defs>
        {/* Fond sombre */}
        <Circle cx={taille / 2} cy={taille / 2} r={taille / 2} fill={couleurs.carteArrierePlan} />
        
        {/* Vague animée clippée dans le cercle */}
        <AnimatedPath animatedProps={animatedProps} clipPath="url(#cercle)" opacity={0.8} />
      </Svg>
      
      {/* Texte superposé */}
      <View style={[StyleSheet.absoluteFillObject, styles.texteConteneur]}>
        <Text style={styles.texteScore}>{score}</Text>
        <Text style={styles.texteLabel}>KARMA</Text>
      </View>
      
      {/* Bordure externe (glassmorphism touch) */}
      <View style={[styles.bordureExterne, { borderRadius: taille / 2 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#020617',
    elevation: 10,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  texteConteneur: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteScore: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  texteLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -5,
  },
  bordureExterne: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  }
});
