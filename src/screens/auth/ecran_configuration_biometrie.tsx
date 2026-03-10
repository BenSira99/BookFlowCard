import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { Bouton } from '../../components/common/bouton';
import { utiliserMagasinAuth } from '../../store/magasin_auth';

export default function EcranConfigurationBiometrie({ navigation }: any) {
  const [estCompatible, setEstCompatible] = useState(false);
  const [typeBiometrie, setTypeBiometrie] = useState('Biométrie');
  const connecterApp = utiliserMagasinAuth(etat => etat.connecter);

  useEffect(() => {
    verifierBiometrie();
  }, []);

  const verifierBiometrie = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enregistre = await LocalAuthentication.isEnrolledAsync();
    
    if (compatible && enregistre) {
      setEstCompatible(true);
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setTypeBiometrie('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setTypeBiometrie('Touch ID / Empreinte');
      }
    }
  };

  const terminerConfiguration = (avecBiometrie: boolean) => {
    if (avecBiometrie) {
      // Activer / Sauvegarder pref (à implémenter via SecureStore)
      Alert.alert('Succès', `${typeBiometrie} configuré avec succès !`);
    }
    
    // Simuler l'authentification réussie
    connecterApp('token_jwt_simule', {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      typeRole: 'Utilisateur',
    });
    
    // OWASP M4 : Redirection gérée au niveau racine par changement d'état (estConnecte)
  };

  return (
    <View style={styles.conteneur}>
      <View style={styles.contenu}>
        <View style={styles.iconeConteneur}>
          <Ionicons 
            name={typeBiometrie.includes('Face') ? 'happy-outline' : 'finger-print-outline'} 
            size={80} 
            color={couleurs.primaire} 
          />
        </View>
        
        <Text style={styles.titre}>Authentification Rapide</Text>
        <Text style={styles.sousTitre}>
          Utilisez {typeBiometrie} pour déverrouiller BookFlowCard plus rapidement et en toute sécurité.
        </Text>
      </View>

      <View style={styles.actions}>
        {estCompatible ? (
          <Bouton 
            titre={`Activer ${typeBiometrie}`} 
            surClic={() => terminerConfiguration(true)} 
          />
        ) : (
          <Text style={styles.note}>Aucune biométrie configurée sur cet appareil.</Text>
        )}
        <Bouton 
          titre={estCompatible ? "Plus tard" : "Terminer"} 
          surClic={() => terminerConfiguration(false)} 
          type="secondaire" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
    padding: 24,
    justifyContent: 'space-between',
  },
  contenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeConteneur: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: couleurs.carteArrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // Glow effect
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 16,
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 16,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  actions: {
    width: '100%',
    paddingBottom: 20,
  },
  note: {
    color: couleurs.attention,
    textAlign: 'center',
    marginBottom: 20,
  }
});
