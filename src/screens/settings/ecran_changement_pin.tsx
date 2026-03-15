import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';

import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinSecurite } from '../../store/magasin_securite';

export default function EcranChangementPin() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { changerPin } = utiliserMagasinSecurite();

  const [etape, setEtape] = useState(1); // 1: Ancien, 2: Nouveau, 3: Confirmation
  const [ancienPin, setAncienPin] = useState('');
  const [nouveauPin, setNouveauPin] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [erreur, setErreur] = useState('');

  const secouerAnimation = useSharedValue(0);

  const gererClavier = (chiffre: string) => {
    setErreur('');
    if (etape === 1) {
      if (ancienPin.length < 6) setAncienPin(prev => prev + chiffre);
    } else if (etape === 2) {
      if (nouveauPin.length < 6) setNouveauPin(prev => prev + chiffre);
    } else {
      if (confirmationPin.length < 6) setConfirmationPin(prev => prev + chiffre);
    }
  };

  const effacer = () => {
    if (etape === 1) setAncienPin(prev => prev.slice(0, -1));
    else if (etape === 2) setNouveauPin(prev => prev.slice(0, -1));
    else setConfirmationPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (etape === 1 && ancienPin.length === 6) {
      // Valide l'étape 1
      setEtape(2);
    } else if (etape === 2 && nouveauPin.length === 6) {
      setEtape(3);
    } else if (etape === 3 && confirmationPin.length === 6) {
      validerChangement();
    }
  }, [ancienPin, nouveauPin, confirmationPin]);

  const validerChangement = async () => {
    if (nouveauPin !== confirmationPin) {
      setErreur("Les codes PIN ne correspondent pas.");
      setConfirmationPin('');
      return;
    }

    const resultat = await changerPin(ancienPin, nouveauPin);
    if (resultat.succes) {
      navigation.goBack();
    } else {
      setErreur(resultat.message);
      setAncienPin('');
      setEtape(1);
    }
  };

  const PointsCode = ({ code }: { code: string }) => (
    <View style={styles.conteneurPoints}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View 
          key={i} 
          style={[styles.point, code.length >= i && styles.pointRempli, !!erreur && styles.pointErreur]} 
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.conteneur, { paddingTop: insets.top }]}>
      <View style={styles.entete}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.boutonRetour}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.titreEntete}>Sécurité</Text>
      </View>

      <Animated.View entering={FadeInDown} style={styles.contenu}>
        <Text style={styles.instruction}>
          {etape === 1 && "Entrez votre ancien code PIN"}
          {etape === 2 && "Entrez votre nouveau code PIN"}
          {etape === 3 && "Confirmez votre nouveau code PIN"}
        </Text>
        
        <PointsCode code={etape === 1 ? ancienPin : etape === 2 ? nouveauPin : confirmationPin} />
        
        {erreur ? <Text style={styles.texteErreur}>{erreur}</Text> : null}
      </Animated.View>

      <View style={styles.clavier}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <TouchableOpacity key={n} style={styles.touche} onPress={() => gererClavier(n.toString())}>
            <Text style={styles.texteTouche}>{n}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.toucheVide} />
        <TouchableOpacity style={styles.touche} onPress={() => gererClavier('0')}>
          <Text style={styles.texteTouche}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touche} onPress={effacer}>
          <Ionicons name="backspace-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  boutonRetour: {
    padding: 5,
  },
  titreEntete: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 15,
  },
  contenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  instruction: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    fontWeight: '500',
  },
  conteneurPoints: {
    flexDirection: 'row',
    gap: 20,
  },
  point: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pointRempli: {
    backgroundColor: couleurs.primaire,
    borderColor: couleurs.primaire,
  },
  pointErreur: {
    borderColor: couleurs.erreur,
  },
  texteErreur: {
    color: couleurs.erreur,
    marginTop: 20,
    fontSize: 14,
  },
  clavier: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 100,
    gap: 15,
  },
  touche: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: couleurs.carteArrierePlan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toucheVide: {
    width: 80,
    height: 80,
  },
  texteTouche: {
    fontSize: 28,
    color: 'white',
    fontWeight: '500',
  }
});
