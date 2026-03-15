import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { utiliserMagasinAuth } from '../../store/magasin_auth';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function EcranAccueil() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { utilisateur, deconnecter } = utiliserMagasinAuth();
  const { couleurs, fs } = useDesignSystem();
  const [rafraichissement, setRafraichissement] = React.useState(false);

  const styles = creerStyles(couleurs, fs);

  const auRafraichissement = React.useCallback(() => {
    setRafraichissement(true);
    // Simulation appel réseau
    setTimeout(() => {
      setRafraichissement(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.conteneurGlobal} edges={['top']}>
      <View style={styles.entete}>
        <View style={styles.profil}>
          <TouchableOpacity 
            style={styles.avatar} 
            activeOpacity={0.7}
            onPress={deconnecter} // Temporaire pour démo
          >
            <Text style={styles.initiale}>{utilisateur?.prenom?.charAt(0) || 'U'}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.salutation}>Bonjour,</Text>
            <Text style={styles.nom}>{utilisateur?.prenom} {utilisateur?.nom}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.boutonNotifications}>
          <Ionicons name="notifications-outline" size={24} color={couleurs.textePrincipal} />
          <View style={styles.pastilleNotification} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.conteneurScroll}
        refreshControl={
          <RefreshControl 
            refreshing={rafraichissement} 
            onRefresh={auRafraichissement}
            tintColor={couleurs.primaire}
          />
        }
      >
        {/* Carte Membre Rapide */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <TouchableOpacity style={styles.carteMembre} activeOpacity={0.9}>
            <View style={styles.enTeteCarte}>
              <Ionicons name="card" size={24} color={couleurs.accentDoré} />
              <Text style={styles.titreCarte}>Carte Numérique</Text>
            </View>
            <Text style={styles.numeroMembre}>{utilisateur?.id}</Text>
            <View style={styles.piedCarte}>
              <Text style={styles.statutCarte}>Statut : Actif</Text>
              <Ionicons name="qr-code-outline" size={28} color={couleurs.textePrincipal} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Section Emprunts Rapide */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <View style={styles.enTeteSection}>
            <Text style={styles.titreSection}>Mes Emprunts</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('Bibliotheque')}>
              <Text style={styles.lienSection}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.carteInfo}>
            <Ionicons name="book-outline" size={32} color={couleurs.primaire} style={styles.iconeInfo} />
            <View style={styles.detailsInfo}>
              <Text style={styles.texteInfoCentral}>Aucun emprunt en cours</Text>
              <Text style={styles.sousTexteInfo}>Découvrez notre catalogue !</Text>
            </View>
          </View>
        </Animated.View>

        {/* Actions Rapides */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
          <Text style={styles.titreSection}>Actions rapides</Text>
          <View style={styles.grilleActions}>
            <BoutonAction 
              icone="search-outline" 
              titre="Catalogue" 
              onPress={() => (navigation as any).navigate('Catalogue')} 
              styles={styles}
              couleurs={couleurs}
              fs={fs}
            />
            <BoutonAction 
              icone="information-circle-outline" 
              titre="Infos" 
              onPress={() => (navigation as any).navigate('InfosBiblio')} 
              styles={styles}
              couleurs={couleurs}
              fs={fs}
            />
            <BoutonAction 
              icone="settings-outline" 
              titre="Réglages" 
              onPress={() => (navigation as any).navigate('Parametres')} 
              styles={styles}
              couleurs={couleurs}
              fs={fs}
            />
            <BoutonAction icone="calendar-outline" titre="Réservations" styles={styles} couleurs={couleurs} fs={fs} />
            <BoutonAction icone="time-outline" titre="Historiques" styles={styles} couleurs={couleurs} fs={fs} />
          </View>
        </Animated.View>
        
        {/* Espace en bas pour la navigation */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const BoutonAction = ({ icone, titre, onPress, styles, couleurs, fs }: any) => (
  <TouchableOpacity style={styles.boutonAction} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.cercleAction}>
      <Ionicons name={icone} size={fs(24)} color={couleurs.primaire} />
    </View>
    <Text style={styles.texteAction}>{titre}</Text>
  </TouchableOpacity>
);

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: couleurs.carteArrierePlan,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordure,
  },
  profil: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: couleurs.estModeSombre ? couleurs.primaireFonce : couleurs.primaireClair,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: couleurs.accentDoré,
  },
  initiale: {
    color: couleurs.textePrincipal,
    fontSize: fs(20),
    fontWeight: 'bold',
  },
  salutation: {
    color: couleurs.texteSecondaire,
    fontSize: fs(14),
  },
  nom: {
    color: couleurs.textePrincipal,
    fontSize: fs(18),
    fontWeight: 'bold',
  },
  boutonNotifications: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: couleurs.estModeSombre ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastilleNotification: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: couleurs.attention,
  },
  conteneurScroll: {
    padding: 24,
  },
  carteMembre: {
    backgroundColor: couleurs.estModeSombre ? couleurs.primaireFonce : couleurs.primaire,
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: couleurs.primaire,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  enTeteCarte: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titreCarte: {
    color: couleurs.accentDoré,
    fontSize: fs(16),
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  numeroMembre: {
    color: couleurs.textePrincipal,
    fontSize: fs(28),
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 24,
  },
  piedCarte: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statutCarte: {
    color: couleurs.estModeSombre ? couleurs.succes : '#FFFFFF',
    fontWeight: '700',
    backgroundColor: couleurs.estModeSombre ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: fs(12),
  },
  section: {
    marginBottom: 30,
  },
  enTeteSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titreSection: {
    fontSize: fs(20),
    fontWeight: '700',
    paddingBottom: 20,
    color: couleurs.textePrincipal,
    marginBottom: 16, 
  },
  lienSection: {
    color: couleurs.primaire,
    fontWeight: '600',
    fontSize: fs(14),
  },
  carteInfo: {
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  iconeInfo: {
    backgroundColor: couleurs.estModeSombre ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  detailsInfo: {
    marginLeft: 16,
  },
  texteInfoCentral: {
    color: couleurs.textePrincipal,
    fontSize: fs(16),
    fontWeight: '600',
    marginBottom: 4,
  },
  sousTexteInfo: {
    color: couleurs.texteSecondaire,
    fontSize: fs(14),
  },
  grilleActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -16, 
  },
  boutonAction: {
    width: '48%',
    backgroundColor: couleurs.carteArrierePlan,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  cercleAction: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: couleurs.estModeSombre ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  texteAction: {
    color: couleurs.textePrincipal,
    fontWeight: '600',
    fontSize: fs(14),
  }
});
