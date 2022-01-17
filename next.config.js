const webpack = require('webpack');
const { parsed: myEnv } = require('dotenv').config({
  path: './.env',
});

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
  images: {
    domains: ['cdn.discordapp.com'],
  },
};
