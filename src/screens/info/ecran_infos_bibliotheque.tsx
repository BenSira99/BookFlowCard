import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedScrollHandler 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { utiliserMagasinInfosBiblio } from '../../store/magasin_infos_biblio';
import { useDesignSystem } from '../../hooks/useDesignSystem';

// Composants
import { HorairesOuverture } from '../../components/info/horaires_ouverture';
import { FaqAccordeon } from '../../components/info/faq_accordeon';

export default function EcranInfosBibliotheque() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { adresse, telephone, email, faq } = utiliserMagasinInfosBiblio();
  
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const ouvrirGPS = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${adresse}`,
      android: `geo:0,0?q=${adresse}`
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={[styles.conteneur, { paddingTop: insets.top }]}>
      <View style={styles.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.boutonRetour}>
          <Ionicons name="arrow-back" size={24} color={couleurs.textePrincipal} />
        </TouchableOpacity>
        <Text style={styles.titreEntete}>La Bibliothèque</Text>
      </View>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(100)}>
          <HorairesOuverture />
        </Animated.View>

        <View style={styles.sectionInfo}>
          <TouchableOpacity style={styles.carteInfo} onPress={ouvrirGPS} activeOpacity={0.7}>
            <View style={styles.iconeCercle}>
              <Ionicons name="location" size={20} color={couleurs.primaire} />
            </View>
            <View style={styles.texteInfo}>
              <Text style={styles.labelInfo}>Adresse</Text>
              <Text style={styles.valeurInfo}>{adresse}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.ligneContact}>
             <TouchableOpacity style={styles.carteInfo} onPress={() => Linking.openURL(`tel:${telephone}`)}>
                <Ionicons name="call" size={20} color={couleurs.primaire} />
                <Text style={styles.valeurInfo}>{telephone}</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.carteInfo} onPress={() => Linking.openURL(`mailto:${email}`)}>
                <Ionicons name="mail" size={20} color={couleurs.primaire} />
                <Text style={styles.valeurInfo} numberOfLines={1}>{email}</Text>
             </TouchableOpacity>
          </View>
        </View>

        <FaqAccordeon faq={faq} />

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
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
    zIndex: 10,
    backgroundColor: couleurs.arrierePlan,
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
  sectionInfo: {
    marginBottom: 30,
    gap: 12,
  },
  carteInfo: {
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  iconeCercle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  texteInfo: {
    flex: 1,
  },
  labelInfo: {
    color: couleurs.texteSecondaire,
    fontSize: fs(12),
    marginBottom: 2,
  },
  valeurInfo: {
    color: couleurs.textePrincipal,
    fontSize: fs(14),
    fontWeight: '500',
  },
  ligneContact: {
    flexDirection: 'column',
    gap: 12,
  },
  section: {
    marginTop: 10,
  },
  titreSection: {
    fontSize: fs(22),
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 20,
    paddingLeft: 5,
  }
});

