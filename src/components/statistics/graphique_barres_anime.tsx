import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { DonneeMensuelle } from '../../store/magasin_statistiques';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface ProprietesBarChart {
  donnees: DonneeMensuelle[];
  hauteur?: number;
}

export const GraphiqueBarresAnime = ({ donnees, hauteur = 200 }: ProprietesBarChart) => {
  const progres = useSharedValue(0);
  const padding = 20;
  const largeurGraphe = 300; // Ajusté dynamiquement normalement
  const maxValeur = Math.max(...donnees.map(d => d.quantite)) + 2;
  const largeurBarre = (largeurGraphe - padding * 2) / donnees.length - 10;

  useEffect(() => {
    progres.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.exp) });
  }, []);

  return (
    <View style={styles.conteneur}>
      <Svg width={largeurGraphe} height={hauteur}>
        <G translate={`${padding}, 0`}>
          {donnees.map((d, i) => {
            const x = i * (largeurBarre + 10);
            const hCible = (d.quantite / maxValeur) * (hauteur - 40);
            
            const animatedProps = useAnimatedProps(() => {
              const h = hCible * progres.value;
              return {
                height: h,
                y: hauteur - 30 - h,
              };
            });

            return (
              <G key={d.mois}>
                <AnimatedRect
                  x={x}
                  width={largeurBarre}
                  rx={largeurBarre / 2}
                  fill={couleurs.primaire}
                  opacity={0.8}
                  animatedProps={animatedProps}
                />
                <SvgText
                  x={x + largeurBarre / 2}
                  y={hauteur - 10}
                  fill={couleurs.texteSecondaire}
                  fontSize="12"
                  textAnchor="middle"
                >
                  {d.mois}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
  }
});
