const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable CSS support
config.resolver.sourceExts.push('css');

// Enable asset support
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Configure the Metro bundler
module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    // Ensure proper resolution of Expo modules
    extraNodeModules: {
      ...config.resolver.extraNodeModules,
    },
  },
  transformer: {
    ...config.transformer,
    // Enable hermes transform
    hermesParser: true,
    // Configure babel transform
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
};