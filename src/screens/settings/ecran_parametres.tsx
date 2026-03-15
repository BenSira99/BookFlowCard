import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';

import { utiliserMagasinParametres } from '../../store/magasin_parametres';
import { useDesignSystem } from '../../hooks/useDesignSystem';

// Composants
import { InterrupteurPremium } from '../../components/settings/interrupteur_premium';
import { SeparateurAnime } from '../../components/settings/separateur_anime';
import { ModalDeconnexion } from '../../components/settings/modal_deconnexion';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OptionReglage = ({ icone, titre, sousTitre, type = 'chevron', valeur, onPress, styles, couleurs }: any) => {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconeFond, { backgroundColor: couleurs.carteArrierePlan }]}>
        <Ionicons name={icone} size={20} color={couleurs.primaire} />
      </View>
      <View style={styles.texteOption}>
        <Text style={styles.titreOption}>{titre}</Text>
        {sousTitre && <Text style={styles.sousTitreOption}>{sousTitre}</Text>}
      </View>
      {type === 'chevron' && <Ionicons name="chevron-forward" size={18} color={couleurs.texteSecondaire} />}
      {type === 'switch' && <InterrupteurPremium actif={valeur} onPress={onPress} />}
    </TouchableOpacity>
  );
};

export default function EcranParametres() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { 
    estModeSombre, setModeSombre, 
    estBiometrieActive, setBiometrie,
    taillePolice, setTaillePolice
  } = utiliserMagasinParametres();

  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

  const [modalDeconnexionVisible, setModalDeconnexionVisible] = React.useState(false);

  // Animation thème
  const scaleTheme = useSharedValue(0);
  const [themeTemp, setThemeTemp] = React.useState(estModeSombre);

  const basculerTheme = () => {
    const nouvelleValeur = !estModeSombre;
    setThemeTemp(nouvelleValeur);
    scaleTheme.value = withTiming(1, { duration: 800 }, (fini) => {
        if (fini) {
            runOnJS(setModeSombre)(nouvelleValeur);
            scaleTheme.value = 0;
        }
    });
  };

  const changerTaillePolice = () => {
    let nouvelleTaille = taillePolice + 1;
    if (nouvelleTaille > 3) nouvelleTaille = 1;
    setTaillePolice(nouvelleTaille);
  };

  const libelleTaillePolice = {
    1: 'Petit',
    2: 'Normal',
    3: 'Grand'
  }[taillePolice];

  const styleMasque = useAnimatedStyle(() => ({
    transform: [{ scale: scaleTheme.value * 4 }], 
    backgroundColor: themeTemp ? '#0F172A' : '#F8FAFC', 
    opacity: scaleTheme.value,
  }));

  return (
    <View style={[styles.conteneur, { paddingTop: insets.top }]}>
      <View style={styles.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.boutonRetour}>
          <Ionicons name="arrow-back" size={24} color={couleurs.textePrincipal} />
        </TouchableOpacity>
        <Text style={styles.titreEntete}>Paramètres</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.titreSection}>Sécurité & Compte</Text>
          <OptionReglage 
            icone="key-outline" 
            titre="Changer le code PIN" 
            sousTitre="Renforcez la sécurité de votre accès"
            onPress={() => (navigation as any).navigate('ChangementPin')}
            styles={styles}
            couleurs={couleurs}
          />
          <OptionReglage 
            icone="finger-print-outline" 
            titre="Biométrie" 
            sousTitre="FaceID / Empreinte digitale"
            type="switch"
            valeur={estBiometrieActive}
            onPress={() => setBiometrie(!estBiometrieActive)}
            styles={styles}
            couleurs={couleurs}
          />
        </Animated.View>

        <SeparateurAnime />

        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.titreSection}>Apparence</Text>
          <OptionReglage 
            icone="moon-outline" 
            titre="Mode Sombre" 
            type="switch"
            valeur={estModeSombre}
            onPress={basculerTheme}
            styles={styles}
            couleurs={couleurs}
          />
          <OptionReglage 
            icone="text-outline" 
            titre="Taille de la police" 
            sousTitre={libelleTaillePolice}
            onPress={changerTaillePolice}
            styles={styles}
            couleurs={couleurs}
          />
        </Animated.View>

        <SeparateurAnime />

        <Animated.View entering={FadeInDown.delay(400)}>
          <Text style={styles.titreSection}>Session</Text>
          <TouchableOpacity style={styles.boutonDeconnexion} onPress={() => setModalDeconnexionVisible(true)}>
            <Ionicons name="log-out-outline" size={20} color={couleurs.erreur} />
            <Text style={styles.texteDeconnexion}>Déconnexion</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.piedPage}>
          <Text style={styles.texteVersion}>BookFlow Card v1.0.0</Text>
          <Text style={styles.texteAuteur}>BenSira99 — 2026</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Masque circulaire pour la transition de thème */}
      <Animated.View pointerEvents="none" style={[styles.masqueTheme, styleMasque]} />

      <ModalDeconnexion 
        visible={modalDeconnexionVisible} 
        onClose={() => setModalDeconnexionVisible(false)}
        onConfirm={() => {
            setModalDeconnexionVisible(false);
            navigation.replace('Login' as any);
        }}
      />
    </View>
  );
}

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  boutonRetour: {
    padding: 5,
    marginRight: 15,
  },
  titreEntete: {
    fontSize: fs(20),
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
  },
  scrollContent: {
    padding: 20,
  },
  titreSection: {
    fontSize: fs(14),
    fontWeight: 'bold',
    color: couleurs.primaire,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 15,
    marginTop: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconeFond: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  texteOption: {
    flex: 1,
  },
  titreOption: {
    fontSize: fs(16),
    fontWeight: '600',
    color: couleurs.textePrincipal,
    marginBottom: 2,
  },
  sousTitreOption: {
    fontSize: fs(13),
    color: couleurs.texteSecondaire,
  },
  boutonDeconnexion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  texteDeconnexion: {
    color: couleurs.erreur,
    fontWeight: 'bold',
    fontSize: fs(15),
  },
  piedPage: {
    marginTop: 40,
    alignItems: 'center',
  },
  texteVersion: {
    color: couleurs.texteSecondaire,
    fontSize: fs(12),
    fontWeight: '600',
  },
  texteAuteur: {
    color: couleurs.texteSecondaire,
    opacity: 0.3,
    fontSize: fs(10),
    marginTop: 4,
  },
  masqueTheme: {
    position: 'absolute',
    top: 250, 
    right: 20,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_WIDTH * 2,
    borderRadius: SCREEN_WIDTH,
    zIndex: 100,
  }
});
