/**
 * Palette de Couleurs BiblioCard
 * Teal Premium × Navy Marine
 */

export const couleurs = {
  // Fond principal de l'application (Navy Deep)
  arrierePlan: '#0F172A',
  
  // Fond pour les cartes et éléments surélevés (Navy Card)
  carteArrierePlan: '#1E293B',

  // Couleur primaire (Teal)
  primaire: '#0D9488', // Teal 600
  primaireClair: '#14B8A6', // Teal 500 (Hover/Press)
  primaireFonce: '#0F766E', // Teal 700
  
  // Accents dorés pour éléments premium/succès
  accentDoré: '#F59E0B', // Amber 500
  accentDoréClair: '#FCD34D', // Amber 300
  
  // Textes
  textePrincipal: '#FFFFFF', // Texte sur fond sombre
  texteSecondaire: '#94A3B8', // Slate 400 (Sous-titres, placeholders)
  
  // États de validation
  succes: '#10B981', // Emerald 500
  erreur: '#EF4444', // Red 500
  attention: '#F59E0B', // Amber 500
  
  // Divers
  bordure: '#334155', // Slate 700
  transparent: 'transparent',
  
  // Dégradés (utiliser avec expo-linear-gradient)
  degradePrincipal: ['#0D9488', '#0F766E'], // Teal Gradient
  degradeCarte: ['#1E293B', '#0F172A'], // Navy Gradient
};
