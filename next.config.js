const withTM = require("next-transpile-modules")([
  "@babel/preset-react",
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [{
              name: "removeViewBox",
              active: false,
            }],
          },
        },
      }],
    });

    return config;
  },
  // This ensures that Next.js can find your pages in the src directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = withTM(nextConfig);
