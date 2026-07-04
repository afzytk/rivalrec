import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/authClient";
import Login from "../components/Login";

export default function FriendliesHub() {
  const { data: session, isPending } = authClient.useSession();
  const [rivals, setRivals] = useState([]);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");

  // Fetch Rivals securely from Express
  useEffect(() => {
    if (session) {
      fetch("http://localhost:3000/api/rivals", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setRivals(data);
          } else {
            console.error("Backend sent an error instead of an array:", data);
            setRivals([]); // Default to empty array so the page doesn't crash!
          }
        })
        .catch((err) => console.error("Fetch failed:", err));
    }
  }, [session]);

  const handleAddRival = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/rivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, team }),
      });
      if (res.ok) {
        const newRival = await res.json();
        setRivals([newRival, ...rivals]); // Instantly show new rival
        setName("");
        setTeam(""); // Clear form
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteRival = async (e, rivalId) => {
    e.preventDefault();

    if (
      !window.confirm(
        "Delete this rival? ALL matches against them will be permanently lost.",
      )
    )
      return;

    try {
      const res = await fetch(`http://localhost:3000/api/rivals/${rivalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setRivals(rivals.filter((r) => r.id !== rivalId));
      }
    } catch (error) {
      console.error(error);
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
        <h1 className="mt-4 text-4xl font-extrabold text-white">Your Rivals</h1>
      </div>

      {/* Add Rival Form using custom CSS classes */}
      <form
        onSubmit={handleAddRival}
        className="glass-card mx-auto mb-12 flex max-w-5xl flex-col items-end gap-4 p-6 md:flex-row"
      >
        <div className="w-full flex-1">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Rival's Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modern-input"
            placeholder="e.g. Alex"
          />
        </div>
        <div className="w-full flex-1">
          <label className="mb-2 block text-sm font-bold text-gray-400">
            Favorite Team (Optional)
          </label>
          <input
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="modern-input"
            placeholder="e.g. Arsenal"
          />
        </div>
        <button type="submit" className="modern-button w-full md:w-auto">
          + Add Rival
        </button>
      </form>

      {/* Grid of Rivals */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {rivals.map((rival) => (
          <Link
            key={rival.id}
            to={`/friendlies/${rival.id}`}
            className="glass-card hover:border-primary group block cursor-pointer p-6 transition-all"
          >
            <button
              onClick={(e) => handleDeleteRival(e, rival.id)}
              className="absolute top-4 right-4 z-10 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
              title="Delete Rival"
            >
              🗑️
            </button>
            <h3 className="group-hover:text-primary text-2xl font-bold text-white transition-colors">
              {rival.name}
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Main Team:{" "}
              <span className="text-gray-200">{rival.team || "Unknown"}</span>
            </p>
            <div className="text-primary mt-8 inline-block text-sm font-bold transition-transform group-hover:translate-x-2">
              Enter Matchup Room →
            </div>
          </Link>
        ))}
        {rivals.length === 0 && (
          <div className="glass-card col-span-full p-12 text-center text-gray-500">
            No rivals added yet. Add your first friend above!
          </div>
        )}
      </div>
    </div>
  );
}
