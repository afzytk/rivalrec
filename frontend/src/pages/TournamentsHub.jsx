import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/authClient";
import Login from "../components/Login";

export default function TournamentsHub() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [name, setName] = useState("");
  const [teamCount, setTeamCount] = useState(4);

  useEffect(() => {
    if (session) {
      fetch("http://localhost:3000/api/tournaments", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setTournaments(data);
        })
        .catch((err) => console.error(err));
    }
  }, [session]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, type: "Knockout", teamCount }),
      });
      if (res.ok) {
        const newTournament = await res.json();
        navigate(`/tournaments/${newTournament.id}`);
      } else {
        const errData = await res.json();
        alert("Backend Rejected: " + errData.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend: " + error.message);
    }
  };

  if (isPending) return <div className="min-h-screen"></div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto mb-8 max-w-5xl">
        <Link
          to="/dashboard"
          className="text-sm font-bold tracking-widest text-gray-400 uppercase transition-all hover:text-white"
        >
          ← Back to Hub
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold text-white">Tournaments</h1>
      </div>

      {/* Create Tournament Form */}
      <form
        onSubmit={handleCreate}
        className="glass-card mx-auto mb-12 flex max-w-5xl flex-col items-end gap-4 p-6 md:flex-row"
      >
        <div className="w-full flex-1">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Tournament Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modern-input"
            placeholder="e.g. Weekend Champions Cup"
          />
        </div>
        <div className="w-full md:w-48">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Number of Teams
          </label>
          <select
            value={teamCount}
            onChange={(e) => setTeamCount(Number(e.target.value))}
            className="modern-input cursor-pointer"
          >
            <option value={4}>4 Teams</option>
            <option value={8}>8 Teams</option>
            <option value={16}>16 Teams</option>
          </select>
        </div>
        <button type="submit" className="modern-button w-full md:w-auto">
          Create & Setup →
        </button>
      </form>

      {/* Grid of Existing Tournaments */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        {tournaments.map((t) => (
          <Link
            key={t.id}
            to={`/tournaments/${t.id}`}
            className="glass-card hover:border-primary group block p-6 transition-all"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="group-hover:text-primary text-2xl font-bold text-white transition-colors">
                {t.name}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase ${t.status === "Setup" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}
              >
                {t.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t.type} • {t.teamCount} Teams
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
