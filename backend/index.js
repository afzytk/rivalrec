require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { toNodeHandler } = require("better-auth/node");
const auth = require("./auth");

// Import Routers
const matchRoutes = require("./routes/matches");
const rivalRoutes = require("./routes/rivals");
const tournamentRoutes = require("./routes/tournaments");

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Auth Route
app.all("/api/auth/*path", toNodeHandler(auth));

// Directing URLs to the correct files
app.use("/api/matches", matchRoutes);
app.use("/api/rivals", rivalRoutes);
app.use("/api/tournaments", tournamentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
