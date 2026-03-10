import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinStatistiques } from '../../store/magasin_statistiques';

// Composants
import { BarreXPLiquide } from '../../components/statistics/barre_xp_liquide';
import { CompteurOdometre } from '../../components/statistics/compteur_odometre';
import { CarteBadge } from '../../components/statistics/carte_badge';
import { GraphiqueBarresAnime } from '../../components/statistics/graphique_barres_anime';
import { GraphiqueBeignetAnime } from '../../components/statistics/graphique_beignet_anime';
import { ModalDeblocageBadge } from '../../components/statistics/modal_deblocage_badge';

const { width } = Dimensions.get('window');

export default function EcranStatistiquesDetaillees() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { 
    xp, 
    niveau, 
    totalLivresLus, 
    streakSemaines, 
    historiqueMensuel, 
    categoriesFavorites, 
    badges 
  } = utiliserMagasinStatistiques();

  const [badgeSelectionne, setBadgeSelectionne] = useState<any>(null);

  return (
    <View style={[styles.conteneur, { paddingTop: insets.top }]}>
      {/* En-tête avec bouton retour */}
      <View style={styles.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.boutonRetour}>
          <Ionicons name="arrow-back" size={24} color={couleurs.textePrincipal} />
        </TouchableOpacity>
        <Text style={styles.titreHeader}>Tableau de Bord</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Résumé Niveau & XP */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.sectionNiveau}>
          <BarreXPLiquide xp={xp} xpMax={1000} niveau={niveau} />
        </Animated.View>

        {/* Chiffres Clés (Odomètres) */}
        <View style={styles.rangeeStats}>
          <Animated.View entering={FadeInUp.delay(400)} style={styles.carteStat}>
            <CompteurOdometre valeur={totalLivresLus} taillePolice={28} couleur={couleurs.primaire} />
            <Text style={styles.labelStat}>LIVRES LUS</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(600)} style={styles.carteStat}>
            <View style={styles.streakConteneur}>
              <Ionicons name="flame" size={24} color="#f97316" />
              <CompteurOdometre valeur={streakSemaines} taillePolice={28} couleur="#f97316" />
            </View>
            <Text style={styles.labelStat}>SEMAINES STREAK</Text>
          </Animated.View>
        </View>

        {/* Graphique d'Activité */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.sectionGraphe}>
          <Text style={styles.titreSection}>Activité de Lecture</Text>
          <GraphiqueBarresAnime donnees={historiqueMensuel} />
        </Animated.View>

        {/* Répartition par Catégories */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.sectionGraphe}>
          <Text style={styles.titreSection}>Genres Favoris</Text>
          <GraphiqueBeignetAnime donnees={categoriesFavorites} />
        </Animated.View>

        {/* Collection de Badges */}
        <Animated.View entering={FadeInUp.delay(1200)} style={styles.sectionBadges}>
          <Text style={styles.titreSection}>Médailles & Badges</Text>
          <View style={styles.grilleBadges}>
            {badges.map((b) => (
              <CarteBadge key={b.id} badge={b} />
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Déblocage (Action manuelle pour démo si besoin, ou auto-trigger) */}
      <ModalDeblocageBadge 
        visible={badgeSelectionne !== null}
        badge={badgeSelectionne}
        onClose={() => setBadgeSelectionne(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  boutonRetour: {
    padding: 5,
  },
  titreHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
  },
  scrollContent: {
    padding: 20,
  },
  sectionNiveau: {
    marginBottom: 20,
  },
  rangeeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  carteStat: {
    width: (width - 60) / 2,
    backgroundColor: couleurs.carteArrierePlan,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  streakConteneur: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelStat: {
    color: couleurs.texteSecondaire,
    fontSize: 10,
    marginTop: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionGraphe: {
    marginBottom: 30,
  },
  titreSection: {
    color: couleurs.textePrincipal,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionBadges: {
    marginBottom: 20,
  },
  grilleBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
});
