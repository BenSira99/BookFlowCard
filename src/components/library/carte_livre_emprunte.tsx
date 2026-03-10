import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { Emprunt } from '../../store/magasin_bibliotheque';
import { CountdownCercle } from './countdown_cercle';

interface ProprietesCarteEmprunt {
  emprunt: Emprunt;
  surProlonger: (id: string) => void;
  surRetourner: (id: string) => void;
}

/**
 * Carte d'un livre emprunté.
 * Supporte le Swipe (Gesture Handler) pour prolonger.
 * Animation 3D de départ lorsqu'un livre est "retourné".
 */
export const CarteLivreEmprunte = ({ emprunt, surProlonger, surRetourner }: ProprietesCarteEmprunt) => {
  const isReturning = useSharedValue(false);

  // Calcul du temps restant (naïf pour l'exemple)
  const mtnt = new Date().getTime();
  const dRetour = new Date(emprunt.dateRetourPrevue).getTime();
  const diffTime = dRetour - mtnt;
  const joursRestants = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const estEnRetard = emprunt.estEnRetard || joursRestants < 0;

  // Animation 3D d'envol
  const styleCarte = useAnimatedStyle(() => {
    if (isReturning.value) {
      return {
        transform: [
          { perspective: 1000 },
          { translateY: withTiming(-200, { duration: 600 }) },
          { rotateZ: withTiming('15deg', { duration: 600 }) },
          { rotateY: withTiming('45deg', { duration: 600 }) },
          { scale: withTiming(0.5, { duration: 600 }) }
        ],
        opacity: withTiming(0, { duration: 500 }),
      };
    }
    return {
      transform: [{ perspective: 1000 }, { scale: 1 }, { translateY: 0 }, { rotateX: '0deg' }],
      opacity: 1,
    };
  });

  const declencherRetour = () => {
    isReturning.value = true;
    setTimeout(() => {
      surRetourner(emprunt.id);
    }, 600); // Raccourci pour callback après l'animation
  };

  const ActionsDroite = (progress: any, dragX: any) => {
    const disableProlongation = emprunt.renouvellementsEffectues >= emprunt.renouvellementsMax;
    
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.actionsDroiteContainer}>
         <TouchableOpacity 
            style={[styles.boutonAction, { backgroundColor: disableProlongation ? couleurs.bordure : couleurs.primaire }]}
            onPress={() => !disableProlongation && surProlonger(emprunt.id)}
            disabled={disableProlongation}
          >
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.texteAction}>
               {disableProlongation ? 'Max Atteint' : 'Prolonger'}
            </Text>
         </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.conteneur, styleCarte]} entering={FadeInRight.springify()}>
      <Swipeable
        renderRightActions={ActionsDroite}
        friction={2}
        rightThreshold={40}
        containerStyle={styles.swipeContainer}
      >
        <View style={[styles.carte, estEnRetard && styles.carteRetard]}>
          <Image source={{ uri: emprunt.imageCouverture }} style={styles.couverture} />
          
          <View style={styles.corps}>
            <Text style={styles.titre} numberOfLines={1}>{emprunt.titre}</Text>
            <Text style={styles.auteur} numberOfLines={1}>{emprunt.auteur}</Text>
            
            <View style={styles.detail}>
              {estEnRetard ? (
                 <Text style={[styles.statut, { color: couleurs.erreur }]}>En Retard ({Math.abs(joursRestants)}j)</Text>
              ) : (
                 <Text style={styles.statut}>Retour le {new Date(emprunt.dateRetourPrevue).toLocaleDateString()}</Text>
              )}
            </View>
          </View>

          <View style={styles.actionsRapides}>
            <CountdownCercle joursRestants={joursRestants} estEnRetard={estEnRetard} />
            <TouchableOpacity style={styles.boutonValider} onPress={declencherRetour}>
               <Ionicons name="checkmark-done" size={20} color={couleurs.accentDoré} />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  swipeContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  carte: {
    flexDirection: 'row',
    backgroundColor: couleurs.carteArrierePlan,
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  carteRetard: {
    borderColor: 'rgba(239, 68, 68, 0.4)', // Bordure rouge fine pour le retard
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  couverture: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  corps: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  titre: {
    color: couleurs.textePrincipal,
    fontSize: 16,
    fontWeight: 'bold',
  },
  auteur: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    marginTop: 2,
  },
  detail: {
    marginTop: 8,
  },
  statut: {
    color: couleurs.texteSecondaire,
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRapides: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boutonValider: {
    marginTop: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsDroiteContainer: {
    width: 100,
  },
  boutonAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  texteAction: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  }
});
