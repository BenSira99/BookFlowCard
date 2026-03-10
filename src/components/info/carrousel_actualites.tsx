import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { Actualite } from '../../store/magasin_infos_biblio';
import { couleurs } from '../../theme/couleurs';

const { width } = Dimensions.get('window');

interface ProprietesCarrousel {
  actualites: Actualite[];
}

export const CarrouselActualites = ({ actualites }: ProprietesCarrousel) => {
  const [indexActuel, setIndexActuel] = useState(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
        opacity.value = withSequence(
            withTiming(0, { duration: 1000 }),
            withTiming(1, { duration: 1000 }, (fini) => {
              if (fini) {
                runOnJS(setIndexActuel)((indexActuel + 1) % actualites.length);
              }
            })
        );
    }, 5000);

    return () => clearInterval(interval);
  }, [indexActuel, actualites.length]);

  const actualite = actualites[indexActuel];

  return (
    <View style={styles.conteneur}>
      <Animated.View key={actualites[indexActuel].id} entering={FadeIn.duration(1000)} exiting={FadeOut.duration(1000)} style={styles.slide}>
        <Image source={{ uri: actualite.image }} style={styles.image} />
        <View style={styles.overlay} />
        <View style={styles.contenu}>
          <Text style={styles.date}>{actualite.date}</Text>
          <Text style={styles.titre}>{actualite.titre}</Text>
        </View>
      </Animated.View>
      
      <View style={styles.pagination}>
        {actualites.map((_, i) => (
          <View 
            key={i} 
            style={[styles.point, i === indexActuel && styles.pointActif]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    height: 200,
    width: width - 40,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: couleurs.carteArrierePlan,
    marginBottom: 30,
    alignSelf: 'center',
  },
  slide: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  contenu: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  date: {
    color: couleurs.primaire,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titre: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    flexDirection: 'row',
    gap: 6,
  },
  point: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pointActif: {
    width: 15,
    backgroundColor: couleurs.primaire,
  }
});
