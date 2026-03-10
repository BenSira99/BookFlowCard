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
import { TransactionReservation } from '../../store/magasin_transactions';

interface ProprietesCarteReservation {
  reservation: TransactionReservation;
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

export const CarteReservation = ({ reservation, surAnnuler }: ProprietesCarteReservation) => {
  const statut = reservation.statut?.toLowerCase() || 'en cours';
  const estValidee = statut === 'validée';
  const estAnnulee = statut === 'annulée';
  const estExpirée = statut === 'expirée';

  // Calcul temps de récupération si validée
  let heuresRestantes = 0;
  if (estValidee && reservation.date_expiration_reservation) {
    const diff = new Date(reservation.date_expiration_reservation).getTime() - Date.now();
    heuresRestantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  }

  return (
    <Animated.View style={styles.conteneur} entering={FadeInDown.springify().mass(0.8)}>
      {estValidee && (
        <View style={styles.glowEffect} />
      )}
      
      <View style={[styles.carte, estValidee && styles.carteDisponible]}>
        <View style={styles.couverturePlaceholder}>
          <Ionicons name="bookmark" size={30} color={couleurs.texteSecondaire} />
        </View>
        
        <View style={styles.corps}>
          <Text style={styles.titre} numberOfLines={1}>{reservation.titre}</Text>
          <Text style={styles.auteur} numberOfLines={1}>{reservation.auteur}</Text>
          
          <View style={styles.zoneStatut}>
            {estValidee ? (
              <View style={styles.dispoConteneur}>
                <SablierAnime />
                <View style={styles.dispoTexte}>
                  <Text style={styles.texteDispo}>Disponible au guichet !</Text>
                  <Text style={styles.texteTemps}>Récupérer sous {heuresRestantes}h</Text>
                </View>
              </View>
            ) : (
              <View style={styles.fileConteneur}>
                <Ionicons name="time-outline" size={16} color={couleurs.texteSecondaire} style={{ marginRight: 5 }} />
                <Text style={styles.texteFile}>Statut : {reservation.statut || 'En attente'}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.boutonAnnuler} 
          onPress={() => surAnnuler(String(reservation.id_reservation))}
        >
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
  couverturePlaceholder: {
    width: 65,
    height: 100,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
  },
  boutonAnnuler: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});
