import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { authClient } from "../lib/authClient";
import Login from "../components/Login";

export default function TournamentRoom() {
  const { tournamentId } = useParams();
  const { data: session, isPending } = authClient.useSession();

  const [tournament, setTournament] = useState(null);
  const [teamNames, setTeamNames] = useState([]);

  const [editingMatch, setEditingMatch] = useState(null);
  const [editT1Goals, setEditT1Goals] = useState(0);
  const [editT2Goals, setEditT2Goals] = useState(0);

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

          if (data.status === "Pending") {
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

  const openScoreModal = (match) => {
    if (match.status === "Completed") return alert("Match already completed!");
    if (!match.team1Id || !match.team2Id)
      return alert("Waiting for previous rounds to finish!");

    setEditingMatch(match);
    setEditT1Goals(0);
    setEditT2Goals(0);
  };

  // 2. Submits the data from the Modal to Express
  const submitScore = async (e) => {
    e.preventDefault();
    if (editT1Goals === editT2Goals)
      return alert("Knockout matches cannot end in a draw!");

    try {
      const res = await fetch(
        `http://localhost:3000/api/tournaments/${tournamentId}/matches/${editingMatch.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            team1Goals: editT1Goals,
            team2Goals: editT2Goals,
          }),
        },
      );

      if (res.ok) {
        window.location.reload();
      } else {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          alert("Failed to save score: " + err.error);
        } else {
          alert("Server Error: The database might be sleeping or unreachable.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  let champion = null;
  if (tournament && tournament.matches && tournament.matches.length > 0) {
    // Find the highest round number (The Final)
    const maxRound = Math.max(...tournament.matches.map((m) => m.round));
    const finalMatch = tournament.matches.find((m) => m.round === maxRound);

    // If the Final is completed, figure out who scored more goals!
    if (finalMatch && finalMatch.status === "Completed") {
      champion =
        finalMatch.team1Goals > finalMatch.team2Goals
          ? finalMatch.team1
          : finalMatch.team2;
    }
  }

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
      {tournament.status === "Pending" && (
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
        <div className="w-full overflow-x-auto pb-12">
          <div className="flex min-w-max gap-16 px-8">
            {/* Loop through each unique Round (1, 2, 3) and create a column */}
            {Array.from(new Set(tournament.matches.map((m) => m.round))).map(
              (roundNum) => {
                const matchesInRound = tournament.matches.filter(
                  (m) => m.round === roundNum,
                );

                return (
                  <div
                    key={roundNum}
                    className="flex w-72 flex-col justify-around gap-6"
                  >
                    <h3 className="text-primary mb-4 text-center font-bold tracking-widest uppercase">
                      Round {roundNum}
                    </h3>

                    {/* Draw the matches for this specific round */}
                    {matchesInRound.map((match) => (
                      <div
                        key={match.id}
                        className="glass-card relative flex flex-col overflow-hidden"
                      >
                        {/* Team 1 */}
                        <div className="flex items-center justify-between border-b border-gray-700/50 p-4">
                          <span className="font-bold text-gray-200">
                            {match.team1 ? (
                              match.team1.name
                            ) : (
                              <span className="text-gray-600 italic">TBD</span>
                            )}
                          </span>
                          <span className="text-xl font-black">
                            {match.team1Goals ?? "-"}
                          </span>
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center justify-between p-4">
                          <span className="font-bold text-gray-200">
                            {match.team2 ? (
                              match.team2.name
                            ) : (
                              <span className="text-gray-600 italic">TBD</span>
                            )}
                          </span>
                          <span className="text-xl font-black">
                            {match.team2Goals ?? "-"}
                          </span>
                        </div>

                        {/* Update Score Button */}
                        <button
                          onClick={() => openScoreModal(match)}
                          className="bg-primary/20 hover:bg-primary text-primary cursor-pointer py-2 text-center text-xs font-bold transition-colors hover:text-white"
                        >
                          Update Score
                        </button>
                      </div>
                    ))}
                  </div>
                );
              },
            )}

            {/* Champion Column*/}
            {champion && (
              <div className="flex w-72 flex-col justify-around gap-6">
                <h3 className="mb-4 text-center font-bold tracking-widest text-yellow-500 uppercase">
                  Champion 🏆
                </h3>

                <div className="glass-card flex flex-col items-center justify-center border border-yellow-500/50 p-8 shadow-2xl shadow-yellow-500/20">
                  <div className="mb-4 animate-bounce text-6xl">👑</div>
                  <span className="text-center text-3xl font-black text-white">
                    {champion.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="glass-card border-primary/50 relative w-full max-w-md p-8">
            {/* Close Button */}
            <button
              onClick={() => setEditingMatch(null)}
              className="absolute top-4 right-4 cursor-pointer text-xl text-gray-500 hover:text-white"
            >
              ✕
            </button>

            <h3 className="mb-6 text-center text-2xl font-bold text-white">
              Update Score
            </h3>

            <form onSubmit={submitScore}>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="w-full text-center">
                  <label className="mb-2 block truncate px-2 font-bold text-gray-400">
                    {editingMatch.team1.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editT1Goals}
                    onChange={(e) => setEditT1Goals(Number(e.target.value))}
                    className="modern-input py-4 text-center text-4xl font-black"
                  />
                </div>

                <div className="text-xl font-black text-gray-600">VS</div>

                <div className="w-full text-center">
                  <label className="mb-2 block truncate px-2 font-bold text-gray-400">
                    {editingMatch.team2.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editT2Goals}
                    onChange={(e) => setEditT2Goals(Number(e.target.value))}
                    className="modern-input py-4 text-center text-4xl font-black"
                  />
                </div>
              </div>
              <button type="submit" className="modern-button w-full">
                Save Result
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
