import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  SharedValue
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { servicePartageP2P } from '../../services/service_partage_p2p';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Interface Premium type "Xender" pour le partage de catalogue en P2P.
 * Utilise des ondes concentriques animées (Reanimated).
 */
export default function EcranPartageRadar() {
  const navigation = useNavigation();
  // Animation des ondes (3 anneaux)
  const onde1 = useSharedValue(0.2);
  const onde2 = useSharedValue(0.2);
  const onde3 = useSharedValue(0.2);

  const initierOnde = (valeur: SharedValue<number>, delai: number) => {
    valeur.value = withDelay(
      delai,
      withRepeat(
        withTiming(1.5, { duration: 2500, easing: Easing.out(Easing.quad) }),
        -1, // Infini
        false // Pas de Yoyo
      )
    );
  };

  useEffect(() => {
    initierOnde(onde1, 0);
    initierOnde(onde2, 800);
    initierOnde(onde3, 1600);
  }, []);

  const getOndeStyle = (valeur: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      transform: [{ scale: valeur.value }],
      // Utilisation d'interpolation simple sans useDerivedValue pour éviter les problèmes de typage rapide
      // L'opacité diminue à mesure que l'onde grandit
      opacity: 1 - (valeur.value - 0.2) / 1.3
    }));
  };

  const declencherPartage = async () => {
    const resultat = await servicePartageP2P.partagerCatalogue();
    if (!resultat.success) {
      Alert.alert('Erreur', resultat.message);
    }
  };

  const gererReception = async () => {
    const resultat = await servicePartageP2P.importerFichierBCF();
    
    if (resultat.success) {
       if (resultat.type === 'CATALOGUE') {
         // Redirection vers le résumé visuel
         (navigation as any).navigate('ResumeImportation', { 
           ajoutes: resultat.ajoutes, 
           misAJour: resultat.misAJour 
         });
       } else if (resultat.type === 'TRANSACTIONS') {
         (navigation as any).navigate('ResumeTransactions', { 
           delta: resultat.delta 
         });
       } else {
         Alert.alert('Succès', resultat.message || 'Importation réussie.');
       }
    } else {
      if (resultat.erreur !== 'CANCELLED') {
         Alert.alert('Erreur', resultat.message || 'Impossible d’importer le fichier.');
      }
    }
  };

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titre}>Partage Haute Vitesse</Text>
      <Text style={styles.sousTitre}>
        Partagez le catalogue complet avec un autre appareil, sans internet. (Bluetooth / Wi-Fi Direct)
      </Text>

      {/* Zone du Radar */}
      <View style={styles.conteneurRadar}>
        {/* Ondes */}
        <Animated.View style={[styles.onde, getOndeStyle(onde3)]} />
        <Animated.View style={[styles.onde, getOndeStyle(onde2)]} />
        <Animated.View style={[styles.onde, getOndeStyle(onde1)]} />

        {/* Bouton Central */}
        <TouchableOpacity 
          style={styles.boutonCentral}
          activeOpacity={0.8}
          onPress={declencherPartage}
        >
          <View style={styles.coeurBouton}>
            <Ionicons name="share-social-outline" size={40} color="white" />
            <Text style={styles.texteBouton}>ENVOYER</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.instruction}>
        Appuyez au centre pour envoyer vos données ou en bas pour recevoir.
      </Text>

      {/* Bouton Recevoir (Style Xender) */}
      <TouchableOpacity 
        style={styles.boutonRecevoir}
        onPress={gererReception}
      >
        <Ionicons name="download-outline" size={24} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.texteBoutonRecevoir}>RECEVOIR / IMPORTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titre: {
    fontSize: 26,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 10,
  },
  sousTitre: {
    fontSize: 15,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 22,
  },
  conteneurRadar: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  onde: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(13, 148, 136, 0.4)', // Couleur Primaire transparente
    borderWidth: 2,
    borderColor: 'rgba(13, 148, 136, 0.8)',
  },
  boutonCentral: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: couleurs.primaireFonce, // Halo sombre
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  coeurBouton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: couleurs.primaire,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteBouton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
  },
  instruction: {
    marginTop: 60,
    fontSize: 14,
    color: couleurs.texteSecondaire,
    fontStyle: 'italic',
  },
  boutonRecevoir: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 40,
    alignItems: 'center',
  },
  texteBoutonRecevoir: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  }
});
