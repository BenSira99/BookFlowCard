import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Brightness from 'expo-brightness';
import * as ScreenCapture from 'expo-screen-capture';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Layout
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { CarteHolographique } from '../../components/card/CarteHolographique';
import { PhotoMembre } from '../../components/card/PhotoMembre';
import { BadgeStatut } from '../../components/card/BadgeStatut';
import { QrDynamique } from '../../components/card/QrDynamique';

const { width, height } = Dimensions.get('window');

/**
 * Écran principal de la Carte Membre Numérique.
 * Animations : Ouverture Spring, Expansion Plein Écran, Blur Navy.
 * Sécurité : Protection Screenshot & Luminosité Auto.
 */
export default function EcranCarteMembre() {
  const { utilisateur } = utiliserMagasinAuth();
  const [estPleinEcran, setEstPleinEcran] = useState(false);
  const [luminositeInitiale, setLuminositeInitiale] = useState<number | null>(null);

  // Animation d'ouverture
  const yOuverture = useSharedValue(-200);
  useEffect(() => {
    yOuverture.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  // Gestion de la sécurité et luminosité
  useFocusEffect(
    React.useCallback(() => {
      let actif = true;

      const activerSecurite = async () => {
        // Protection Screenshot (CWE-319 / OWASP M8)
        if (Platform.OS === 'android') {
          await ScreenCapture.preventScreenCaptureAsync();
        }
        
        // Luminosité Auto (UX Scan)
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === 'granted') {
          const lum = await Brightness.getBrightnessAsync();
          if (actif) {
            setLuminositeInitiale(lum);
            await Brightness.setBrightnessAsync(1.0);
          }
        }
      };

      activerSecurite();

      return () => {
        actif = false;
        ScreenCapture.allowScreenCaptureAsync();
        if (luminositeInitiale !== null) {
          Brightness.setBrightnessAsync(luminositeInitiale);
        }
      };
    }, [luminositeInitiale])
  );

  const styleOuverture = useAnimatedStyle(() => ({
    transform: [{ translateY: yOuverture.value }],
  }));

  // Effet d'expansion Plein Écran
  const transitionPleinEcran = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(estPleinEcran ? 'rgba(2, 6, 23, 0.95)' : 'transparent', { duration: 500 }),
    };
  });

  return (
    <View style={styles.conteneurGlobal}>
      <Animated.View style={[StyleSheet.absoluteFill, transitionPleinEcran, { pointerEvents: estPleinEcran ? 'auto' : 'none' }]}>
        {estPleinEcran && (
           <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        )}
      </Animated.View>

      <Animated.View style={[styles.contenu, styleOuverture]} entering={FadeInDown.duration(800)}>
        <Text style={styles.titrePage}>Ma BiblioCard</Text>
        
        {/* Carte Holographique */}
        <CarteHolographique>
          <View style={styles.enTeteCarte}>
            <PhotoMembre taille={60} />
            <View style={styles.infosUtilisateur}>
              <Text style={styles.nomMembre}>{utilisateur?.prenom} {utilisateur?.nom}</Text>
              <Text style={styles.numeroMembre}>{utilisateur?.id}</Text>
            </View>
            <BadgeStatut estActif={true} />
          </View>

          <View style={styles.corpsCarte}>
             <View style={styles.colonne}>
                <Text style={styles.label}>NIVEAU</Text>
                <Text style={styles.valeur}>PREMIUM</Text>
             </View>
             <View style={styles.colonne}>
                <Text style={styles.label}>EXPIRATION</Text>
                <Text style={styles.valeur}>12/2026</Text>
             </View>
             <View style={styles.colonne}>
                <Text style={styles.label}>LIVRES</Text>
                <Text style={styles.valeur}>3/5</Text>
             </View>
          </View>
        </CarteHolographique>

        {/* Zone QR Dynamique avec expansion */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => setEstPleinEcran(!estPleinEcran)}
          style={[styles.conteneurQr, estPleinEcran ? styles.qrPleinEcran : null]}
        >
          <QrDynamique 
            secret={utilisateur?.id || "BIBLIOCARD_DEFAULT"} 
            taille={estPleinEcran ? 250 : 180} 
            estStatique={true} 
          />
          {!estPleinEcran && (
            <Text style={styles.instruction}>Appuyez pour agrandir</Text>
          )}
        </TouchableOpacity>

        {estPleinEcran && (
          <TouchableOpacity style={styles.boutonFermer} onPress={() => setEstPleinEcran(false)}>
             <Text style={styles.texteFermer}>FERMER</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  contenu: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titrePage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 40,
    letterSpacing: 1,
  },
  enTeteCarte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  infosUtilisateur: {
    flex: 1,
    marginLeft: 15,
  },
  nomMembre: {
    color: couleurs.textePrincipal,
    fontSize: 18,
    fontWeight: 'bold',
  },
  numeroMembre: {
    color: couleurs.texteSecondaire,
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 2,
  },
  corpsCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 15,
    borderRadius: 12,
  },
  colonne: {
    alignItems: 'flex-start',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  valeur: {
    color: couleurs.textePrincipal,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  conteneurQr: {
    marginTop: 60,
    alignItems: 'center',
    backgroundColor: couleurs.carteArrierePlan,
    padding: 20,
    borderRadius: 30,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  qrPleinEcran: {
    position: 'absolute',
    top: height / 2 - 200,
    zIndex: 100,
    backgroundColor: 'white',
    padding: 40,
    transform: [{ scale: 1.1 }],
  },
  instruction: {
    color: couleurs.texteSecondaire,
    fontSize: 12,
    marginTop: 15,
    fontStyle: 'italic',
  },
  boutonFermer: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: couleurs.primaire,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    zIndex: 101,
  },
  texteFermer: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
  }
});
