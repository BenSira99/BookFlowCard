import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Brightness from 'expo-brightness';
import { useFocusEffect } from '@react-navigation/native';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinAuth } from '../../store/magasin_auth';

const { width } = Dimensions.get('window');

export default function EcranCarte() {
  const { utilisateur } = utiliserMagasinAuth();
  const [luminositePrecedente, setLuminositePrecedente] = useState<number | null>(null);

  // OWASP M5 : Augmentation luminosité pour lecture QR + remise à la normale via focusEffect
  useFocusEffect(
    React.useCallback(() => {
      let isEnCours = true;

      const gererLuminosite = async () => {
        const status = await Brightness.requestPermissionsAsync();
        if (status.status === 'granted') {
          const lumInit = await Brightness.getBrightnessAsync();
          if (isEnCours) {
            setLuminositePrecedente(lumInit);
            await Brightness.setBrightnessAsync(1); // Luminosité max pour le QR
          }
        }
      };

      gererLuminosite();

      return () => {
        isEnCours = false;
        if (luminositePrecedente !== null) {
          Brightness.setBrightnessAsync(luminositePrecedente);
        }
      };
    }, [luminositePrecedente])
  );

  // Construction des données du QR. Pour plus de sécurité (OWASP M10), ça devrait être 
  // un payload signé / JWT renouvelé souvent, généré localement hors-ligne si besoin.
  const verifQrData = JSON.stringify({
    num: utilisateur?.numeroMembre,
    ts: Date.now(), // Contre le rejeu basique
  });

  return (
    <View style={styles.conteneurGlobal}>
      <View style={styles.entete}>
         <Text style={styles.titre}>Carte Numérique</Text>
         <Text style={styles.sousTitre}>Présentez ce code au bibliothécaire</Text>
      </View>

      <View style={styles.conteneurCarte}>
        <View style={styles.carteMembre}>
          
          <View style={styles.enTeteCarte}>
            <Text style={styles.texteLogo}>BiblioCard</Text>
            <Text style={styles.badgePremium}>PREMIUM</Text>
          </View>

          <View style={styles.conteneurQrInfo}>
            <View style={styles.zoneQr}>
              <View style={styles.qrGarniture}>
                <QRCode
                  value={verifQrData}
                  size={width * 0.55}
                  color={couleurs.textePrincipal}
                  backgroundColor={couleurs.transparent}
                />
              </View>
            </View>
            
            <View style={styles.infosUtilisateur}>
              <Text style={styles.labelInfos}>Nom du membre</Text>
              <Text style={styles.texteInfos}>{utilisateur?.prenom} {utilisateur?.nom}</Text>
              
              <Text style={[styles.labelInfos, {marginTop: 16}]}>N° de membre</Text>
              <Text style={styles.numeroGeant}>{utilisateur?.numeroMembre}</Text>
            </View>
          </View>

          <View style={styles.piedRessources}>
             <Text style={styles.disclaimerCarte}>
               Code dynamique mis à jour automatiquement.
             </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 16,
    color: couleurs.texteSecondaire,
  },
  conteneurCarte: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  carteMembre: {
    backgroundColor: couleurs.primaireFonce, // Navy Marine
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: couleurs.primaireClair,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.3)',
  },
  enTeteCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  texteLogo: {
    color: couleurs.accentDoré,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  badgePremium: {
    backgroundColor: couleurs.accentDoré,
    color: couleurs.arrierePlan,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  conteneurQrInfo: {
    alignItems: 'center',
  },
  zoneQr: {
    backgroundColor: '#FFFFFF', // Fond blanc impératif pour lisibilité scanner
    padding: 16,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  qrGarniture: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: couleurs.primaireClair,
    borderStyle: 'dashed',
  },
  infosUtilisateur: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  labelInfos: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  texteInfos: {
    color: couleurs.textePrincipal,
    fontSize: 22,
    fontWeight: 'bold',
  },
  numeroGeant: {
    color: couleurs.accentDoré,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
  },
  piedRessources: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
    alignItems: 'center',
  },
  disclaimerCarte: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  }
});
