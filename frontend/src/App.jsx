import { useState, useEffect } from "react";
import MatchForm from "./components/MatchForm";
import MatchList from "./components/MatchList";
import Login from "./components/Login";
import { authClient } from "./lib/authClient";

function App() {
  const [matches, setMatches] = useState([]);

  // Auth State
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Only fetch matches if the user is logged in
    if (session) {
      fetch("http://localhost:3000/api/matches")
        .then((res) => res.json())
        .then((data) => setMatches(data))
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [session]);

  const handleMatchAdded = (newMatch) => {
    setMatches([newMatch, ...matches]);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  if (isPending) return <div className="min-h-screen bg-gray-900"></div>;

  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header with Logout Button */}
      <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-500">RivalRec ⚽</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            Welcome, <strong className="text-white">{session.user.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded transition-all cursor-pointer text-sm font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      <MatchForm onMatchAdded={handleMatchAdded} />
      <MatchList matches={matches} />
    </div>
  );
}

export default App;
