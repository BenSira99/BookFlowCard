import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';

interface ProprietesClavier {
  surTouche: (chiffre: string) => void;
  surEffacer: () => void;
  surValider?: () => void;
  afficherValider?: boolean;
}

export const ClavierNumerique = ({ surTouche, surEffacer, surValider, afficherValider = false }: ProprietesClavier) => {
  const touches = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['vide', '0', 'effacer']
  ];

  return (
    <View style={styles.conteneur}>
      {touches.map((ligne, indexLigne) => (
        <View key={`ligne-${indexLigne}`} style={styles.ligne}>
          {ligne.map((touche) => {
            if (touche === 'vide') {
              if (afficherValider && surValider) {
                return (
                  <TouchableOpacity key="valider" style={styles.toucheAction} onPress={surValider}>
                    <Ionicons name="checkmark" size={28} color={couleurs.succes} />
                  </TouchableOpacity>
                );
              }
              return <View key="vide" style={styles.toucheVide} />;
            }
            if (touche === 'effacer') {
              return (
                <TouchableOpacity key="effacer" style={styles.toucheAction} onPress={surEffacer}>
                  <Ionicons name="backspace-outline" size={28} color={couleurs.attention} />
                </TouchableOpacity>
              );
            }
            
            return (
              <TouchableOpacity 
                key={touche} 
                style={styles.toucheChiffre} 
                onPress={() => surTouche(touche)}
                activeOpacity={0.6}
              >
                <Text style={styles.texteChiffre}>{touche}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    paddingVertical: 20,
  },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toucheChiffre: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: couleurs.carteArrierePlan, // Navy Medium
    justifyContent: 'center',
    alignItems: 'center',
    // Ombre premium (glow subtle)
    shadowColor: couleurs.primaireFonce,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  texteChiffre: {
    fontSize: 28,
    fontWeight: '500',
    color: couleurs.textePrincipal,
  },
  toucheAction: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toucheVide: {
    width: 76,
    height: 76,
  }
});
