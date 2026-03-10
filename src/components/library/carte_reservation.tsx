import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { Reservation } from '../../store/magasin_bibliotheque';

interface ProprietesCarteReservation {
  reservation: Reservation;
  surAnnuler: (id: string) => void;
}

/**
 * Sablier animé en SVG (Custom Premium Animation).
 */
const SablierAnime = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withDelay(1500, withTiming(360, { duration: 1000, easing: Easing.inOut(Easing.ease) }))
      ),
      -1,
      false
    );
  }, []);

  const styleAnime = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }]
  }));

  return (
    <Animated.View style={[styles.conteneurSablier, styleAnime]}>
      <Ionicons name="hourglass-outline" size={24} color={couleurs.attention} />
    </Animated.View>
  );
};

/**
 * File d'attente animée (Avatars empilés).
 */
const FileAttenteAnimee = ({ position }: { position: number }) => {
  const opacite = useSharedValue(0.5);

  useEffect(() => {
    opacite.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const stylePulse = useAnimatedStyle(() => ({
    opacity: opacite.value,
    transform: [{ scale: interpolate(opacite.value, [0.5, 1], [0.95, 1.05]) }]
  }));

  return (
    <View style={styles.fileConteneur}>
      <Text style={styles.texteFile}>Position :</Text>
      <View style={styles.avatars}>
        {/* Avatars devant (anonymes) */}
        {Array.from({ length: Math.min(position, 3) }).map((_, i) => (
          <View key={`avatar-${i}`} style={[styles.avatar, { zIndex: 3 - i, marginLeft: i === 0 ? 0 : -10 }]} />
        ))}
        {/* L'utilisateur (pulse) */}
        <Animated.View style={[styles.avatarUtilisateur, stylePulse, { zIndex: 4, marginLeft: position > 0 ? -10 : 0 }]}>
          <Text style={styles.textePosition}>{position + 1}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export const CarteReservation = ({ reservation, surAnnuler }: ProprietesCarteReservation) => {
  const estDisponible = reservation.estDisponible;

  // Calcul basique pour l'exemple (48h)
  let heuresRestantes = 0;
  if (estDisponible && reservation.dateLimiteRecuperation) {
    const diff = new Date(reservation.dateLimiteRecuperation).getTime() - Date.now();
    heuresRestantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  }

  return (
    <Animated.View style={styles.conteneur} entering={FadeInDown.springify().mass(0.8)}>
      {estDisponible && (
        <View style={styles.glowEffect} />
      )}
      
      <View style={[styles.carte, estDisponible && styles.carteDisponible]}>
        <Image source={{ uri: reservation.imageCouverture }} style={styles.couverture} />
        
        <View style={styles.corps}>
          <Text style={styles.titre} numberOfLines={1}>{reservation.titre}</Text>
          <Text style={styles.auteur} numberOfLines={1}>{reservation.auteur}</Text>
          
          <View style={styles.zoneStatut}>
            {estDisponible ? (
              <View style={styles.dispoConteneur}>
                <SablierAnime />
                <View style={styles.dispoTexte}>
                  <Text style={styles.texteDispo}>Disponible !</Text>
                  <Text style={styles.texteTemps}>Récupérer sous {heuresRestantes}h</Text>
                </View>
              </View>
            ) : (
              <FileAttenteAnimee position={reservation.positionFileAttente} />
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.boutonAnnuler} onPress={() => surAnnuler(reservation.id)}>
          <Ionicons name="close-circle" size={28} color="rgba(255, 255, 255, 0.2)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  carte: {
    flexDirection: 'row',
    backgroundColor: couleurs.carteArrierePlan,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  carteDisponible: {
    borderColor: 'rgba(13, 148, 136, 0.5)',
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: couleurs.primaire,
    borderRadius: 15,
    opacity: 0.1,
    transform: [{ scale: 1.05 }],
  },
  couverture: {
    width: 65,
    height: 100,
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
  zoneStatut: {
    marginTop: 15,
  },
  dispoConteneur: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conteneurSablier: {
    marginRight: 10,
  },
  dispoTexte: {
    justifyContent: 'center',
  },
  texteDispo: {
    color: couleurs.succes,
    fontSize: 13,
    fontWeight: 'bold',
  },
  texteTemps: {
    color: couleurs.attention,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  fileConteneur: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texteFile: {
    color: couleurs.texteSecondaire,
    fontSize: 12,
    marginRight: 10,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: couleurs.carteArrierePlan,
  },
  avatarUtilisateur: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: couleurs.primaire,
    borderWidth: 2,
    borderColor: couleurs.carteArrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textePosition: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  boutonAnnuler: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});
