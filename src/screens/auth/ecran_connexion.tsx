import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { ClavierNumerique } from '../../components/common/clavier_numerique';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { utiliserMagasinSecurite } from '../../store/magasin_securite';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withRepeat } from 'react-native-reanimated';
import { Alert } from 'react-native';

export default function EcranConnexion() {
  const [pin, setPin] = useState('');
  const [biometrieDisponible, setBiometrieDisponible] = useState(false);
  
  // Magasins Zustand
  const { connecter } = utiliserMagasinAuth();
  const { 
    verifierPin, 
    estVerrouille, 
    incrementerEchecs, 
    reinitialiserEchecs 
  } = utiliserMagasinSecurite();
  
  const LONGUEUR_PIN = 6;
  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    verifierBiometrieDispo();
  }, []);

  const verifierBiometrieDispo = async () => {
    const enregistre = await LocalAuthentication.isEnrolledAsync();
    setBiometrieDisponible(enregistre);
    
    // Auto prompt biométrie au lancement
    if (enregistre && !estVerrouille) {
      setTimeout(declencherBiometrie, 500);
    }
  };

  const declencherBiometrie = async () => {
    try {
      if (estVerrouille) return;

      const resultat = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Connexion à BookFlow Card',
        cancelLabel: 'Utiliser le code PIN',
        disableDeviceFallback: true,
      });

      if (resultat.success) {
        reinitialiserEchecs();
        simulerConnexion();
      }
    } catch (e) {
      console.log('Biométrie annulée ou échouée', e);
    }
  };

  const secouerClavier = () => {
    shakeAnimation.value = withSequence(
      withTiming(-1, { duration: 50 }),
      withRepeat(withTiming(1, { duration: 50 }), 3, true),
      withTiming(0, { duration: 50 })
    );
  };

  const gererTouche = (chiffre: string) => {
    if (pin.length < LONGUEUR_PIN && !estVerrouille) {
      const nouveauPin = pin + chiffre;
      setPin(nouveauPin);
      
      if (nouveauPin.length === LONGUEUR_PIN) {
        setTimeout(() => verifierLePin(nouveauPin), 300);
      }
    }
  };

  const gererEffacer = () => {
    if (pin.length > 0 && !estVerrouille) {
      setPin(pin.slice(0, -1));
    }
  };

  const verifierLePin = async (codeSaisi: string) => {
    try {
      const estValide = await verifierPin(codeSaisi);
      
      if (estValide) {
        reinitialiserEchecs();
        simulerConnexion();
      } else {
        secouerClavier();
        setPin('');
        incrementerEchecs();
        
        const reste = utiliserMagasinSecurite.getState().tentativesRestantes;
        if (reste > 0) {
          Alert.alert('Code Incorrect', `Il vous reste ${reste} tentatives avant le verrouillage.`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du PIN:', error);
      Alert.alert('Erreur', "Problème lors de l'authentification.");
    }
  };

  const simulerConnexion = () => {
    const user = utiliserMagasinAuth.getState().utilisateur;
    // Si l'utilisateur est déjà dans le store (ex: via QR), on le connecte
    // Sinon on simule une connexion par défaut
    connecter('token_jwt_local', user || {
      id: '1',
      nom: 'Dupont',
      prenom: 'Jean',
      typeRole: 'Utilisateur Régulier'
    });
  };

  const styleShake = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value * 10 }]
    };
  });

  return (
    <SafeAreaView style={styles.conteneur}>
      <View style={styles.entete}>
        <View style={styles.iconeProfil}>
          <Ionicons name="person" size={40} color={couleurs.primaireFonce} />
        </View>
        <Text style={styles.titre}>Ravi de vous revoir !</Text>
        
        {estVerrouille ? (
          <Text style={styles.texteErreur}>
            Application verrouillée suite à trop d'échecs. Veuillez contacter la bibliothèque.
          </Text>
        ) : (
          <Text style={styles.texte}>Veuillez saisir votre code PIN à 6 chiffres.</Text>
        )}
      </View>

      <Animated.View style={[styles.conteneurIndicateurs, styleShake]}>
        {Array.from({ length: LONGUEUR_PIN }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.point, 
              pin.length > i ? styles.pointRempli : null,
              estVerrouille ? styles.pointVerrouille : null
            ]} 
          />
        ))}
      </Animated.View>

      <View style={styles.conteneurBas}>
        <View style={styles.conteneurClavier}>
          <ClavierNumerique surTouche={gererTouche} surEffacer={gererEffacer} />
        </View>

        <View style={styles.actionsSecondaires}>
          {biometrieDisponible && !estVerrouille && (
            <TouchableOpacity onPress={declencherBiometrie} style={styles.boutonBiometrie}>
              <Ionicons name="finger-print" size={24} color={couleurs.primaire} style={{ marginRight: 8 }} />
              <Text style={styles.texteLien}>Utiliser la biométrie</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.boutonOubli}>
            <Text style={styles.texteLienGris}>Code oublié ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
    justifyContent: 'space-between',
  },
  entete: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconeProfil: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: couleurs.carteArrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: couleurs.bordure,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 8,
  },
  texte: {
    color: couleurs.texteSecondaire,
    fontSize: 16,
  },
  texteErreur: {
    color: couleurs.erreur,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  conteneurIndicateurs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  point: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: couleurs.bordure,
    marginHorizontal: 10,
  },
  pointRempli: {
    backgroundColor: couleurs.primaire,
    borderColor: couleurs.primaire,
  },
  pointVerrouille: {
    borderColor: couleurs.erreur,
    backgroundColor: couleurs.transparent,
  },
  conteneurBas: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  conteneurClavier: {
    marginBottom: 10,
  },
  actionsSecondaires: {
    alignItems: 'center',
  },
  boutonBiometrie: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 24,
  },
  boutonOubli: {
    padding: 10,
  },
  texteLien: {
    color: couleurs.primaire,
    fontWeight: 'bold',
    fontSize: 16,
  },
  texteLienGris: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
