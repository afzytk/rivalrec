import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <main className="mt-16 flex grow flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl">
          Settle the Score. <br />
          <span className="bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Track the Rivalry.
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
          The ultimate eFootball match tracking platform. Record scores, analyze
          head-to-head stats, and permanently prove who is the true champion
          among your friends.
        </p>

        <Link
          to="/dashboard"
          className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:bg-blue-500"
        >
          Start Tracking for Free
        </Link>
      </main>

      {/* 3. FEATURES GRID */}
      <section className="mt-24 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 text-center md:grid-cols-3">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-700 text-3xl shadow-inner">
              ⚔️
            </div>
            <h3 className="mb-2 text-xl font-bold">Track Every Match</h3>
            <p className="text-gray-400">
              Instantly log goals and opponents. Never argue about who won last
              week again.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-3xl shadow-inner">
              📊
            </div>
            <h3 className="mb-2 text-xl font-bold">Advanced Analytics</h3>
            <p className="text-gray-400">
              See your exact win rate, total goals scored, and historical
              performance.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-3xl shadow-inner">
              🏆
            </div>
            <h3 className="mb-2 text-xl font-bold">Head-to-Head</h3>
            <p className="text-gray-400">
              Filter stats by specific friends to see who truly dominates the
              matchup.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-gray-800 py-8 text-center text-gray-500">
        <p>© 2026 RivalRec.</p>
      </footer>
    </div>
  );
}
