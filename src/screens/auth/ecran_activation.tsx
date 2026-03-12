import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { couleurs } from '../../theme/couleurs';
import { Bouton } from '../../components/common/bouton';
import { serviceSynchroQR } from '../../services/service_synchro_qr';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { Ionicons } from '@expo/vector-icons';
import { Alert, TouchableOpacity } from 'react-native';

export default function EcranActivation({ navigation, route }: any) {
  const [donneesScannees, setDonneesScannees] = useState<any>(null);
  const [chargement, setChargement] = useState(false);
  const { importerUtilisateur } = utiliserMagasinAuth();

  // Gestion du retour du scanner
  useEffect(() => {
    if (route.params?.qrData) {
      const resultat = serviceSynchroQR.analyserInscription(route.params.qrData);
      if (resultat.success) {
        setDonneesScannees(resultat.data);
      } else {
        Alert.alert('Erreur', 'QR Code invalide pour l\'inscription.');
      }
    }
  }, [route.params?.qrData]);

  const gererScanInscription = () => {
    (navigation as any).navigate('ScannerISBN', { mode: 'INSCRIPTION' });
  };

  const confirmerActivation = async () => {
    if (!donneesScannees) return;

    setChargement(true);
    try {
      // Normalisation et import (Logique extraite de serviceSynchroQR.traiterInscriptionDesktop)
      const data = donneesScannees;
      if (data.qr_code || data.infoSpecifique) {
        importerUtilisateur({
          id: data.qr_code || data.infoSpecifique,
          nom: data.nom,
          prenom: data.prenom,
          dateExpiration: data.date_expiration || '',
          typeRole: data.type as any,
          photo: data.photo_profil || undefined,
          secretQR: data.qr_code || data.infoSpecifique
        });
        
        // Petit délai pour l'effet visuel
        setTimeout(() => {
          setChargement(false);
          navigation.navigate('CreationCode');
        }, 1000);
      }
    } catch (error) {
      setChargement(false);
      Alert.alert('Erreur', 'Impossible de valider l\'inscription.');
    }
  };

  return (
    <SafeAreaView style={styles.conteneur}>
      <ScrollView contentContainerStyle={styles.conteneurScroll}>
        <View style={styles.entete}>
          <Text style={styles.titre}>Activation</Text>
          <Text style={styles.texte}>
            {donneesScannees 
              ? 'Vérifiez vos informations ci-dessous avant de valider l\'activation de votre carte.'
              : 'Scannez le QR Code fourni par votre bibliothécaire pour activer votre carte numérique.'}
          </Text>
        </View>

        {!donneesScannees ? (
          <View style={styles.conteneurActionInitiale}>
            <TouchableOpacity 
              style={styles.boutonScanPrincipal} 
              onPress={gererScanInscription}
              activeOpacity={0.8}
            >
              <View style={styles.cercleIcone}>
                <Ionicons name="qr-code" size={60} color={couleurs.primaire} />
              </View>
              <Text style={styles.texteBoutonPrincipal}>Scanner le QR d'inscription</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.carteRecapitulatif}>
             <View style={styles.ligneInfo}>
                <View style={styles.avatarPlaceholder}>
                   {donneesScannees.photo_profil ? (
                     <Image source={{ uri: donneesScannees.photo_profil }} style={styles.avatar} />
                   ) : (
                     <Ionicons name="person" size={40} color={couleurs.texteSecondaire} />
                   )}
                </View>
                <View style={styles.colonnesTexte}>
                   <Text style={styles.label}>Membre</Text>
                   <Text style={styles.valeur}>{donneesScannees.nom} {donneesScannees.prenom}</Text>
                </View>
             </View>

             <View style={styles.separateur} />

             <View style={styles.grilleInfos}>
                <View style={styles.itemInfo}>
                   <Text style={styles.label}>Type / Rôle</Text>
                   <Text style={styles.valeur}>{donneesScannees.type?.toUpperCase()}</Text>
                </View>
                {donneesScannees.classe && (
                  <View style={styles.itemInfo}>
                    <Text style={styles.label}>Classe</Text>
                    <Text style={styles.valeur}>{donneesScannees.classe}</Text>
                  </View>
                )}
             </View>

             <Bouton 
               titre="Confirmer et Continuer" 
               surClic={confirmerActivation} 
               estChargeant={chargement}
               style={styles.boutonValider}
             />
             
             <TouchableOpacity 
               onPress={() => setDonneesScannees(null)}
               style={styles.boutonReessayer}
             >
               <Text style={styles.texteReessayer}>Re-scanner un autre code</Text>
             </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1, 
    backgroundColor: couleurs.arrierePlan 
  },
  conteneurScroll: {
    flexGrow: 1,
    padding: 24,
  },
  entete: {
    marginBottom: 40,
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
  conteneurActionInitiale: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  boutonScanPrincipal: {
    alignItems: 'center',
    gap: 20,
  },
  cercleIcone: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: couleurs.primaire,
    borderStyle: 'dashed',
  },
  texteBoutonPrincipal: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  carteRecapitulatif: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ligneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  colonnesTexte: {
    flex: 1,
  },
  label: {
    color: couleurs.texteSecondaire,
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valeur: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separateur: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  grilleInfos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 30,
  },
  itemInfo: {
    minWidth: '40%',
  },
  boutonValider: {
    marginTop: 10,
  },
  boutonReessayer: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  texteReessayer: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
