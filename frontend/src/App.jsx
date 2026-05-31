import { useState, useEffect } from "react";

const App = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/matches")
      .then((response) => response.json())
      .then((data) => setMatches(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
        RivalRec Match History
      </h1>

      <div className="max-w-2xl mx-auto space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-gray-800 p-6 rounded-lg border border-white-700 flex justify-between items-center shadow-lg"
          >
            <div className="text-xl font-bold">
              <span className="text-blue-400">{match.player1}</span>
              <span className="mx-4 text-gray-500">vs</span>
              <span className="text-red-400">{match.player2}</span>
            </div>

            <div className="text-2xl font-black bg-gray-900 px-4 py-2 rounded">
              {match.score}
            </div>

            <div
              className={`text-sm font-bold uppercase ${match.status === "completed" ? "text-green-500" : "text-yellow-500"}`}
            >
              {match.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
