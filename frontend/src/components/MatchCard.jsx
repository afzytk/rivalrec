// Accept the onDelete prop
export default function MatchCard({ match, onDelete }) {
  const player1Won = match.player1Goals > match.player2Goals;
  const player2Won = match.player2Goals > match.player1Goals;

  return (
    <div className="group relative flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <button
        onClick={() => onDelete(match.id)}
        className="absolute top-2 right-2 cursor-pointer text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
        title="Delete Match"
      >
        🗑️
      </button>

      <div
        className={`text-center text-xl ${player1Won ? "font-bold text-green-400" : "text-gray-300"}`}
      >
        {match.player1}
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-900 px-6 py-2 text-3xl font-black tracking-widest shadow-inner">
        {match.player1Goals} - {match.player2Goals}
      </div>

      <div
        className={`text-center text-xl ${player2Won ? "font-bold text-green-400" : "text-gray-300"}`}
      >
        {match.player2}
      </div>
    </div>
  );
}
