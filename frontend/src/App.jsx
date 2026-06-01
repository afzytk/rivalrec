import { useState, useEffect } from "react";
import MatchForm from "./components/MatchForm";
import MatchList from "./components/MatchList";

function App() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleMatchAdded = (newMatch) => {
    setMatches([newMatch, ...matches]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-extrabold text-blue-500 mb-8 text-center">
        RivalRec ⚽
      </h1>

      <MatchForm onMatchAdded={handleMatchAdded} />
      <MatchList matches={matches} />
    </div>
  );
}

export default App;
