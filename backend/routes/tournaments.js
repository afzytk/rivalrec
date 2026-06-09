const express = require("express");
const router = express.Router();
const prisma = require("../db");
const auth = require("../auth");

// GET: Fetch all tournaments
router.get("/", async (req, res) => {
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

// POST 1: Create the Tournament Shell
router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { name, type, teamCount } = req.body;
    if (!name || !type || !teamCount) {
      return res
        .status(400)
        .json({ error: "Please provide name, type, and team count." });
    }

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
    res.status(500).json({ error: "Failed to create tournament" });
  }
});

// POST 2: Generate the Bracket
router.post("/:id/generate", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const tournamentId = req.params.id;
    const { teams } = req.body;

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });
    if (!tournament || tournament.userId !== session.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.tournamentTeam.createMany({
      data: teams.map((name) => ({ name, tournamentId })),
    });

    const dbTeams = await prisma.tournamentTeam.findMany({
      where: { tournamentId },
    });

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

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "Active" },
    });
    res.json({ message: "Bracket generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate bracket" });
  }
});

module.exports = router;
