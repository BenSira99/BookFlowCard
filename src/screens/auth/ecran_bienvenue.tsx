import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { couleurs } from '../../theme/couleurs';
import { Bouton } from '../../components/common/bouton';

export default function EcranBienvenue({ navigation }: any) {
  return (
    <View style={styles.conteneur}>
      <View style={styles.entete}>
        <Text style={styles.titre}>BiblioCard</Text>
        <Text style={styles.sousTitre}>
          Votre bibliothèque numérique, sécurisée et hors ligne.
        </Text>
      </View>
      
      <View style={styles.actions}>
        <Bouton 
          titre="Se Connecter" 
          surClic={() => navigation.navigate('Connexion')} 
        />
        <Bouton 
          titre="Activer une Carte" 
          surClic={() => navigation.navigate('Activation')} 
          type="secondaire" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: couleurs.arrierePlan,
    padding: 24,
  },
  entete: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    width: '100%',
    paddingBottom: 40,
  },
  titre: {
    fontSize: 42,
    fontWeight: 'bold',
    color: couleurs.primaire,
    marginBottom: 10,
  },
  sousTitre: {
    fontSize: 16,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
