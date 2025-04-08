module.exports = (api) => {
  const target = api.caller((caller) => caller.target);

  api.cache.using(() => JSON.stringify({ target }));

  const presets = ["next/babel"];
  const plugins = [];

  return { presets, plugins };
};
