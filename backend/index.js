require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { toNodeHandler } = require("better-auth/node");
const prisma = require("./db");
const auth = require("./auth");

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*path", toNodeHandler(auth));

// Fetch all your rivals
app.get("/api/rivals", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const rivals = await prisma.rival.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(rivals);
  } catch (error) {
    console.error("CRITICAL BACKEND ERROR:", error);
    res.status(500).json({ error: "Failed to fetch rivals" });
  }
});

// Add a new rival
app.post("/api/rivals", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { name, team } = req.body;
    if (!name) return res.status(400).json({ error: "Rival name is required" });

    const newRival = await prisma.rival.create({
      data: {
        name,
        team: team || null,
        userId: session.user.id,
      },
    });
    res.status(201).json(newRival);
  } catch (error) {
    res.status(500).json({ error: "Failed to create rival" });
  }
});

// Fetch matches against ONE specific rival
app.get("/api/rivals/:rivalId/matches", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { rivalId } = req.params;

    const matches = await prisma.match.findMany({
      where: {
        userId: session.user.id,
        rivalId: rivalId,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// Log a new match against a rival
app.post("/api/matches", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { rivalId, userGoals, rivalGoals } = req.body;
    if (!rivalId || userGoals === undefined || rivalGoals === undefined) {
      return res.status(400).json({ error: "Missing match data" });
    }

    const newMatch = await prisma.match.create({
      data: {
        userGoals: Number(userGoals),
        rivalGoals: Number(rivalGoals),
        rivalId,
        userId: session.user.id,
      },
    });
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ error: "Failed to create match" });
  }
});

// Delete a match
app.delete("/api/matches/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const matchId = req.params.id;

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) return res.status(404).json({ error: "Match not found" });
    if (match.userId !== session.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.match.delete({ where: { id: matchId } });
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete match" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
