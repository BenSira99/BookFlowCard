import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withDelay,
  FadeIn
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

export const SeparateurAnime = () => {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, []);

  const styleLigne = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.conteneur}>
      <Animated.View style={[styles.ligne, styleLigne]} />
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 15,
    overflow: 'hidden',
  },
  ligne: {
    height: '100%',
    backgroundColor: couleurs.primaire,
    opacity: 0.5,
  }
});
