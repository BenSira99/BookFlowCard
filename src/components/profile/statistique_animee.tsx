import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  Easing,
  useDerivedValue
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesStatistique {
  label: string;
  valeurCible: number;
  suffixe?: string;
  delai?: number;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

/**
 * Composant de statistique avec compteur animé.
 * Animation : Incrémentation fluide de 0 à la valeur réelle.
 */
export const StatistiqueAnimee = ({ label, valeurCible, suffixe = '', delai = 0 }: ProprietesStatistique) => {
  const progression = useSharedValue(0);

  useEffect(() => {
    progression.value = 0;
    const timeout = setTimeout(() => {
      progression.value = withTiming(valeurCible, {
        duration: 2000,
        easing: Easing.out(Easing.exp),
      });
    }, delai);
    return () => clearTimeout(timeout);
  }, [valeurCible, delai]);

  const texteAnime = useDerivedValue(() => {
    return `${Math.floor(progression.value)}${suffixe}`;
  });

  return (
    <View style={styles.conteneur}>
      <Animated.Text style={styles.valeur}>
        {texteAnime.value}
      </Animated.Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  valeur: {
    fontSize: 24,
    fontWeight: '800',
    color: couleurs.primaire,
  },
  label: {
    fontSize: 12,
    color: couleurs.texteSecondaire,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
