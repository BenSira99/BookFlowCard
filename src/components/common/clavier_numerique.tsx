import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../../hooks/useDesignSystem';

interface ProprietesClavier {
  surTouche: (chiffre: string) => void;
  surEffacer: () => void;
  surValider?: () => void;
  afficherValider?: boolean;
}

export const ClavierNumerique = ({ surTouche, surEffacer, surValider, afficherValider = false }: ProprietesClavier) => {
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

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

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneur: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  toucheChiffre: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: couleurs.carteArrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: couleurs.primaireFonce,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  texteChiffre: {
    fontSize: fs(24),
    fontWeight: '500',
    color: couleurs.textePrincipal,
  },
  toucheAction: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toucheVide: {
    width: 64,
    height: 64,
  }
});
