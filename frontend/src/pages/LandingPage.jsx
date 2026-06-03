import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 mt-16">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight max-w-4xl">
          Settle the Score. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Track the Rivalry.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          The ultimate eFootball match tracking platform. Record scores, analyze
          head-to-head stats, and permanently prove who is the true champion
          among your friends.
        </p>

        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
        >
          Start Tracking for Free
        </Link>
      </main>

      {/* 3. FEATURES GRID */}
      <section className="py-20 mt-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className=" w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner border border-gray-700">
              ⚔️
            </div>
            <h3 className="text-xl font-bold mb-2">Track Every Match</h3>
            <p className="text-gray-400">
              Instantly log goals and opponents. Never argue about who won last
              week again.
            </p>
          </div>
          <div>
            <div className="bg-gray-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner border border-gray-700">
              📊
            </div>
            <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
            <p className="text-gray-400">
              See your exact win rate, total goals scored, and historical
              performance.
            </p>
          </div>
          <div>
            <div className="bg-gray-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner border border-gray-700">
              🏆
            </div>
            <h3 className="text-xl font-bold mb-2">Head-to-Head</h3>
            <p className="text-gray-400">
              Filter stats by specific friends to see who truly dominates the
              matchup.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-800 mt-auto">
        <p>© 2026 RivalRec.</p>
      </footer>
    </div>
  );
}
