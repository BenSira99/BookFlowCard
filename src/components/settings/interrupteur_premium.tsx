import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesInterrupteur {
  actif: boolean;
  onPress: () => void;
}

export const InterrupteurPremium = ({ actif, onPress }: ProprietesInterrupteur) => {
  const position = useSharedValue(actif ? 1 : 0);

  React.useEffect(() => {
    position.value = withSpring(actif ? 1 : 0, { damping: 15, stiffness: 120 });
  }, [actif]);

  const styleTrack = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      position.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.1)', couleurs.primaire + '40'] // 40 est l'alpha en hex
    ),
    borderColor: interpolateColor(
      position.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.1)', couleurs.primaire]
    )
  }));

  const styleThumb = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * 24 }],
    backgroundColor: interpolateColor(
      position.value,
      [0, 1],
      ['#A0AEC0', 'white']
    ),
    shadowOpacity: withTiming(actif ? 0.8 : 0),
  }));

  const styleTrail = useAnimatedStyle(() => ({
    width: position.value * 24,
    opacity: position.value,
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View style={[styles.track, styleTrack]}>
        <Animated.View style={[styles.trail, styleTrail]} />
        <Animated.View style={[styles.thumb, styleThumb]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 26,
    borderRadius: 13,
    padding: 2,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 5,
  },
  trail: {
    position: 'absolute',
    left: 2,
    height: 20,
    backgroundColor: couleurs.primaire,
    borderRadius: 10,
    opacity: 0.5,
  }
});
