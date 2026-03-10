import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { generateurTOTP } from '../../utils/generateur_totp';
import { TimerQr } from './TimerQr';
import { couleurs } from '../../theme/couleurs';

interface ProprietesQrDynamique {
  secret: string;
  taille: number;
  estStatique?: boolean; // Nouvelle option
}

/**
 * QR Code dynamique avec rotation TOTP (30s).
 * Animations : Timer circulaire + morphing (dissolution) lors du renouvellement.
 */
export const QrDynamique = ({ secret, taille, estStatique = false }: ProprietesQrDynamique) => {
  const [codeActuel, setCodeActuel] = useState(estStatique ? secret : generateurTOTP.genererCode(secret));
  const [codeCible, setCodeCible] = useState(codeActuel);
  const [tempsRestant, setTempsRestant] = useState(generateurTOTP.tempsRestant());
  
  const opaciteAncien = useSharedValue(1);
  const opaciteNouveau = useSharedValue(0);

  const rafraichirCode = useCallback(() => {
    const nouveauCode = generateurTOTP.genererCode(secret);
    if (nouveauCode !== codeActuel) {
      setCodeCible(nouveauCode);
      // Lancer l'animation de morphing (dissolution)
      opaciteAncien.value = withTiming(0, { duration: 800 });
      opaciteNouveau.value = withTiming(1, { duration: 800 }, (fini) => {
        if (fini) {
          runOnJS(setCodeActuel)(nouveauCode);
          opaciteAncien.value = 1;
          opaciteNouveau.value = 0;
        }
      });
    }
  }, [codeActuel, secret]);

  useEffect(() => {
    if (estStatique) return; // Pas d'intervalle en mode statique

    const intervalle = setInterval(() => {
      const restant = generateurTOTP.tempsRestant();
      setTempsRestant(restant);
      if (restant === 30) {
        rafraichirCode();
      }
    }, 1000);
    return () => clearInterval(intervalle);
  }, [rafraichirCode]);

  const styleAncien = useAnimatedStyle(() => ({ opacity: opaciteAncien.value }));
  const styleNouveau = useAnimatedStyle(() => ({ opacity: opaciteNouveau.value }));

  return (
    <View style={[styles.conteneur, { width: taille + 20, height: taille + 20 }]}>
      {/* Timer circulaire - Masqué en mode statique */}
      {!estStatique && (
        <TimerQr periode={30} tempsRestant={tempsRestant} taille={taille + 20} />
      )}

      {/* QR Codes avec superposition pour l'effet de morphing */}
      <View style={[styles.zoneQr, { width: taille, height: taille }]}>
        <Animated.View style={[StyleSheet.absoluteFill, styleAncien, styles.centrer]}>
          <QRCode
            value={codeActuel}
            size={taille - 20}
            color={couleurs.textePrincipal}
            backgroundColor={couleurs.transparent}
          />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, styleNouveau, styles.centrer]}>
          <QRCode
            value={codeCible}
            size={taille - 20}
            color={couleurs.textePrincipal}
            backgroundColor={couleurs.transparent}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneQr: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centrer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
