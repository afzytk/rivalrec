const { betterAuth } = require("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const { username } = require("better-auth/plugins");
const prisma = require("./db");

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email & Password Login
  emailAndPassword: {
    enabled: true,
  },

  // Google Login
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  //  Username plugin
  plugins: [username()],
});

module.exports = auth;
