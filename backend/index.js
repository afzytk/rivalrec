const express = require("express");
const cors = require("cors");
const app = express();
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const PORT = 3000;
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
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
    const { player1, player2, player1Goals, player2Goals } = req.body;

    // Validation
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

    // Save to the database using Prisma
    const newMatch = await prisma.match.create({
      data: {
        player1,
        player2,
        player1Goals: Number(player1Goals),
        player2Goals: Number(player2Goals),
      },
    });

    res.status(201).json(newMatch);
  } catch (error) {
    console.error("Failed to create match:", error);
    res.status(500).json({ error: "Failed to create match" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
