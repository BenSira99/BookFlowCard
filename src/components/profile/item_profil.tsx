import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';

interface ProprietesLegendeProfil {
  label: string;
  valeur: string;
  icone: keyof typeof Ionicons.glyphMap;
  modifiable?: boolean;
  surAppui?: () => void;
}

/**
 * Ligne d'information pour le profil.
 */
export const ItemProfil = ({ label, valeur, icone, modifiable = false, surAppui }: ProprietesLegendeProfil) => {
  return (
    <TouchableOpacity 
      style={styles.conteneur} 
      onPress={surAppui} 
      disabled={!modifiable}
      activeOpacity={0.7}
    >
      <View style={styles.groupeGauche}>
        <View style={styles.fondIcone}>
          <Ionicons name={icone} size={20} color={couleurs.primaire} />
        </View>
        <View style={styles.textes}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.valeur}>{valeur}</Text>
        </View>
      </View>
      {modifiable && (
        <Ionicons name="chevron-forward" size={20} color={couleurs.texteSecondaire} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  groupeGauche: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fondIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textes: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: couleurs.texteSecondaire,
    marginBottom: 2,
  },
  valeur: {
    fontSize: 15,
    color: couleurs.textePrincipal,
    fontWeight: '500',
  },
});
