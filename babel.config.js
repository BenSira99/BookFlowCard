module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@services': './src/services',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@store': './src/store',
            '@types': './src/types',
            '@theme': './src/theme',
            '@assets': './src/assets',
            '@config': './src/config',
            '@security': './src/security',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
