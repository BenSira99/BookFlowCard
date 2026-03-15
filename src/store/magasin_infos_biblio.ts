import { create } from 'zustand';

export interface Horaire {
  jour: string;
  ouverture: string;
  fermeture: string;
  estFerme: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  reponse: string;
}

interface EtatInfosBiblio {
  horaires: Horaire[];
  faq: FAQ[];
  adresse: string;
  coordonnees: { latitude: number; longitude: number };
  telephone: string;
  email: string;
  estOuverteActuellement: () => boolean;
}

export const utiliserMagasinInfosBiblio = create<EtatInfosBiblio>((set, get) => ({
  adresse: "Collège Saint Exupery de Port-Bouet de Jean Folly",
  coordonnees: { latitude: 48.8606, longitude: 2.3376 },
  telephone: "07 08 04 15 73 / 07 02 80 38 50",
  email: "saintexuperybibliotheque2025@gmail.com",
  horaires: [
    { jour: 'Lundi', ouverture: '08:00', fermeture: '17:00', estFerme: false },
    { jour: 'Mardi', ouverture: '08:00', fermeture: '17:00', estFerme: false },
    { jour: 'Mercredi', ouverture: '08:00', fermeture: '12:00', estFerme: false },
    { jour: 'Jeudi', ouverture: '08:00', fermeture: '17:00', estFerme: false },
    { jour: 'Vendredi', ouverture: '08:00', fermeture: '17:00', estFerme: false },
    { jour: 'Samedi', ouverture: '08:00', fermeture: '17:00', estFerme: false },
    { jour: 'Dimanche', ouverture: '', fermeture: '', estFerme: true }
  ],
  faq: [
    {
      id: 'f1',
      question: 'Combien de livres puis-je emprunter ?',
      reponse: 'Vous pouvez emprunter seulement 1 livre pour une durée de 3 semaines.'
    },
    {
      id: 'f2',
      question: 'Comment prolonger un emprunt ?',
      reponse: 'Vous pouvez prolonger un emprunt 3 fois maximum directement à l\'accueil de la bibliothèque.'
    },
    {
      id: 'f3',
      question: 'Que faire en cas de perte de ma carte ?',
      reponse: 'Allez à la bibliothèque pour refaire votre carte.'
    },
    {
      id: 'f4',
      question: 'Comment se passe une réservation',
      reponse: 'Vous vous rendez à la bibliothèque pour prendre un livre que vous voulez emprunter pour plus tard'
    },
    {
      id: 'f5',
      question: 'Comment se passe une amende',
      reponse: 'Vous etes amendé si vous perdez un livre, si vous détériorez le livre, ou si vous etes en retard vous serez amendé par une somme à payer fixer par la bibliothècaire'
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
