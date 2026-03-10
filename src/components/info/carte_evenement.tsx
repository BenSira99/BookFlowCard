import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { Evenement } from '../../store/magasin_infos_biblio';

const { width } = Dimensions.get('window');

interface ProprietesCarte {
  evenement: Evenement;
  scrollX?: any; // Pour un futur carrousel si besoin, ici on utilise un scroll vertical global
  scrollY: any;
  index: number;
}

export const CarteEvenement = ({ evenement, scrollY, index }: ProprietesCarte) => {
  const cardHeight = 200;
  const offset = index * (cardHeight + 20);

  const styleImage = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [offset - 400, offset + 400],
      [-30, 30],
      Extrapolate.CLAMP
    );
    return { transform: [{ translateY }] };
  });

  return (
    <View style={styles.conteneur}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Animated.Image 
            source={{ uri: evenement.image }} 
            style={[styles.image, styleImage]} 
          />
          <View style={styles.dateBadge}>
            <Text style={styles.texteDate}>{evenement.date.split(' - ')[0]}</Text>
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.titre} numberOfLines={1}>{evenement.titre}</Text>
          <View style={styles.lieuRow}>
            <Ionicons name="location-outline" size={14} color={couleurs.primaire} />
            <Text style={styles.lieu}>{evenement.lieu}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>{evenement.description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    height: 200,
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  imageWrapper: {
    height: 110,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180, // Plus grande pour le parallax
    resizeMode: 'cover',
    top: -35,
  },
  dateBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: couleurs.primaire,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  texteDate: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  info: {
    padding: 15,
  },
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  lieuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  lieu: {
    fontSize: 12,
    color: couleurs.primaire,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: couleurs.texteSecondaire,
    lineHeight: 18,
  }
});
