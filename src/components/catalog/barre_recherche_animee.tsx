import React, { useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolateColor,
  useDerivedValue
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesBarreRecherche {
  valeur: string;
  onChange: (texte: string) => void;
  onScanPress?: () => void;
}

export const BarreRechercheAnimee = ({ valeur, onChange, onScanPress }: ProprietesBarreRecherche) => {
  const estFocus = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);

  const styleConteneur = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      estFocus.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.05)', couleurs.primaire]
    );
    const scale = withSpring(estFocus.value ? 1.02 : 1);
    
    return {
      borderColor,
      transform: [{ scale }],
      shadowOpacity: withTiming(estFocus.value ? 0.3 : 0),
    };
  });

  const styleGlow = useAnimatedStyle(() => ({
    opacity: withTiming(estFocus.value ? 0.15 : 0),
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.glow, styleGlow]} />
      <Animated.View style={[styles.conteneur, styleConteneur]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={valeur || estFocus.value ? couleurs.primaire : couleurs.texteSecondaire} 
          style={styles.icone}
        />
        
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Chercher un titre, auteur, ISBN..."
          placeholderTextColor={couleurs.texteSecondaire}
          value={valeur}
          onChangeText={onChange}
          onFocus={() => (estFocus.value = withTiming(1))}
          onBlur={() => (estFocus.value = withTiming(0))}
          selectionColor={couleurs.primaire}
        />

        {valeur.length > 0 ? (
          <TouchableOpacity onPress={() => onChange('')}>
            <Ionicons name="close-circle" size={20} color={couleurs.texteSecondaire} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onScanPress} style={styles.boutonScanner}>
            <Ionicons name="scan" size={22} color={couleurs.primaire} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  glow: {
    position: 'absolute',
    top: 5,
    left: 10,
    right: 10,
    bottom: 5,
    backgroundColor: couleurs.primaire,
    borderRadius: 15,
  },
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  icone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  boutonScanner: {
    paddingLeft: 10,
  }
});
