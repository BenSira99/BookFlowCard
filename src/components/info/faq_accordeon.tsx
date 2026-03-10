import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  useDerivedValue,
  interpolate,
  FadeInDown
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';
import { FAQ } from '../../store/magasin_infos_biblio';

const ItemFAQ = ({ item, index }: { item: FAQ, index: number }) => {
  const [ouvert, setOuvert] = useState(false);
  const animation = useSharedValue(0);

  const toggle = () => {
    setOuvert(!ouvert);
    animation.value = withSpring(ouvert ? 0 : 1, { damping: 15 });
  };

  const styleAccordéon = useAnimatedStyle(() => ({
    height: interpolate(animation.value, [0, 1], [0, 80]), // Ajuste selon le contenu idéalement
    opacity: animation.value,
    marginTop: interpolate(animation.value, [0, 1], [0, 10]),
  }));

  const styleChevron = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(animation.value, [0, 1], [0, 180])}deg` }]
  }));

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
  return (
    <View style={styles.conteneur}>
      <Text style={styles.titreSection}>Questions fréquentes</Text>
      {faq.map((item, index) => (
        <ItemFAQ key={item.id} item={item} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  titreSection: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  item: {
    marginBottom: 12,
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  enteteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  contenuItem: {
    overflow: 'hidden',
  },
  reponse: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    lineHeight: 20,
  }
});
