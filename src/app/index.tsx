import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function AccueilEcran() {
    return (
        <View style={styles.conteneur}>
            <Text style={styles.texte}>Bienvenue sur BookFlowCard</Text>
            <Link href="/(auth)/connexion" style={styles.lien}>Se connecter</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    texte: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    lien: {
        marginTop: 20,
        color: 'blue',
    }
});
