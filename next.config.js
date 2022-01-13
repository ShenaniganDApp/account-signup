const webpack = require('webpack');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'],
  },
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
