const webpack = require('webpack');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com'],
  },
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_API_TOKEN: process.env.GITHUB_API_TOKEN,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
