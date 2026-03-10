import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { couleurs } from '../../theme/couleurs';
import { Bouton } from '../../components/common/bouton';
import { ChampTexte } from '../../components/common/champ_texte';
import { serviceSynchroQR } from '../../services/service_synchro_qr';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TouchableOpacity } from 'react-native';

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
      navigation.navigate('CreationCode');
    }, 1500);
  };

  const gererScanInscription = () => {
    // On réutilise l'écran ScannerISBN mais paramétré ou on redirige vers un nouveau scanner dédié
    // Pour simplifier, on navigue vers ScannerISBN qui gère déjà la synchro
    (navigation as any).navigate('ScannerISBN');
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
          
          <View style={styles.separateur}>
            <View style={styles.ligne} />
            <Text style={styles.texteSeparateur}>OU</Text>
            <View style={styles.ligne} />
          </View>

          <TouchableOpacity 
            style={styles.boutonScan} 
            onPress={gererScanInscription}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={24} color="white" />
            <Text style={styles.texteBoutonScan}>Scanner QR Inscription</Text>
          </TouchableOpacity>
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
  },
  separateur: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  ligne: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  texteSeparateur: {
    color: couleurs.texteSecondaire,
    marginHorizontal: 15,
    fontSize: 12,
    fontWeight: 'bold',
  },
  boutonScan: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.2)',
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: couleurs.primaire,
    gap: 10,
  },
  texteBoutonScan: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
