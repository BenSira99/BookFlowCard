/**
 * Palette de Couleurs BiblioCard
 */

export const paletteSombre = {
  arrierePlan: '#0F172A',
  carteArrierePlan: '#1E293B',
  primaire: '#0D9488',
  primaireClair: '#14B8A6',
  primaireFonce: '#0F766E',
  accentDoré: '#F59E0B',
  accentDoréClair: '#FCD34D',
  textePrincipal: '#FFFFFF',
  texteSecondaire: '#94A3B8',
  succes: '#10B981',
  erreur: '#EF4444',
  attention: '#F59E0B',
  bordure: '#334155',
  transparent: 'transparent',
  degradePrincipal: ['#0D9488', '#0F766E'],
  degradeCarte: ['#1E293B', '#0F172A'],
};

export const paletteClair = {
  arrierePlan: '#F8FAFC',
  carteArrierePlan: '#FFFFFF',
  primaire: '#0D9488',
  primaireClair: '#0F766E',
  primaireFonce: '#134E4A',
  accentDoré: '#D97706',
  accentDoréClair: '#F59E0B',
  textePrincipal: '#1E293B',
  texteSecondaire: '#64748B',
  succes: '#059669',
  erreur: '#DC2626',
  attention: '#D97706',
  bordure: '#E2E8F0',
  transparent: 'transparent',
  degradePrincipal: ['#14B8A6', '#0D9488'],
  degradeCarte: ['#FFFFFF', '#F1F5F9'],
};

// Par défaut, on garde l'objet pour la compatibilité immédiate (sera remplacé par le hook)
export const couleurs = paletteSombre;
