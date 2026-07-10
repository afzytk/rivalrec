import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { authClient } from "../lib/authClient";
import Login from "../components/Login";

export default function MatchupRoom() {
  const { rivalId } = useParams();
  const { data: session, isPending } = authClient.useSession();

  const [matches, setMatches] = useState([]);
  const [userGoals, setUserGoals] = useState(0);
  const [rivalGoals, setRivalGoals] = useState(0);

  // Fetch matches
  useEffect(() => {
    if (session && rivalId) {
      fetch(`import.meta.env.VITE_API_URL/api/rivals/${rivalId}/matches`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMatches(data);
          else setMatches([]);
        })
        .catch((err) => console.error(err));
    }
  }, [session, rivalId]);

  // Match analytics
  const totalMatches = matches.length;
  const userWins = matches.filter((m) => m.userGoals > m.rivalGoals).length;
  const rivalWins = matches.filter((m) => m.rivalGoals > m.userGoals).length;
  const draws = totalMatches - userWins - rivalWins;

  // Calculate who is currently leading
  let statusText = "Tied";
  let statusColor = "text-gray-400";
  if (userWins > rivalWins) {
    statusText = "You are dominating 👑";
    statusColor = "text-green-400";
  } else if (rivalWins > userWins) {
    statusText = "Rival is winning 💀";
    statusColor = "text-red-400";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("import.meta.env.VITE_API_URL/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rivalId, userGoals, rivalGoals }),
      });
      if (res.ok) {
        const newMatch = await res.json();
        setMatches([newMatch, ...matches]);
        setUserGoals(0);
        setRivalGoals(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (matchId) => {
    if (!window.confirm("Delete this match?")) return;
    try {
      const res = await fetch(
        `import.meta.env.VITE_API_URL/api/matches/${matchId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        setMatches(matches.filter((m) => m.id !== matchId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isPending) return <div className="min-h-screen"></div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto mb-8 flex max-w-4xl items-end justify-between">
        <div>
          <Link
            to="/friendlies"
            className="text-sm font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-white"
          >
            ← Back to Rivals
          </Link>
          <h1 className="mt-4 text-4xl font-extrabold text-white">
            Matchup Room
          </h1>
        </div>
        {/* The Dynamic Status Text */}
        <div className={`text-xl font-black ${statusColor}`}>
          {totalMatches > 0 ? statusText : "Ready to play"}
        </div>
      </div>

      {totalMatches > 0 && (
        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-3 gap-4">
          <div className="glass-card p-6 text-center">
            <p className="mb-1 text-sm font-bold tracking-widest text-gray-400 uppercase">
              Your Wins
            </p>
            <p className="text-4xl font-black text-green-400">{userWins}</p>
          </div>
          <div className="glass-card border-t-primary border-t-2 p-6 text-center">
            <p className="mb-1 text-sm font-bold tracking-widest text-gray-400 uppercase">
              Total Games
            </p>
            <p className="text-4xl font-black text-white">{totalMatches}</p>
            {draws > 0 && (
              <p className="mt-2 text-xs text-gray-500">{draws} Draws</p>
            )}
          </div>
          <div className="glass-card p-6 text-center">
            <p className="mb-1 text-sm font-bold tracking-widest text-gray-400 uppercase">
              Rival Wins
            </p>
            <p className="text-4xl font-black text-red-400">{rivalWins}</p>
          </div>
        </div>
      )}

      {/* The Match Form */}
      <form
        onSubmit={handleSubmit}
        className="glass-card border-primary/30 mx-auto mb-12 max-w-4xl p-8"
      >
        <h2 className="text-primary mb-6 text-center text-2xl font-bold">
          Log New Match
        </h2>
        <div className="flex items-center justify-center gap-8">
          <div className="w-full text-center">
            <label className="mb-2 block font-bold text-gray-400">You</label>
            <input
              type="number"
              min="0"
              required
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              className="modern-input py-6 text-center text-4xl font-black"
            />
          </div>
          <div className="text-2xl font-black text-gray-600">VS</div>
          <div className="w-full text-center">
            <label className="mb-2 block font-bold text-gray-400">Rival</label>
            <input
              type="number"
              min="0"
              required
              value={rivalGoals}
              onChange={(e) => setRivalGoals(e.target.value)}
              className="modern-input py-6 text-center text-4xl font-black"
            />
          </div>
        </div>
        <button type="submit" className="modern-button mt-8 w-full">
          Save Score
        </button>
      </form>

      {/* Match History */}
      <div className="mx-auto max-w-4xl space-y-4">
        <h3 className="mb-4 text-xl font-bold text-gray-400">
          Head-to-Head History
        </h3>
        {matches.map((match) => (
          <div
            key={match.id}
            className="glass-card group relative flex items-center justify-between p-6 transition-colors hover:border-gray-600"
          >
            <button
              onClick={() => handleDelete(match.id)}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
            >
              🗑️
            </button>
            <div
              className={`text-xl ${match.userGoals > match.rivalGoals ? "font-bold text-green-400" : "text-white"}`}
            >
              You
            </div>
            <div className="rounded-lg border border-white/5 bg-black/50 px-6 py-2 text-3xl font-black tracking-widest shadow-inner">
              {match.userGoals} - {match.rivalGoals}
            </div>
            <div
              className={`text-xl ${match.rivalGoals > match.userGoals ? "font-bold text-red-400" : "text-white"}`}
            >
              Rival
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="glass-card border-dashed border-gray-700 p-8 text-center text-gray-500">
            No matches recorded yet. Who will win the first game?
          </div>
        )}
      </div>
    </div>
  );
}
