import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesOdometre {
  valeur: number;
  taillePolice?: number;
  couleur?: string;
}

const ChiffreOdometre = ({ chiffre, taillePolice, couleur }: { chiffre: string, taillePolice: number, couleur: string }) => {
  const vY = useSharedValue(0);
  const position = parseInt(chiffre) || 0;

  useEffect(() => {
    vY.value = withTiming(-position * taillePolice, { 
      duration: 1000 + Math.random() * 1000, 
      easing: Easing.out(Easing.back(1.5)) 
    });
  }, [chiffre]);

  const styleAnime = useAnimatedStyle(() => ({
    transform: [{ translateY: vY.value }]
  }));

  return (
    <View style={{ height: taillePolice, overflow: 'hidden', width: taillePolice * 0.6 }}>
      <Animated.View style={styleAnime}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Text key={n} style={[styles.chiffre, { fontSize: taillePolice, color: couleur, height: taillePolice }]}>
            {n}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

export const CompteurOdometre = ({ valeur, taillePolice = 32, couleur = couleurs.textePrincipal }: ProprietesOdometre) => {
  const chiffres = valeur.toString().split('');

  return (
    <View style={styles.conteneur}>
      {chiffres.map((c, i) => (
        <ChiffreOdometre key={i} chiffre={c} taillePolice={taillePolice} couleur={couleur} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chiffre: {
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  }
});
