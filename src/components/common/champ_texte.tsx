import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import Animated, { useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

interface ProprietesChampTexte {
  label: string;
  valeur: string;
  onChangeText: (texte: string) => void;
  erreur?: string;
  estMotDePasse?: boolean;
  icone?: keyof typeof Ionicons.glyphMap;
  placeholder?: string;
}

export const ChampTexte = ({
  label,
  valeur,
  onChangeText,
  erreur,
  estMotDePasse = false,
  icone,
  placeholder,
}: ProprietesChampTexte) => {
  const [estFocus, setEstFocus] = useState(false);
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(!estMotDePasse);

  // Animation de la bordure Focus/Blur/Erreur
  const styleBordureAnime = useAnimatedStyle(() => {
    const couleurBordure = erreur
      ? couleurs.erreur
      : estFocus
      ? couleurs.primaire
      : couleurs.bordure;
      
    // withTiming pour une transition fluide de la couleur
    return {
      borderColor: withTiming(couleurBordure, { duration: 250 }),
    };
  }, [estFocus, erreur]);

  return (
    <View style={styles.conteneurGlobal}>
      <Text style={[styles.label, erreur ? styles.labelErreur : null]}>
        {label}
      </Text>
      
      <Animated.View style={[styles.conteneurInput, styleBordureAnime]}>
        {icone && (
          <Ionicons 
            name={icone} 
            size={20} 
            color={erreur ? couleurs.erreur : (estFocus ? couleurs.primaire : couleurs.texteSecondaire)} 
            style={styles.iconeGauche} 
          />
        )}
        
        <TextInput
          style={styles.input}
          value={valeur}
          onChangeText={onChangeText}
          secureTextEntry={!afficherMotDePasse}
          onFocus={() => setEstFocus(true)}
          onBlur={() => setEstFocus(false)}
          placeholder={placeholder}
          placeholderTextColor={couleurs.texteSecondaire}
          selectionColor={couleurs.primaireClair}
        />
        
        {estMotDePasse && (
          <TouchableOpacity 
            onPress={() => setAfficherMotDePasse(!afficherMotDePasse)}
            style={styles.iconeDroite}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={afficherMotDePasse ? "eye-off" : "eye"} 
              size={20} 
              color={couleurs.texteSecondaire} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {erreur && <Text style={styles.texteErreur}>{erreur}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneurGlobal: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: couleurs.textePrincipal,
    marginBottom: 8,
    fontWeight: '500',
  },
  labelErreur: {
    color: couleurs.erreur,
  },
  conteneurInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: couleurs.carteArrierePlan, // Navy Card
    borderWidth: 1.5,
    borderRadius: 12, // Coins premium
    minHeight: 56,
  },
  iconeGauche: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  iconeDroite: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: couleurs.textePrincipal,
    fontSize: 16,
    paddingVertical: 14,
    // S'il n'y a pas d'icône à gauche, on met un padding
    paddingLeft: 16, 
  },
  texteErreur: {
    color: couleurs.erreur,
    fontSize: 12,
    marginTop: 6,
  },
});
