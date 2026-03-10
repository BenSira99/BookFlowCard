import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinCatalogue } from '../../store/magasin_catalogue';
import { BoutonFavorisAnime } from '../../components/catalog/bouton_favoris_anime';

const { width } = Dimensions.get('window');

export default function EcranDetailsLivre() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { livreId } = route.params as { livreId: string };
  
  const { livres, basculerFavori } = utiliserMagasinCatalogue();
  const livre = livres.find(l => l.id === livreId);

  if (!livre) return null;

  return (
    <View style={styles.conteneur}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête avec Image de couverture */}
        <View style={styles.conteneurImage}>
          <Image source={{ uri: livre.image }} style={styles.image} />
          <View style={[styles.actionsEntete, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.boutonRond}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <BoutonFavorisAnime 
              estFavori={livre.estFavori} 
              onPress={() => basculerFavori(livre.id)} 
              taille={28}
            />
          </View>
        </View>

        <View style={styles.contenu}>
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={styles.categorie}>{livre.categorie.toUpperCase()}</Text>
            <Text style={styles.titre}>{livre.titre}</Text>
            <Text style={styles.auteur}>{livre.auteur}</Text>
          </Animated.View>

          {/* Badges d'info */}
          <View style={styles.rangeeBadges}>
            <View style={styles.badge}>
              <Ionicons name="barcode-outline" size={16} color={couleurs.primaire} />
              <Text style={styles.texteBadge}>{livre.isbn}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="location-outline" size={16} color={couleurs.primaire} />
              <Text style={styles.texteBadge}>{livre.rayon}</Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.titreSection}>Résumé</Text>
            <Text style={styles.description}>{livre.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} style={styles.sectionStatut}>
             <View style={[styles.pointStatut, { backgroundColor: livre.estDisponible ? couleurs.succes : couleurs.erreur }]} />
             <Text style={[styles.texteStatut, { color: livre.estDisponible ? couleurs.succes : couleurs.erreur }]}>
               {livre.estDisponible ? `${livre.exemplairesDisponibles} exemplaires disponibles` : 'Aucun exemplaire disponible'}
             </Text>
          </Animated.View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bouton d'action flottant */}
      <View style={[styles.barreBouton, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity 
          style={[styles.boutonReserver, !livre.estDisponible && styles.boutonDesactive]}
          disabled={!livre.estDisponible}
        >
          <Text style={styles.texteBouton}>Réserver ce livre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  conteneurImage: {
    height: 400,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionsEntete: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  boutonRond: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenu: {
    padding: 24,
    backgroundColor: couleurs.arrierePlan,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  categorie: {
    color: couleurs.primaire,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  auteur: {
    fontSize: 18,
    color: couleurs.texteSecondaire,
    marginBottom: 20,
  },
  rangeeBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  texteBadge: {
    color: 'white',
    fontSize: 12,
  },
  section: {
    marginBottom: 25,
  },
  titreSection: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: couleurs.texteSecondaire,
    lineHeight: 24,
  },
  sectionStatut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 15,
    borderRadius: 16,
  },
  pointStatut: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  texteStatut: {
    fontSize: 14,
    fontWeight: '600',
  },
  barreBouton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: couleurs.arrierePlan,
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  boutonReserver: {
    backgroundColor: couleurs.primaire,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boutonDesactive: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  texteBouton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
