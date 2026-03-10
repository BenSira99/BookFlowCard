module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react-native', 'security'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-native/all',
        'plugin:security/recommended-legacy',
        'prettier'
    ],
    rules: {
        'react-native/no-inline-styles': 'warn',
        'react-native/no-unused-styles': 'error',
        // Ajoutez ici les règles supplémentaires si nécessaire.
    },
    env: {
        'react-native/react-native': true,
    },
};
