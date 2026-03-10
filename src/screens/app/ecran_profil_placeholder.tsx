import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { Bouton } from '../../components/common/bouton';

export default function EcranProfilPlaceholder() {
  const { deconnecter, utilisateur } = utiliserMagasinAuth();

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>Profil et Paramètres</Text>
      <Text style={styles.texte}>Membre : {utilisateur?.prenom} {utilisateur?.nom}</Text>
      
      <View style={styles.actions}>
        <Bouton titre="Se Déconnecter" surClic={deconnecter} type="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 16,
  },
  texte: {
    color: couleurs.texteSecondaire,
    fontSize: 16,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
  }
});
