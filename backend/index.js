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

app.all("/api/auth/*path", toNodeHandler(auth));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the RivalRec API");
});

app.get("/api/matches", async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(matches);
  } catch (error) {
    console.error("Database error", error);
    res.status(500).json({ error: "failed to fetch matches" });
  }
});

app.post("/api/matches", async (req, res) => {
  try {
    // Verify the user is actually logged in
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { player1, player2, player1Goals, player2Goals } = req.body;

    if (
      !player1 ||
      !player2 ||
      player1Goals === undefined ||
      player2Goals === undefined
    ) {
      return res
        .status(400)
        .json({ error: "Please provide players and their goals" });
    }

    // Save the match
    const newMatch = await prisma.match.create({
      data: {
        player1,
        player2,
        player1Goals: Number(player1Goals),
        player2Goals: Number(player2Goals),
        userId: session.user.id,
      },
    });

    res.status(201).json(newMatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create match" });
  }
});

app.delete("/api/matches/:id", async (req, res) => {
  try {
    // Verify the user is logged in
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const matchId = parseInt(req.params.id);

    // Find the match to make sure it exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) return res.status(404).json({ error: "Match not found" });

    //  SECURITY CHECK: Does this match belong to the logged-in user?
    if (match.userId !== session.user.id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You cannot delete someone else's match" });
    }

    //  Delete the match
    await prisma.match.delete({
      where: { id: matchId },
    });

    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete match" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
