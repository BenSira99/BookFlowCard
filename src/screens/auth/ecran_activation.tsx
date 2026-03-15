import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { Bouton } from '../../components/common/bouton';
import { serviceSynchroQR } from '../../services/service_synchro_qr';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { Ionicons } from '@expo/vector-icons';

export default function EcranActivation({ navigation, route }: any) {
  const [donneesScannees, setDonneesScannees] = useState<any>(null);
  const [chargement, setChargement] = useState(false);
  const { importerUtilisateur } = utiliserMagasinAuth();
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

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
                <Ionicons name="qr-code" size={fs(60)} color={couleurs.primaire} />
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
                     <Ionicons name="person" size={fs(40)} color={couleurs.texteSecondaire} />
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

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
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
    fontSize: fs(32),
    fontWeight: 'bold',
    color: couleurs.primaire,
    marginBottom: 12,
  },
  texte: {
    color: couleurs.texteSecondaire,
    fontSize: fs(16),
    lineHeight: fs(24),
  },
  conteneurActionInitiale: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  boutonScanPrincipal: {
    alignItems: 'center',
  },
  cercleIcone: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: couleurs.estModeSombre ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: couleurs.primaire,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  texteBoutonPrincipal: {
    color: couleurs.textePrincipal,
    fontSize: fs(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  carteRecapitulatif: {
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: couleurs.bordure,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ligneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: couleurs.estModeSombre ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 16,
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
    fontSize: fs(13),
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valeur: {
    color: couleurs.textePrincipal,
    fontSize: fs(20),
    fontWeight: 'bold',
  },
  separateur: {
    height: 1,
    backgroundColor: couleurs.bordure,
    marginVertical: 20,
  },
  grilleInfos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  itemInfo: {
    minWidth: '40%',
    marginRight: 20,
    marginBottom: 10,
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
    fontSize: fs(14),
    textDecorationLine: 'underline',
  }
});
