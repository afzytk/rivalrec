const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("This is the RivalRec API");
});

app.get("/api/matches", (req, res) => {
  const dummyMatches = [
    {
      id: 1,
      player1: "Messi10",
      player2: "Ronaldo7",
      score: "2-1",
      status: "completed",
    },
    {
      id: 2,
      player1: "NeymarJr",
      player2: "Mbappe9",
      score: "0-0",
      status: "disputed",
    },
  ];
  res.json(dummyMatches);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
