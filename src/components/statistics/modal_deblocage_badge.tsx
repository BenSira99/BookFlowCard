import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withSequence,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { couleurs } from '../../theme/couleurs';
import { Badge } from '../../store/magasin_statistiques';

const { width, height } = Dimensions.get('window');

interface ProprietesModalBadge {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
}

export const ModalDeblocageBadge = ({ visible, badge, onClose }: ProprietesModalBadge) => {
  const vScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      vScale.value = withDelay(300, withSpring(1, { damping: 12 }));
    } else {
      vScale.value = 0;
    }
  }, [visible]);

  const styleBadge = useAnimatedStyle(() => ({
    transform: [{ scale: vScale.value }],
  }));

  if (!badge) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.conteneur}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        
        <Animated.View 
          entering={ZoomIn.duration(400)} 
          style={styles.carte}
        >
          <Text style={styles.labelNouveau}>NOUVEAU BADGE DÉBLOQUÉ !</Text>
          
          <Animated.View style={[styles.iconeEclat, styleBadge]}>
             <Ionicons name={badge.icone as any} size={80} color={couleurs.accentDoré} />
             {/* Particules simulant l'explosion */}
             <View style={styles.rayons}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <View 
                    key={i} 
                    style={[styles.rayon, { transform: [{ rotate: `${i * 30}deg` }, { translateY: -70 }] }]} 
                  />
                ))}
             </View>
          </Animated.View>

          <Text style={styles.titre}>{badge.titre}</Text>
          <Text style={styles.description}>{badge.description}</Text>

          <TouchableOpacity style={styles.boutonFermer} onPress={onClose}>
            <Text style={styles.texteBouton}>Génial !</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  carte: {
    width: width * 0.85,
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    elevation: 20,
    shadowColor: couleurs.accentDoré,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  labelNouveau: {
    color: couleurs.accentDoré,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 40,
  },
  iconeEclat: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  titre: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  boutonFermer: {
    backgroundColor: couleurs.primaire,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  texteBouton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rayons: {
    position: 'absolute',
    width: 1,
    height: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rayon: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: couleurs.accentDoré,
    borderRadius: 2,
    opacity: 0.6,
  }
});
