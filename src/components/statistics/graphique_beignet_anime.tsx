import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing,
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { CategorieStat } from '../../store/magasin_statistiques';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProprietesDonutChart {
  donnees: CategorieStat[];
  taille?: number;
}

export const GraphiqueBeignetAnime = ({ donnees, taille = 180 }: ProprietesDonutChart) => {
  const progres = useSharedValue(0);
  const rayon = (taille - 30) / 2;
  const circonference = 2 * Math.PI * rayon;

  useEffect(() => {
    progres.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) });
  }, []);

  let cumulativePercentage = 0;

  return (
    <View style={styles.conteneur}>
      <Svg width={taille} height={taille}>
        <G rotation="-90" origin={`${taille / 2}, ${taille / 2}`}>
          {donnees.map((d, i) => {
            const strokeDasharray = `${circonference} ${circonference}`;
            const offset = circonference * (1 - d.pourcentage / 100);
            const rotationOffset = (cumulativePercentage / 100) * 360;
            cumulativePercentage += d.pourcentage;

            const animatedProps = useAnimatedProps(() => {
              return {
                strokeDashoffset: circonference - (circonference * (d.pourcentage / 100) * progres.value),
              };
            });

            return (
              <AnimatedCircle
                key={d.nom}
                cx={taille / 2}
                cy={taille / 2}
                r={rayon}
                stroke={d.couleur}
                strokeWidth="20"
                fill="transparent"
                strokeDasharray={circonference}
                animatedProps={animatedProps}
                rotation={rotationOffset}
                origin={`${taille / 2}, ${taille / 2}`}
                strokeLinecap="round"
              />
            );
          })}
        </G>
        {/* Centre du donut */}
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon - 15}
          fill={couleurs.arrierePlan}
        />
      </Svg>
      
      {/* Légende simplifiée */}
      <View style={styles.legende}>
        {donnees.map(d => (
          <View key={d.nom} style={styles.itemLegende}>
            <View style={[styles.point, { backgroundColor: d.couleur }]} />
            <Text style={styles.texteLegende}>{d.nom}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 15,
    borderRadius: 20,
  },
  legende: {
    marginLeft: 20,
  },
  itemLegende: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  point: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  texteLegende: {
    color: couleurs.texteSecondaire,
    fontSize: 12,
  }
});
