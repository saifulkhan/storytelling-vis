const withTM = require("next-transpile-modules")([
  // "@fullcalendar/core",
  "@babel/preset-react",
  // "@fullcalendar/common",
  // "@fullcalendar/daygrid",
  // "@fullcalendar/interaction",
  // "@fullcalendar/react",
]);

module.exports = withTM({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  // Ensure React 19 compatibility
  reactStrictMode: true,
});
