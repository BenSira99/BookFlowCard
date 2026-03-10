import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { couleurs } from '../../theme/couleurs';

interface ProprietesBouton {
  titre: string;
  surClic: () => void;
  estChargeant?: boolean;
  type?: 'primaire' | 'secondaire' | 'danger';
}

export const Bouton = ({ titre, surClic, estChargeant = false, type = 'primaire' }: ProprietesBouton) => {
  const obtenirStyleFond = () => {
    switch (type) {
      case 'secondaire': return styles.fondSecondaire;
      case 'danger': return styles.fondDanger;
      case 'primaire': default: return styles.fondPrimaire;
    }
  };

  const obtenirStyleTexte = () => {
    switch (type) {
      case 'secondaire': return styles.texteSecondaire;
      case 'danger': return styles.texteDanger;
      case 'primaire': default: return styles.textePrimaire;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.bouton, obtenirStyleFond()]} 
      onPress={surClic} 
      disabled={estChargeant}
      activeOpacity={0.8}
    >
      {estChargeant ? (
        <ActivityIndicator color={type === 'primaire' ? couleurs.textePrincipal : couleurs.primaire} />
      ) : (
        <Text style={[styles.texte, obtenirStyleTexte()]}>{titre}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bouton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12, // Bordures arrondies Premium
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 8,
    // Ombre subtile pour l'effet premium
    shadowColor: couleurs.primaireFonce,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fondPrimaire: {
    backgroundColor: couleurs.primaire,
  },
  fondSecondaire: {
    backgroundColor: couleurs.carteArrierePlan,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    shadowOpacity: 0,
    elevation: 0,
  },
  fondDanger: {
    backgroundColor: couleurs.erreur,
  },
  texte: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textePrimaire: {
    color: couleurs.textePrincipal,
  },
  texteSecondaire: {
    color: couleurs.textePrincipal,
  },
  texteDanger: {
    color: couleurs.textePrincipal,
  },
});
