import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';
import { ResultatDeltaTransactions } from '../../store/magasin_transactions';

const { width } = Dimensions.get('window');

/**
 * Écran de Résumé des Transactions (Emprunts, Réservations, Amendes).
 * Affiche les changements détectés suite au scan d'un guichet bibliothèque.
 */
export default function EcranResumeTransactions() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Récupération du delta via les paramètres de navigation
  const { delta } = route.params as { delta: ResultatDeltaTransactions };

  const totalChangements = 
    delta.empruntsAjoutes.length + delta.empruntsModifies.length +
    delta.reservationsAjoutees.length + delta.reservationsModifiees.length +
    delta.amendesAjoutees.length + delta.amendesModifiees.length;

  return (
    <View style={styles.conteneurGlobal}>
      {totalChangements > 0 && (
        <ConfettiCannon 
          count={100} 
          origin={{x: width / 2, y: -20}} 
          fadeOut={true} 
          fallSpeed={3000}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <View style={styles.cercleIcone}>
            <Ionicons name="swap-horizontal" size={60} color={couleurs.primaire} />
          </View>
          <Text style={styles.titre}>Transactions Synchronisées</Text>
          <Text style={styles.sousTitre}>
            {totalChangements > 0 
              ? `Nous avons détecté ${totalChangements} modification(s) sur votre compte.`
              : "Aucun changement majeur détecté sur votre compte."}
          </Text>
        </Animated.View>

        {/* SECTION EMPRUNTS */}
        {(delta.empruntsAjoutes.length > 0 || delta.empruntsModifies.length > 0) && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.enteteSection}>
              <Ionicons name="book" size={20} color={couleurs.primaire} />
              <Text style={styles.titreSection}>Livres & Emprunts</Text>
            </View>
            
            {delta.empruntsAjoutes.map((item, i) => (
              <View key={`add-emp-${i}`} style={styles.carte}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.succes }]} />
                <View style={styles.info}>
                  <Text style={styles.txtPrincipal}>{item.titre}</Text>
                  <Text style={styles.txtSecondaire}>Nouvel emprunt enregistré</Text>
                </View>
                <Ionicons name="add-circle" size={24} color={couleurs.succes} />
              </View>
            ))}

            {delta.empruntsModifies.map((item, i) => (
              <View key={`mod-emp-${i}`} style={styles.carte}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.attention }]} />
                <View style={styles.info}>
                  <Text style={styles.txtPrincipal}>{item.titre}</Text>
                  <Text style={styles.txtSecondaire}>Statut : {item.statut || 'Mis à jour'}</Text>
                </View>
                <Ionicons name="sync-circle" size={24} color={couleurs.attention} />
              </View>
            ))}
          </Animated.View>
        )}

        {/* SECTION RESERVATIONS */}
        {(delta.reservationsAjoutees.length > 0 || delta.reservationsModifiees.length > 0) && (
          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <View style={styles.enteteSection}>
              <Ionicons name="calendar" size={20} color={couleurs.accentDoré} />
              <Text style={styles.titreSection}>Réservations</Text>
            </View>
            
            {delta.reservationsAjoutees.map((item, i) => (
              <View key={`add-res-${i}`} style={styles.carte}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.accentDoré }]} />
                <View style={styles.info}>
                  <Text style={styles.txtPrincipal}>{item.titre}</Text>
                  <Text style={styles.txtSecondaire}>Réservation enregistrée</Text>
                </View>
                <Ionicons name="bookmark" size={22} color={couleurs.accentDoré} />
              </View>
            ))}

            {delta.reservationsModifiees.map((item, i) => (
              <View key={`mod-res-${i}`} style={styles.carte}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.primaireClair }]} />
                <View style={styles.info}>
                  <Text style={styles.txtPrincipal}>{item.titre}</Text>
                  <Text style={styles.txtSecondaire}>Nouveau statut : {item.statut}</Text>
                </View>
                <Ionicons name="notifications-circle" size={24} color={couleurs.primaireClair} />
              </View>
            ))}
          </Animated.View>
        )}

        {/* SECTION AMENDES */}
        {(delta.amendesAjoutees.length > 0 || delta.amendesModifiees.length > 0) && (
          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <View style={styles.enteteSection}>
              <Ionicons name="warning" size={20} color={couleurs.erreur} />
              <Text style={styles.titreSection}>Amendes & Frais</Text>
            </View>
            
            {delta.amendesAjoutees.map((item, i) => (
              <View key={`add-am-${i}`} style={styles.carte}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.erreur }]} />
                <View style={styles.info}>
                  <Text style={styles.txtPrincipal}>{item.motif || 'Amende'}</Text>
                  <Text style={styles.txtSecondaire}>{item.montant} FCFA - À régler</Text>
                </View>
                <Ionicons name="alert-circle" size={24} color={couleurs.erreur} />
              </View>
            ))}

            {delta.amendesModifiees.map((item, i) => (
              <View key={`mod-am-${i}`} style={styles.carte}>
                <View style={[styles.indicateur, { backgroundColor: couleurs.succes }]} />
                <View style={styles.info}>
                  <Text style={styles.txtPrincipal}>{item.motif || 'Amende'}</Text>
                  <Text style={styles.txtSecondaire}>Statut mis à jour : {item.statut}</Text>
                </View>
                <Ionicons name="checkbox" size={24} color={couleurs.succes} />
              </View>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.delay(1000)}>
          <TouchableOpacity 
            style={styles.boutonAction} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.texteBoutonAction}>Terminer</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneurGlobal: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  cercleIcone: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    textAlign: 'center',
  },
  sousTitre: {
    fontSize: 15,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  enteteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  titreSection: {
    fontSize: 18,
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginLeft: 10,
  },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  indicateur: {
    width: 4,
    height: '80%',
    borderRadius: 2,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  txtPrincipal: {
    fontSize: 16,
    fontWeight: '600',
    color: couleurs.textePrincipal,
  },
  txtSecondaire: {
    fontSize: 13,
    color: couleurs.texteSecondaire,
    marginTop: 4,
  },
  boutonAction: {
    backgroundColor: couleurs.primaire,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  texteBoutonAction: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
