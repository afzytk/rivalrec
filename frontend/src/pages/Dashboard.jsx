import { Link } from "react-router-dom";
import { authClient } from "../lib/authClient";
import Login from "../components/Login";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  if (isPending) return <div className="min-h-screen"></div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mx-auto mb-16 flex max-w-4xl items-center justify-between">
        <h1 className="text-primary text-4xl font-extrabold tracking-tighter">
          RivalRec ⚽
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-gray-400">
            Welcome, <strong className="text-white">{session.user.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="cursor-pointer font-bold text-red-500 transition-all hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      {/* The Hub Navigation Cards */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Friendlies Card */}
        <Link
          to="/friendlies"
          className="glass-card hover:border-primary group flex cursor-pointer flex-col items-center justify-center p-12 text-center transition-all hover:scale-105"
        >
          <div className="mb-6 text-7xl transition-transform group-hover:scale-110">
            🤝
          </div>
          <h2 className="mb-3 text-3xl font-bold">Friendly Match</h2>
          <p className="text-gray-400">
            Track Head-to-Head stats against your specific rivals.
          </p>
        </Link>

        {/* Tournaments Card */}
        <div className="glass-card flex cursor-not-allowed flex-col items-center justify-center p-12 text-center opacity-60">
          <div className="mb-6 text-7xl grayscale">🏆</div>
          <h2 className="mb-3 text-3xl font-bold">Tournaments</h2>
          <p className="text-primary mt-2 text-sm font-bold tracking-widest uppercase">
            Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
