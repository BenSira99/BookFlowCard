import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { couleurs } from '../../theme/couleurs';
import { Bouton } from '../../components/common/bouton';
import { ChampTexte } from '../../components/common/champ_texte';

export default function EcranActivation({ navigation }: any) {
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const gererActivation = () => {
    // Validation basique locale
    if (code.length < 8) {
      setErreur('Le code doit contenir au moins 8 caractères.');
      return;
    }
    
    setErreur('');
    setChargement(true);
    
    // Simulation réseau local
    setTimeout(() => {
      setChargement(false);
      // OWASP M4 : Redirection vers création du PIN sans auth persistante encore
      navigation.navigate('CreationCode');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: couleurs.arrierePlan }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteneurScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.entete}>
          <Text style={styles.titre}>Activer votre Carte</Text>
          <Text style={styles.texte}>
            Veuillez saisir le code d'activation fourni par le bibliothécaire lors de votre inscription.
          </Text>
        </View>

        <View style={styles.formulaire}>
          <ChampTexte
            label="Code d'activation"
            valeur={code}
            onChangeText={(txt) => {
              setCode(txt.toUpperCase());
              if(erreur) setErreur('');
            }}
            placeholder="Ex: ABCD-1234"
            erreur={erreur}
            icone="card-outline"
          />
        </View>

        <View style={styles.actions}>
          <Bouton 
            titre="Valider le Code" 
            surClic={gererActivation} 
            estChargeant={chargement}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conteneurScroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  entete: {
    marginTop: 40,
    marginBottom: 30,
  },
  titre: {
    fontSize: 32,
    fontWeight: 'bold',
    color: couleurs.primaire,
    marginBottom: 12,
  },
  texte: {
    color: couleurs.texteSecondaire,
    fontSize: 16,
    lineHeight: 24,
  },
  formulaire: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    paddingBottom: 20,
    marginTop: 40,
  }
});
