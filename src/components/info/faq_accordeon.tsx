import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  interpolate,
  FadeInDown,
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { FAQ } from '../../store/magasin_infos_biblio';

const ItemFAQ = ({ item, index, couleurs, fs }: { item: FAQ, index: number, couleurs: any, fs: any }) => {
  const [ouvert, setOuvert] = useState(false);
  const animation = useSharedValue(0);

  const toggle = () => {
    const prochainEtat = !ouvert;
    setOuvert(prochainEtat);
    animation.value = withTiming(prochainEtat ? 1 : 0, { 
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1)
    });
  };

  const styleAccordéon = useAnimatedStyle(() => ({
    height: interpolate(animation.value, [0, 1], [0, 150]), // Hauteur accrue pour éviter les coupures
    opacity: animation.value,
    marginTop: interpolate(animation.value, [0, 1], [0, 10]),
  }));

  const styleChevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }]
  }));

  const styles = creerStyles(couleurs, fs);

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.item}>
      <TouchableOpacity 
        style={styles.enteteItem} 
        activeOpacity={0.7} 
        onPress={toggle}
      >
        <Text style={[styles.question, ouvert && { color: couleurs.primaire }]}>{item.question}</Text>
        <Animated.View style={styleChevron}>
          <Ionicons name="chevron-down" size={20} color={ouvert ? couleurs.primaire : couleurs.texteSecondaire} />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.contenuItem, styleAccordéon]}>
        <Text style={styles.reponse}>{item.reponse}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export const FaqAccordeon = ({ faq }: { faq: FAQ[] }) => {
  const { couleurs, fs } = useDesignSystem();
  const styles = creerStyles(couleurs, fs);

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titreSection}>Questions fréquentes</Text>
      {faq.map((item, index) => (
        <ItemFAQ key={item.id} item={item} index={index} couleurs={couleurs} fs={fs} />
      ))}
    </View>
  );
};

const creerStyles = (couleurs: any, fs: any) => StyleSheet.create({
  conteneur: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  titreSection: {
    fontSize: fs(22),
    fontWeight: 'bold',
    color: couleurs.textePrincipal,
    marginBottom: 20,
  },
  item: {
    marginBottom: 12,
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: couleurs.bordure,
  },
  enteteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    color: couleurs.textePrincipal,
    fontSize: fs(15),
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  contenuItem: {
    overflow: 'hidden',
  },
  reponse: {
    color: couleurs.texteSecondaire,
    fontSize: fs(14),
    lineHeight: 20,
  }
});
