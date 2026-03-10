import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInUp, 
  SlideOutDown, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';

interface ProprietesModal {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalDeconnexion = ({ visible, onClose, onConfirm }: ProprietesModal) => {
  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.conteneur}>
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          style={StyleSheet.absoluteFill}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={onClose} 
            style={StyleSheet.absoluteFill} 
          />
        </Animated.View>

        <Animated.View 
          entering={SlideInUp.springify().damping(15)} 
          exiting={SlideOutDown} 
          style={styles.modal}
        >
          <View style={styles.barreIndicateur} />
          
          <View style={styles.entete}>
            <View style={styles.iconeFond}>
              <Ionicons name="log-out" size={28} color={couleurs.erreur} />
            </View>
            <Text style={styles.titre}>Déconnexion</Text>
            <Text style={styles.sousTitre}>
              Êtes-vous sûr de vouloir vous déconnecter de votre compte BookFlow Card ?
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.boutonAnnuler} onPress={onClose}>
              <Text style={styles.texteAnnuler}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.boutonConfirmer} onPress={onConfirm}>
              <Text style={styles.texteConfirmer}>Se déconnecter</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: couleurs.carteArrierePlan,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  barreIndicateur: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  entete: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconeFond: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 15,
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  boutonAnnuler: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  texteAnnuler: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  boutonConfirmer: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: couleurs.erreur,
    flexDirection: 'row',
    gap: 10,
  },
  texteConfirmer: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
