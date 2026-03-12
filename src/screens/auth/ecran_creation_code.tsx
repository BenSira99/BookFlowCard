import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { couleurs } from '../../theme/couleurs';
import { ClavierNumerique } from '../../components/common/clavier_numerique';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withRepeat } from 'react-native-reanimated';
import { utiliserMagasinSecurite } from '../../store/magasin_securite';
import { Alert } from 'react-native';

export default function EcranCreationCode({ navigation }: any) {
  const [pin, setPin] = useState('');
  const [etape, setEtape] = useState<'creation' | 'confirmation'>('creation');
  const [pinTemp, setPinTemp] = useState('');
  const shakeAnimation = useSharedValue(0);

  const { initialiserPin } = utiliserMagasinSecurite();

  const LONGUEUR_PIN = 6;

  const styleShake = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeAnimation.value * 10 }]
    };
  });

  const secouerClavier = () => {
    shakeAnimation.value = withSequence(
      withTiming(-1, { duration: 50 }),
      withRepeat(withTiming(1, { duration: 50 }), 3, true),
      withTiming(0, { duration: 50 })
    );
  };

  const gererTouche = (chiffre: string) => {
    if (pin.length < LONGUEUR_PIN) {
      const nouveauPin = pin + chiffre;
      setPin(nouveauPin);
      
      // Auto-validation une fois 6 chiffres atteints
      if (nouveauPin.length === LONGUEUR_PIN) {
        setTimeout(() => testerValidation(nouveauPin), 300);
      }
    }
  };

  const gererEffacer = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const testerValidation = async (codeSaisi: string) => {
    if (etape === 'creation') {
      setPinTemp(codeSaisi);
      setPin('');
      setEtape('confirmation');
    } else {
      if (codeSaisi === pinTemp) {
        try {
          // Utilisation du magasin sécurisé (OWASP M2/M4/M5)
          await initialiserPin(codeSaisi);
          
          // Redirection vers config biométrique ou completion
          navigation.navigate('ConfigurationBiometrie');
        } catch (error) {
          Alert.alert('Erreur', 'Impossible de sécuriser le code PIN.');
          secouerClavier();
          setPin('');
        }
      } else {
        // Erreur de confirmation
        secouerClavier();
        setPin('');
      }
    }
  };

  return (
    <View style={styles.conteneur}>
      <View style={styles.entete}>
        <Text style={styles.titre}>
          {etape === 'creation' ? 'Créer un code PIN' : 'Confirmez votre PIN'}
        </Text>
        <Text style={styles.sousTitre}>
          {etape === 'creation' 
            ? 'Ce code à 6 chiffres protègera l\'accès à votre carte numérique.' 
            : 'Saisissez de nouveau le code pour valider.'}
        </Text>
      </View>

      <Animated.View style={[styles.conteneurIndicateurs, styleShake]}>
        {Array.from({ length: LONGUEUR_PIN }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.point, 
              pin.length > i ? styles.pointRempli : null
            ]} 
          />
        ))}
      </Animated.View>

      <View style={styles.conteneurClavier}>
        <ClavierNumerique surTouche={gererTouche} surEffacer={gererEffacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
  },
  entete: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: couleurs.primaire,
    marginBottom: 12,
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 16,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    lineHeight: 24,
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
    shadowColor: couleurs.primaireClair,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  conteneurClavier: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10,
  }
});
