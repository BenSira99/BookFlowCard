import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { couleurs } from '../../theme/couleurs';
import { utiliserMagasinCatalogue } from '../../store/magasin_catalogue';

// Composants
import { BarreRechercheAnimee } from '../../components/catalog/barre_recherche_animee';
import { CarrouselCategories } from '../../components/catalog/carrousel_categories';
import { CarteLivreCatalogue } from '../../components/catalog/carte_livre_catalogue';

export default function EcranCatalogue() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { 
    livres, 
    categories, 
    termeRecherche, 
    setTermeRecherche, 
    filtreCategorie, 
    setFiltreCategorie 
  } = utiliserMagasinCatalogue();

  const livresFiltrer = livres.filter(l => {
    const matchRecherche = l.titre.toLowerCase().includes(termeRecherche.toLowerCase()) || 
                          l.auteur.toLowerCase().includes(termeRecherche.toLowerCase());
    const matchCategorie = !filtreCategorie || l.categorie === categories.find(c => c.id === filtreCategorie)?.nom;
    return matchRecherche && matchCategorie;
  });

  return (
    <View style={[styles.conteneur, { paddingTop: insets.top }]}>
      {/* Barre de recherche animée */}
      <View style={styles.entete}>
        <BarreRechercheAnimee 
          valeur={termeRecherche} 
          onChange={setTermeRecherche}
          onScanPress={() => (navigation as any).navigate('ScannerISBN')}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.titreSection}>Explorer</Text>
        
        {/* Carrousel Parallax */}
        <CarrouselCategories 
          categories={categories} 
          selectionneeId={filtreCategorie}
          onSelect={(id) => setFiltreCategorie(id === filtreCategorie ? null : id)}
        />

        {/* Liste des livres (Waterfall effect via CarteLivreCatalogue) */}
        <View style={styles.listeLivres}>
          {livresFiltrer.map((livre, index) => (
            <CarteLivreCatalogue 
              key={livre.id} 
              livre={livre} 
              index={index}
              onPress={() => (navigation as any).navigate('DetailsLivre', { livreId: livre.id })}
            />
          ))}
          {livresFiltrer.length === 0 && (
            <View style={styles.vide}>
              <Text style={styles.texteVide}>Aucun livre trouvé</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    paddingHorizontal: 20,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titreSection: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
  },
  listeLivres: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  vide: {
    alignItems: 'center',
    padding: 40,
  },
  texteVide: {
    color: couleurs.texteSecondaire,
  }
});

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: couleurs.arrierePlan,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  boutonRetour: {
    padding: 5,
  },
  barreRecherche: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: couleurs.carteArrierePlan,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  entreeRecherche: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    fontSize: 14,
  },
  boutonScanner: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  titreSection: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  sousTexte: {
    color: couleurs.texteSecondaire,
    textAlign: 'center',
    fontSize: 14,
  }
});
