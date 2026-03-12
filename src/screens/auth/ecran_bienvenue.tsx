import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { couleurs } from '../../theme/couleurs';
import { Bouton } from '../../components/common/bouton';

export default function EcranBienvenue({ navigation }: any) {
  return (
    <SafeAreaView style={styles.conteneur}>
      <View style={styles.entete}>
        <Text style={styles.titre}>BookFlow Card</Text>
        <Text style={styles.sousTitre}>
          Votre carte de bibliothèque numérique, sécurisée.
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
    </SafeAreaView>
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
