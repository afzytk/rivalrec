const express = require("express");
const router = express.Router();
const prisma = require("../db");
const auth = require("../auth");

// POST: Log a new match
router.post("/", async (req, res) => {
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

// DELETE: Delete a match
router.delete("/:id", async (req, res) => {
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

module.exports = router;
