const { betterAuth } = require("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const prisma = require("./db");

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://rivalrec.vercel.app",
  trustedOrigins: ["https://rivalrec.vercel.app", "http://localhost:5173"],

  advanced: {
    trustProxy: true,
  },

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
});

module.exports = auth;
