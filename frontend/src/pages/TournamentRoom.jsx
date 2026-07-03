import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { authClient } from "../lib/authClient";
import Login from "../components/Login";

export default function TournamentRoom() {
  const { tournamentId } = useParams();
  const { data: session, isPending } = authClient.useSession();

  const [tournament, setTournament] = useState(null);
  const [teamNames, setTeamNames] = useState([]);

  useEffect(() => {
    if (session && tournamentId) {
      fetch(`http://localhost:3000/api/tournaments/${tournamentId}`, {
        credentials: "include",
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to fetch tournament");
          }
          return res.json();
        })
        .then((data) => {
          setTournament(data);

          if (data.status === "Setup") {
            setTeamNames(Array(data.teamCount).fill(""));
          }
        })
        .catch((err) => {
          console.error("[Frontend Fetch Error]:", err.message);
          alert("Error loading tournament: " + err.message);
        });
    }
  }, [session, tournamentId]);

  const handleNameChange = (index, value) => {
    const newNames = [...teamNames];
    newNames[index] = value;
    setTeamNames(newNames);
  };

  const handleGenerateBracket = async () => {
    if (teamNames.some((name) => name.trim() === "")) {
      alert("Please fill in all team names!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/tournaments/${tournamentId}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ teams: teamNames }),
        },
      );

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isPending || !tournament) return <div className="min-h-screen"></div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto mb-8 flex max-w-4xl items-end justify-between">
        <div>
          <Link
            to="/tournaments"
            className="text-sm font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-white"
          >
            ← Back to Hub
          </Link>
          <h1 className="mt-4 text-4xl font-extrabold text-white">
            {tournament.name}
          </h1>
        </div>
        <span className="bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-bold tracking-widest uppercase">
          {tournament.status}
        </span>
      </div>

      {/* setup screen */}
      {tournament.status === "Setup" && (
        <div className="glass-card mx-auto max-w-4xl p-8">
          <h2 className="mb-2 text-2xl font-bold">Enter Team Names</h2>
          <p className="mb-8 text-gray-400">
            Fill in the {tournament.teamCount} participants to generate the
            bracket.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {teamNames.map((name, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 font-bold text-gray-500">
                  {index + 1}.
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="modern-input"
                  placeholder={`Team ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleGenerateBracket}
            className="modern-button w-full"
          >
            Generate Bracket 🏆
          </button>
        </div>
      )}

      {/* Active tournament screen */}
      {tournament.status === "Active" && (
        <div className="glass-card mx-auto max-w-4xl p-12 text-center">
          <div className="mb-6 text-6xl">⚙️</div>
          <h2 className="mb-4 text-3xl font-bold text-white">
            Bracket Generated!
          </h2>
          <p className="text-gray-400">
            The complex Express algorithm successfully generated your database
            tree.
          </p>
          <p className="text-primary mt-4 text-sm font-bold tracking-widest uppercase">
            Visual UI Rendering Coming Next...
          </p>
        </div>
      )}
    </div>
  );
}
