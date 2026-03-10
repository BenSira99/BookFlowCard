import { create } from 'zustand';

export interface Horaire {
  jour: string;
  ouverture: string;
  fermeture: string;
  estFerme: boolean;
}

export interface Evenement {
  id: string;
  titre: string;
  date: string;
  description: string;
  image: string;
  lieu: string;
}

export interface Actualite {
  id: string;
  titre: string;
  contenu: string;
  date: string;
  image: string;
}

export interface FAQ {
  id: string;
  question: string;
  reponse: string;
}

interface EtatInfosBiblio {
  horaires: Horaire[];
  evenements: Evenement[];
  actualites: Actualite[];
  faq: FAQ[];
  adresse: string;
  coordonnees: { latitude: number; longitude: number };
  telephone: string;
  email: string;
  estOuverteActuellement: () => boolean;
}

export const utiliserMagasinInfosBiblio = create<EtatInfosBiblio>((set, get) => ({
  adresse: "12 Rue de la Liberté, 75001 Paris",
  coordonnees: { latitude: 48.8606, longitude: 2.3376 },
  telephone: "01 23 45 67 89",
  email: "contact@bookflowcard.fr",

  horaires: [
    { jour: 'Lundi', ouverture: '09:00', fermeture: '18:00', estFerme: false },
    { jour: 'Mardi', ouverture: '09:00', fermeture: '18:00', estFerme: false },
    { jour: 'Mercredi', ouverture: '09:00', fermeture: '20:00', estFerme: false },
    { jour: 'Jeudi', ouverture: '09:00', fermeture: '18:00', estFerme: false },
    { jour: 'Vendredi', ouverture: '09:00', fermeture: '18:00', estFerme: false },
    { jour: 'Samedi', ouverture: '10:00', fermeture: '17:00', estFerme: false },
    { jour: 'Dimanche', ouverture: '', fermeture: '', estFerme: true },
  ],

  evenements: [
    {
      id: 'e1',
      titre: 'Atelier Écriture Créative',
      date: '15 Mars 2026 - 14h30',
      description: 'Venez libérer votre plume lors de notre atelier mensuel.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400',
      lieu: 'Salle des Miroirs',
    },
    {
      id: 'e2',
      titre: 'Conférence : L\'IA et la Littérature',
      date: '22 Mars 2026 - 18h00',
      description: 'Une exploration des nouveaux horizons de la création littéraire.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400',
      lieu: 'Auditorium Principal',
    }
  ],

  actualites: [
    {
      id: 'a1',
      titre: 'Nouvelle Arrivée : Collection SF',
      contenu: 'Plus de 50 nouveaux titres de science-fiction sont disponibles dès aujourd\'hui !',
      date: '10 Mars 2026',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'a2',
      titre: 'Travaux de Rénovation',
      contenu: 'L\'espace jeunesse sera fermé pour travaux du 15 au 18 Mars.',
      date: '08 Mars 2026',
      image: 'https://images.unsplash.com/photo-1503387762-592dee581106?auto=format&fit=crop&q=80&w=400',
    }
  ],

  faq: [
    {
      id: 'f1',
      question: 'Combien de livres puis-je emprunter ?',
      reponse: 'Vous pouvez emprunter jusqu\'à 5 livres pour une durée de 3 semaines.',
    },
    {
      id: 'f2',
      question: 'Comment prolonger un emprunt ?',
      reponse: 'Vous pouvez prolonger vos emprunts une fois via l\'application ou directement à l\'accueil.',
    },
    {
       id: 'f3',
       question: 'Que faire en cas de perte de ma carte ?',
       reponse: 'Signalez-le immédiatement via l\'application ou par téléphone pour bloquer votre compte.',
    }
  ],

  estOuverteActuellement: () => {
    const maintenant = new Date();
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const jourActuel = jours[maintenant.getDay()];
    const horaire = get().horaires.find(h => h.jour === jourActuel);

    if (!horaire || horaire.estFerme) return false;

    const [hO, mO] = horaire.ouverture.split(':').map(Number);
    const [hF, mF] = horaire.fermeture.split(':').map(Number);
    const debut = hO * 60 + mO;
    const fin = hF * 60 + mF;
    const actu = maintenant.getHours() * 60 + maintenant.getMinutes();

    return actu >= debut && actu <= fin;
  }
}));
