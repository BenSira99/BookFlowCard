import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  Layout, 
  Transition,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinNotifications } from '../../store/magasin_notifications';
import { CarteNotification } from '../../components/notifications/carte_notification';

/**
 * Écran principal du centre de notifications.
 * Affiche la liste chronologique, permet de tout lire ou tout supprimer.
 */
export default function EcranNotifications() {
  const insets = useSafeAreaInsets();
  const { 
    notifications, 
    marquerCommeLu, 
    supprimerNotification, 
    marquerToutCommeLu, 
    toutSupprimer 
  } = utiliserMagasinNotifications();

  const handleToutSupprimer = () => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      'Tout supprimer',
      'Voulez-vous vraiment supprimer toutes vos notifications ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Tout supprimer', style: 'destructive', onPress: toutSupprimer }
      ]
    );
  };

  return (
    <View style={[styles.conteneur, { paddingTop: insets.top }]}>
      {/* En-tête */}
      <View style={styles.entete}>
        <Text style={styles.titre}>Notifications</Text>
        <View style={styles.actionsEntete}>
          <TouchableOpacity 
            style={styles.boutonIcone} 
            onPress={marquerToutCommeLu}
            disabled={notifications.length === 0}
          >
            <Ionicons 
              name="checkmark-done-outline" 
              size={24} 
              color={notifications.length > 0 ? couleurs.primaire : couleurs.texteSecondaire} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.boutonIcone} 
            onPress={handleToutSupprimer}
            disabled={notifications.length === 0}
          >
            <Ionicons 
              name="trash-outline" 
              size={24} 
              color={notifications.length > 0 ? couleurs.erreur : couleurs.texteSecondaire} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <Animated.View 
            entering={FadeIn.duration(600)} 
            exiting={FadeOut}
            style={styles.conteneurVide}
          >
            <View style={styles.iconeVideConteneur}>
              <Ionicons name="notifications-off-outline" size={80} color={couleurs.texteSecondaire} />
              {/* Ici on pourrait mettre un Lottie "Cloche endormie" */}
            </View>
            <Text style={styles.titreVide}>Aucune notification</Text>
            <Text style={styles.messageVide}>
              Tout est calme ici. Vous serez averti dès qu'un livre sera disponible ou qu'un retour approchera.
            </Text>
          </Animated.View>
        ) : (
          notifications.map((notif) => (
            <CarteNotification
              key={notif.id}
              notification={notif}
              surMarquerLu={marquerCommeLu}
              surSupprimer={supprimerNotification}
            />
          ))
        )}
      </ScrollView>

      {notifications.length > 0 && (
        <View style={styles.piedDePage}>
          <Text style={styles.texteStats}>
            {notifications.filter(n => !n.estLu).length} non lues sur {notifications.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
  },
  actionsEntete: {
    flexDirection: 'row',
  },
  boutonIcone: {
    marginLeft: 15,
    padding: 5,
  },
  scrollContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  conteneurVide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  iconeVideConteneur: {
    marginBottom: 20,
    opacity: 0.5,
  },
  titreVide: {
    fontSize: 18,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 10,
  },
  messageVide: {
    fontSize: 14,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    lineHeight: 20,
  },
  piedDePage: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  texteStats: {
    fontSize: 12,
    color: couleurs.texteSecondaire,
  },
});
