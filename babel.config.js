module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    ['@babel/preset-env', {
      targets: '> 0.5%, last 2 versions, Firefox ESR, not dead, not IE 11',
      modules: false,
      useBuiltIns: 'usage',
      corejs: 3
    }],
    ['@babel/preset-typescript', { allowDeclareFields: true }]
  ];

  const plugins = [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true
    }]
  ];

  return { presets, plugins };
};
