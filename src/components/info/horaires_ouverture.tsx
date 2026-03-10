import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinInfosBiblio, Horaire } from '../../store/magasin_infos_biblio';

const PulseStatut = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
  }, []);

  const styleCercle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.conteneurPulse}>
      <Animated.View style={[styles.cerclePulse, styleCercle]} />
      <View style={styles.pointCentral} />
    </View>
  );
};

export const HorairesOuverture = () => {
  const { horaires, estOuverteActuellement } = utiliserMagasinInfosBiblio();
  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const indexActuel = new Date().getDay();
  const jourActuelNom = jours[indexActuel];
  const estOuvert = estOuverteActuellement();

  return (
    <View style={styles.conteneur}>
      <View style={styles.entete}>
        <Text style={styles.titre}>Horaires d'ouverture</Text>
        <View style={styles.badgeStatut}>
          {estOuvert && <PulseStatut />}
          <Text style={[styles.texteStatut, { color: estOuvert ? couleurs.succes : couleurs.erreur }]}>
            {estOuvert ? 'OUVERT' : 'FERMÉ'}
          </Text>
        </View>
      </View>

      <View style={styles.listeHoraires}>
        {horaires.map((h) => {
          const estAujourdhui = h.jour === jourActuelNom;
          return (
            <View 
              key={h.jour} 
              style={[styles.ligneHoraire, estAujourdhui && styles.ligneActive]}
            >
              <Text style={[styles.jour, estAujourdhui && styles.texteActif]}>{h.jour}</Text>
              <Text style={[styles.heures, estAujourdhui && styles.texteActif]}>
                {h.estFerme ? 'Fermé' : `${h.ouverture} — ${h.fermeture}`}
              </Text>
              {estAujourdhui && <View style={styles.indicateurActif} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  badgeStatut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  texteStatut: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listeHoraires: {
    gap: 8,
  },
  ligneHoraire: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ligneActive: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.3)',
  },
  jour: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
  },
  heures: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  texteActif: {
    color: couleurs.primaire,
    fontWeight: 'bold',
  },
  indicateurActif: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: '60%',
    backgroundColor: couleurs.primaire,
    borderRadius: 2,
  },
  conteneurPulse: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cerclePulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: couleurs.succes,
    position: 'absolute',
  },
  pointCentral: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: couleurs.succes,
  }
});
