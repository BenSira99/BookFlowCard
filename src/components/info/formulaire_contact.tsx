import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withDelay,
  Easing,
  runOnJS,
  FadeIn
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { couleurs } from '../../theme/couleurs';

export const FormulaireContact = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  // Valeurs animées pour l'avion
  const avionX = useSharedValue(0);
  const avionY = useSharedValue(0);
  const avionRotation = useSharedValue(0);
  const avionOpacite = useSharedValue(1);

  const gererEnvoi = () => {
    if (!email || !message) return;
    
    setEnvoiEnCours(true);
    
    // Animation de décollage (arc vers le haut à droite)
    avionRotation.value = withTiming(-45, { duration: 300 });
    avionX.value = withTiming(300, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    avionY.value = withSequence(
        withTiming(-100, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(-400, { duration: 500, easing: Easing.in(Easing.quad) })
    );
    avionOpacite.value = withDelay(800, withTiming(0, { duration: 200 }));

    // Simulation d'envoi réseau
    setTimeout(() => {
        setEnvoiEnCours(false);
        setEnvoye(true);
        setEmail('');
        setMessage('');
        
        // Reset l'avion après un délai
        setTimeout(() => {
            avionX.value = 0;
            avionY.value = 0;
            avionRotation.value = 0;
            avionOpacite.value = 1;
            setEnvoye(false);
        }, 3000);
    }, 1500);
  };

  const styleAvion = useAnimatedStyle(() => ({
    transform: [
        { translateX: avionX.value },
        { translateY: avionY.value },
        { rotate: `${avionRotation.value}deg` }
    ],
    opacity: avionOpacite.value,
  }));

  return (
    <View style={styles.conteneur}>
      <Text style={styles.titreSection}>Contactez-nous</Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroupe}>
          <Text style={styles.label}>Votre Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="votre@email.com" 
            placeholderTextColor={couleurs.texteSecondaire}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroupe}>
          <Text style={styles.label}>Votre Message</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Que souhaitez-vous nous dire ?" 
            placeholderTextColor={couleurs.texteSecondaire}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity 
          style={[styles.boutonEnvoi, envoye && styles.boutonEnvoye]} 
          onPress={gererEnvoi}
          disabled={envoiEnCours || envoye}
        >
          {envoiEnCours ? (
            <Animated.View style={styleAvion}>
                <Ionicons name="paper-plane" size={24} color="white" />
            </Animated.View>
          ) : envoye ? (
            <Animated.View entering={FadeIn}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
            </Animated.View>
          ) : (
            <View style={styles.labelBouton}>
                <Text style={styles.texteBouton}>Envoyer</Text>
                <Ionicons name="paper-plane-outline" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>
        
        {envoye && (
            <Animated.Text entering={FadeIn} style={styles.messageSucces}>
                Message envoyé avec succès !
            </Animated.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneur: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  titreSection: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  form: {
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputGroupe: {
    marginBottom: 20,
  },
  label: {
    color: couleurs.texteSecondaire,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  boutonEnvoi: {
    backgroundColor: couleurs.primaire,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  boutonEnvoye: {
    backgroundColor: couleurs.succes,
  },
  labelBouton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  texteBouton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageSucces: {
    color: couleurs.succes,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
  }
});
