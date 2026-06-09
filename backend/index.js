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

app.get("/api/tournaments", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const tournaments = await prisma.tournament.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
});

app.post("/api/tournaments", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { name, type, teamCount } = req.body;

    if (!name || !type || !teamCount) {
      return res
        .status(400)
        .json({ error: "Please provide name, type, and team count." });
    }

    // Create the empty tournament
    const tournament = await prisma.tournament.create({
      data: {
        name,
        type,
        teamCount: Number(teamCount),
        userId: session.user.id,
      },
    });

    res.status(201).json(tournament);
  } catch (error) {
    console.error("Failed to create tournament:", error);
    res.status(500).json({ error: "Failed to create tournament" });
  }
});

//  Generate the Bracket
app.post("/api/tournaments/:id/generate", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const tournamentId = req.params.id;
    const { teams } = req.body; // Array of team names e.g., ["Barca", "Real"...]

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });
    if (!tournament || tournament.userId !== session.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Create the Teams in the database
    await prisma.tournamentTeam.createMany({
      data: teams.map((name) => ({ name, tournamentId })),
    });

    // Fetch the newly created teams so we have their IDs
    const dbTeams = await prisma.tournamentTeam.findMany({
      where: { tournamentId },
    });

    // THE BRACKET ALGORITHM (Only runs if it's a Knockout)
    if (tournament.type === "Knockout") {
      const teamCount = tournament.teamCount;
      const totalRounds = Math.log2(teamCount);
      let previousRoundMatches = [];

      for (let round = 1; round <= totalRounds; round++) {
        const matchesInThisRound = teamCount / Math.pow(2, round);
        let currentRoundMatches = [];

        for (let position = 1; position <= matchesInThisRound; position++) {
          let team1Id = null;
          let team2Id = null;

          if (round === 1) {
            team1Id = dbTeams[(position - 1) * 2].id;
            team2Id = dbTeams[(position - 1) * 2 + 1].id;
          }

          const match = await prisma.tournamentMatch.create({
            data: { round, position, team1Id, team2Id, tournamentId },
          });
          currentRoundMatches.push(match);

          // Auto-Advance Wiring
          if (round > 1) {
            const prevMatch1 = previousRoundMatches[(position - 1) * 2];
            const prevMatch2 = previousRoundMatches[(position - 1) * 2 + 1];

            await prisma.tournamentMatch.update({
              where: { id: prevMatch1.id },
              data: { nextMatchId: match.id },
            });
            await prisma.tournamentMatch.update({
              where: { id: prevMatch2.id },
              data: { nextMatchId: match.id },
            });
          }
        }
        previousRoundMatches = currentRoundMatches;
      }
    }

    // Change status from "Setup" to "Active"
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "Active" },
    });

    res.json({ message: "Bracket generated successfully!" });
  } catch (error) {
    console.error("Generation failed:", error);
    res.status(500).json({ error: "Failed to generate bracket" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
