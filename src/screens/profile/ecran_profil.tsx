import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Alert,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withTiming,
  withSpring,
  FadeIn
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { PhotoMembre } from '../../components/card/PhotoMembre';
import { StatistiqueAnimee } from '../../components/profile/statistique_animee';
import { SectionProfil } from '../../components/profile/section_profil';
import { ItemProfil } from '../../components/profile/item_profil';
import { AnneauProgres } from '../../components/profile/anneau_progres';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

export default function EcranProfil() {
  const navigation = useNavigation();
  const { utilisateur, deconnecter } = utiliserMagasinAuth();
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [enChargement, setEnChargement] = useState(false);
  const [progresUpload, setProgresUpload] = useState(0);
  const [afficherConfettis, setAfficherConfettis] = useState(false);
  
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const prendrePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la caméra est nécessaire.');
      return;
    }

    const resultat = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultat.canceled) {
      simulerUpload(resultat.assets[0].uri);
    }
  };

  const choisirDepuisGalerie = async () => {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultat.canceled) {
      simulerUpload(resultat.assets[0].uri);
    }
  };

  const simulerUpload = (uri: string) => {
    setEnChargement(true);
    setProgresUpload(0);
    
    let p = 0;
    const intervalle = setInterval(() => {
      p += 0.1;
      setProgresUpload(p);
      if (p >= 1) {
        clearInterval(intervalle);
        setPhotoUri(uri);
        setEnChargement(false);
        setAfficherConfettis(true);
        setTimeout(() => setAfficherConfettis(false), 3000);
      }
    }, 200);
  };

  // Styles animés pour le Header Parallax
  const styleHeader = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - 80],
      [HEADER_HEIGHT, 80],
      Extrapolate.CLAMP
    );
    return { height };
  });

  const stylePhoto = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0, HEADER_HEIGHT - 80],
      [1.2, 1, 0.4],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT - 80],
      [0, -20],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const styleTextes = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={styles.conteneurGlobal}>
      {/* Header Parallax */}
      <Animated.View style={[styles.header, styleHeader]}>
        <Animated.View style={[styles.conteneurPhoto, stylePhoto]}>
          <PhotoMembre uri={photoUri} taille={120} />
          {enChargement && (
            <AnneauProgres progres={progresUpload} taille={135} />
          )}
          <TouchableOpacity style={styles.boutonEditPhoto} onPress={() => {
            Alert.alert('Changer de photo', 'Choisissez une option', [
              { text: 'Prendre une photo', onPress: prendrePhoto },
              { text: 'Choisir de la galerie', onPress: choisirDepuisGalerie },
              { text: 'Annuler', style: 'cancel' }
            ]);
          }}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.headerTextes, styleTextes]}>
          <Text style={styles.nom}>{utilisateur?.prenom} {utilisateur?.nom}</Text>
          <Text style={styles.numeroMembre}>{utilisateur?.id}</Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.spacer} />
        
        {/* Statistiques */}
        <TouchableOpacity 
          style={styles.statsContainer} 
          activeOpacity={0.7}
          onPress={() => (navigation as any).navigate('StatsDetaillees')}
        >
          <StatistiqueAnimee label="Livres lus" valeurCible={42} delai={500} />
          <StatistiqueAnimee label="Emprunts" valeurCible={3} suffixe="/5" delai={700} />
          <StatistiqueAnimee label="Années" valeurCible={2} delai={900} />
          
          <View style={styles.badgeDetailStats}>
            <Ionicons name="chevron-forward" size={12} color="white" />
          </View>
        </TouchableOpacity>

        <SectionProfil titre="Informations Personnelles" index={1}>
          <ItemProfil label="Prénom" valeur={utilisateur?.prenom || ''} icone="person-outline" />
          <ItemProfil label="Nom" valeur={utilisateur?.nom || ''} icone="person-outline" />
          <ItemProfil label="Email" valeur="jean.dupont@email.com" icone="mail-outline" modifiable />
          <ItemProfil label="Téléphone" valeur="+33 6 12 34 56 78" icone="call-outline" modifiable />
        </SectionProfil>

        <SectionProfil titre="Abonnement" index={2}>
          <ItemProfil label="Type" valeur="Premium Adulte" icone="ribbon-outline" />
          <ItemProfil label="Date d'adhésion" valeur="12 Janvier 2024" icone="calendar-outline" />
          <ItemProfil label="Statut" valeur="Actif" icone="checkmark-circle-outline" />
        </SectionProfil>

        <SectionProfil titre="Préférences & Sécurité" index={3}>
          <ItemProfil label="Notifications" valeur="Activées" icone="notifications-outline" modifiable />
          <ItemProfil label="Changer le code PIN" valeur="••••••" icone="lock-closed-outline" modifiable />
          <ItemProfil label="Biométrie" valeur="FaceID" icone="finger-print-outline" modifiable />
        </SectionProfil>

        <TouchableOpacity style={styles.boutonDeconnexion} onPress={deconnecter}>
          <Text style={styles.texteDeconnexion}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {afficherConfettis && (
        <ConfettiCannon count={200} origin={{x: width / 2, y: -20}} fadeOut={true} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: couleurs.carteArrierePlan,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  conteneurPhoto: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonEditPhoto: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: couleurs.primaire,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: couleurs.carteArrierePlan,
  },
  headerTextes: {
    marginTop: 15,
    alignItems: 'center',
  },
  nom: {
    fontSize: 22,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
  },
  numeroMembre: {
    fontSize: 14,
    color: couleurs.texteSecondaire,
    marginTop: 4,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  spacer: {
    height: HEADER_HEIGHT + 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  boutonDeconnexion: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: couleurs.erreur,
    borderRadius: 12,
  },
  texteDeconnexion: {
    color: couleurs.erreur,
    fontSize: 16,
    fontWeight: '600',
  },
  badgeDetailStats: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: couleurs.primaire,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: couleurs.arrierePlan,
  },
});
