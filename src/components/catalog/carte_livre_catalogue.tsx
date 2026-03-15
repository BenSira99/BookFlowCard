import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { Livre } from '../../store/magasin_catalogue';

interface ProprietesCarteLivre {
  livre: Livre;
  index: number;
  onPress: () => void;
}

/**
 * Pastille de disponibilité animée (effet "breathing").
 */
const PastilleDisponibilite = ({ disponible, couleurs, fs }: { disponible: boolean, couleurs: any, fs: any }) => {
  const opacite = useSharedValue(0.6);

  React.useEffect(() => {
    if (disponible) {
      opacite.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
    }
  }, [disponible]);

  const styleAnime = useAnimatedStyle(() => ({
    opacity: disponible ? opacite.value : 0.5,
    transform: [{ scale: disponible ? withRepeat(withTiming(1.2, { duration: 1500 }), -1, true) : 1 }]
  }));

  const styles = creerStyles(couleurs, fs);

  return (
    <View style={styles.conteneurPastille}>
      <Animated.View 
        style={[
          styles.pastille, 
          { backgroundColor: disponible ? couleurs.succes : couleurs.erreur },
          styleAnime
        ]} 
      />
      <Text style={[styles.textePastille, { color: disponible ? couleurs.succes : couleurs.erreur }]}>
        {disponible ? 'Disponible' : 'Indisponible'}
      </Text>
    </View>
  );
};

export const CarteLivreCatalogue = ({ livre, index, onPress }: ProprietesCarteLivre) => {
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

  return (
    <View style={styles.conteneur}>
      <TouchableOpacity style={styles.carte} activeOpacity={0.8} onPress={onPress}>
        <Image source={{ uri: livre.image }} style={styles.couverture} />
        
        <View style={styles.info}>
          <View>
            <Text style={styles.categorie}>{livre.categorie.toUpperCase()}</Text>
            <Text style={styles.titre} numberOfLines={2}>{livre.titre}</Text>
            <Text style={styles.auteur}>{livre.auteur}</Text>
          </View>
          
          <View style={styles.pied}>
            <PastilleDisponibilite disponible={livre.estDisponible} couleurs={couleurs} fs={fs} />
            <TouchableOpacity style={styles.boutonFavori}>
               <Ionicons name={livre.estFavori ? "heart" : "heart-outline"} size={22} color={livre.estFavori ? couleurs.erreur : couleurs.textePrincipal} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneur: {
    width: '100%',
    marginBottom: 16,
  },
  carte: {
    flexDirection: 'row',
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  couverture: {
    width: 100,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  categorie: {
    fontSize: fs(10),
    fontWeight: 'bold',
    color: couleurs.primaire,
    letterSpacing: 1,
    marginBottom: 4,
  },
  titre: {
    fontSize: fs(16),
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 2,
  },
  auteur: {
    fontSize: fs(13),
    color: couleurs.texteSecondaire,
  },
  pied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  conteneurPastille: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pastille: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  textePastille: {
    fontSize: fs(11),
    fontWeight: '600',
  },
  boutonFavori: {
    padding: 4,
  }
});
