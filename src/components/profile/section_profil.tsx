import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { couleurs } from '../../theme/couleurs';

interface ProprietesSection {
  titre: string;
  children: React.ReactNode;
  index: number;
}

/**
 * Section de profil avec animation d'apparition séquentielle (Stagger).
 */
export const SectionProfil = ({ titre, children, index }: ProprietesSection) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 150).springify()}
      style={styles.conteneur}
    >
      <Text style={styles.titre}>{titre}</Text>
      <View style={styles.corps}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginBottom: 25,
    width: '100%',
  },
  titre: {
    fontSize: 16,
    fontWeight: '700',
    color: couleurs.primaire,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  corps: {
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
