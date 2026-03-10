import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  FadeIn
} from 'react-native-reanimated';
import { CameraView, useCameraPermissions } from 'expo-camera'; // SDK 55
import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinCatalogue } from '../../store/magasin_catalogue';
import { serviceSynchroQR } from '../../services/service_synchro_qr';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

export default function EcranScannerISBN() {
  const navigation = useNavigation();
  const laserY = useSharedValue(0);
  const [permission, requestPermission] = useCameraPermissions();
  const { rechercherParISBN } = utiliserMagasinCatalogue();

  useEffect(() => {
    laserY.value = withRepeat(
      withTiming(250, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const styleLaser = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }]
  }));

  if (!permission) {
    return <View style={styles.conteneur} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.conteneur}>
        <Text style={styles.texteInformation}>Caméra requise pour scanner.</Text>
        <TouchableOpacity style={styles.boutonPermission} onPress={requestPermission}>
          <Text style={styles.texteBouton}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gererScan = (data: string) => {
    // 1. Tenter une synchronisation (QR JSON)
    const resultatSync = serviceSynchroQR.traiterScan(data);
    
    if (resultatSync.success) {
      Alert.alert('Succès', resultatSync.message);
      navigation.goBack();
      return;
    }

    // 2. Si ce n'est pas un QR de synchro, on teste l'ISBN
    const livre = rechercherParISBN(data);
    if (livre) {
      (navigation as any).navigate('DetailsLivre', { livreId: livre.id });
    }
  };

  return (
    <View style={styles.conteneur}>
      <CameraView 
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={({ data }) => gererScan(data)}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'qr'] }}
      />
      
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.boutonFermer} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.viseurConteneur}>
           <View style={styles.viseur}>
              <View style={[styles.coin, styles.coinHA]} />
              <View style={[styles.coin, styles.coinHB]} />
              <View style={[styles.coin, styles.coinBA]} />
              <View style={[styles.coin, styles.coinBB]} />
              
              <Animated.View style={[styles.laser, styleLaser]} />
           </View>
        </View>

        <Text style={styles.instruction}>Placez l'ISBN dans le cadre</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boutonFermer: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  viseurConteneur: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viseur: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  coin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: couleurs.primaire,
    borderWidth: 4,
  },
  coinHA: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  coinHB: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  coinBA: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  coinBB: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  laser: {
    height: 2,
    backgroundColor: couleurs.primaire,
    width: '100%',
    shadowColor: couleurs.primaire,
    shadowRadius: 10,
    shadowOpacity: 1,
    zIndex: 10,
  },
  instruction: {
    color: 'white',
    marginTop: 40,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  texteInformation: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  boutonPermission: {
    backgroundColor: couleurs.primaire,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  texteBouton: {
    color: 'white',
    fontWeight: 'bold',
  }
});
