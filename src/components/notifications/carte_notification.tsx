import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { 
  FadeInUp, 
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { couleurs } from '../../theme/couleurs';
import { Notification, TypeNotification } from '../../store/magasin_notifications';

interface ProprietesCarteNotification {
  notification: Notification;
  surMarquerLu: (id: string) => void;
  surSupprimer: (id: string) => void;
}

const ObtenirIconeType = (type: TypeNotification) => {
  switch (type) {
    case 'rappel_retour': return { nom: 'calendar', couleur: couleurs.attention };
    case 'reservation_dispo': return { nom: 'book', couleur: couleurs.primaire };
    case 'alerte': return { nom: 'warning', couleur: couleurs.erreur };
    default: return { nom: 'information-circle', couleur: couleurs.texteSecondaire };
  }
};

export const CarteNotification = ({ notification, surMarquerLu, surSupprimer }: ProprietesCarteNotification) => {
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);

  const gererLecture = () => {
    if (notification.estLu) return;
    
    rippleScale.value = 0;
    rippleOpacity.value = 0.3;
    rippleScale.value = withTiming(4, { duration: 600 });
    rippleOpacity.value = withTiming(0, { duration: 600 });
    
    surMarquerLu(notification.id);
  };

  const styleRipple = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const ActionsDroite = () => (
    <TouchableOpacity 
      style={styles.actionSupprimer} 
      onPress={() => surSupprimer(notification.id)}
    >
      <Ionicons name="trash-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  const icone = ObtenirIconeType(notification.type);

  return (
    <Animated.View 
      entering={FadeInUp.springify().damping(12)} 
      layout={Layout.springify()}
      style={styles.conteneur}
    >
      <Swipeable
        renderRightActions={ActionsDroite}
        friction={2}
        rightThreshold={40}
      >
        <TouchableOpacity 
          style={[styles.carte, notification.estLu && styles.carteLue]} 
          onPress={gererLecture}
          activeOpacity={0.8}
        >
          {/* Effet Ripple */}
          <Animated.View style={[styles.ripple, styleRipple]} />

          <View style={[styles.indicateurType, { backgroundColor: icone.couleur }]} />
          
          <View style={styles.iconeConteneur}>
            <Ionicons name={icone.nom as any} size={24} color={icone.couleur} />
          </View>

          <View style={styles.corps}>
            <View style={styles.entete}>
              <Text style={[styles.titre, notification.estLu && styles.texteLu]}>
                {notification.titre}
              </Text>
              <Text style={styles.date}>
                {formatDistanceToNow(new Date(notification.date), { addSuffix: true, locale: fr })}
              </Text>
            </View>
            <Text style={[styles.message, notification.estLu && styles.texteLu]} numberOfLines={2}>
              {notification.message}
            </Text>
          </View>

          {!notification.estLu && <View style={styles.pointNotification} />}
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 10,
    marginHorizontal: 16,
  },
  carte: {
    flexDirection: 'row',
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  carteLue: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'transparent',
  },
  ripple: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: couleurs.primaire,
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
  },
  indicateurType: {
    position: 'absolute',
    left: 0,
    top: 15,
    bottom: 15,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  iconeConteneur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  corps: {
    flex: 1,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titre: {
    color: couleurs.textePrincipal,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  date: {
    color: couleurs.texteSecondaire,
    fontSize: 10,
  },
  message: {
    color: couleurs.textePrincipal,
    fontSize: 13,
    lineHeight: 18,
  },
  texteLu: {
    color: couleurs.texteSecondaire,
  },
  pointNotification: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: couleurs.primaire,
    alignSelf: 'center',
    marginLeft: 8,
  },
  actionSupprimer: {
    backgroundColor: couleurs.erreur,
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: 16,
    marginLeft: 8,
  },
});
