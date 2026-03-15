import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useDesignSystem } from '../../hooks/useDesignSystem';

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
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

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
  }, [estFocus, erreur, couleurs]);

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

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneurGlobal: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: fs(14),
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
    backgroundColor: couleurs.carteArrierePlan,
    borderWidth: 1.5,
    borderRadius: 12,
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
    fontSize: fs(16),
    paddingVertical: 14,
    paddingLeft: 16, 
  },
  texteErreur: {
    color: couleurs.erreur,
    fontSize: fs(12),
    marginTop: 6,
  },
});
