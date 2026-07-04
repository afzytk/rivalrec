const express = require("express");
const router = express.Router();
const prisma = require("../db");
const auth = require("../auth");

// GET: Fetch all rivals
router.get("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const rivals = await prisma.rival.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(rivals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rivals" });
  }
});

// POST: Add a new rival
router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { name, team } = req.body;
    if (!name) return res.status(400).json({ error: "Rival name is required" });

    const newRival = await prisma.rival.create({
      data: { name, team: team || null, userId: session.user.id },
    });
    res.status(201).json(newRival);
  } catch (error) {
    res.status(500).json({ error: "Failed to create rival" });
  }
});

// GET: Fetch matches for ONE specific rival
router.get("/:id/matches", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const rivalId = req.params.id;
    const matches = await prisma.match.findMany({
      where: { userId: session.user.id, rivalId: rivalId },
      orderBy: { createdAt: "desc" },
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const rivalId = req.params.id;

    // Security check: Ensure the rival exists and belongs to the user
    const rival = await prisma.rival.findUnique({ where: { id: rivalId } });
    if (!rival) return res.status(404).json({ error: "Rival not found" });
    if (rival.userId !== session.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.rival.delete({ where: { id: rivalId } });
    res.json({ message: "Rival deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete rival" });
  }
});

module.exports = router;
