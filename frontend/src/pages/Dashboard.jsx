import { useState, useEffect } from "react";
import MatchForm from "../components/MatchForm";
import MatchList from "../components/MatchList";
import Login from "../components/Login";
import { authClient } from "../lib/authClient";

function Dashboard() {
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

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/matches/${matchId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setMatches(matches.filter((match) => match.id !== matchId));
      }
    } catch (error) {
      console.error("Failed to delete match:", error);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  if (isPending) return <div className="min-h-screen"></div>;

  if (!session) return <Login />;

  return (
    <div className="min-h-screen p-8">
      {/* Header with Logout Button */}
      <div className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <h1 className="text-primary text-4xl font-extrabold">RivalRec ⚽</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            Welcome, <strong className="text-white">{session.user.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <MatchForm onMatchAdded={handleMatchAdded} />
      <MatchList matches={matches} onDelete={handleDeleteMatch} />
    </div>
  );
}

export default Dashboard;
