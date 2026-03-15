import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { Bouton } from '../../components/common/bouton';

export default function EcranBienvenue({ navigation }: any) {
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

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

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
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
    fontSize: fs(42),
    fontWeight: 'bold',
    color: couleurs.primaire,
    marginBottom: 10,
  },
  sousTitre: {
    fontSize: fs(16),
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
