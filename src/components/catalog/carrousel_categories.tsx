import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Categorie } from '../../store/magasin_catalogue';
import { useDesignSystem } from '../../hooks/useDesignSystem';

interface ProprietesCarrousel {
  categories: Categorie[];
  onSelect: (id: string) => void;
  selectionneeId: string | null;
}

const ItemCategorie = ({ categorie, scrollX, index, select, estSelectionnee, couleurs, fs }: any) => {
  const styleImage = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [(index - 1) * 150, index * 150, (index + 1) * 150],
      [-20, 0, 20],
      Extrapolate.CLAMP
    );
    return { transform: [{ translateX }] };
  });

  const styles = creerStyles(couleurs, fs);

  return (
    <TouchableOpacity 
      onPress={() => select(categorie.id)}
      style={[
        styles.carte, 
        estSelectionnee && styles.carteSelectionnee
      ]}
    >
      <View style={styles.imageConteneur}>
        <Animated.Image 
          source={{ uri: categorie.imageFond }} 
          style={[styles.imageFond, styleImage]} 
        />
        <View style={styles.overlay} />
        <Text style={styles.nomCategorie}>{categorie.nom}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const CarrouselCategories = ({ categories, onSelect, selectionneeId }: ProprietesCarrousel) => {
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.conteneur}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={160}
        decelerationRate="fast"
      >
        {categories.map((cat, i) => (
          <ItemCategorie 
            key={cat.id} 
            categorie={cat} 
            index={i} 
            scrollX={scrollX} 
            select={onSelect}
            estSelectionnee={selectionneeId === cat.id}
            couleurs={couleurs}
            fs={fs}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneur: {
    marginVertical: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  carte: {
    width: 140,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: couleurs.carteArrierePlan,
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  carteSelectionnee: {
    borderWidth: 2,
    borderColor: couleurs.primaire,
  },
  imageConteneur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFond: {
    ...StyleSheet.absoluteFillObject,
    width: '140%', // Pour permettre le parallax
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  nomCategorie: {
    color: 'white',
    fontSize: fs(12),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
  }
});
