export default function MatchCard({ match }) {
  const player1Won = match.player1Goals > match.player2Goals;
  const player2Won = match.player2Goals > match.player1Goals;

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex justify-between items-center shadow-lg">
      <div
        className={`text-center text-xl ${player1Won ? "text-green-400 font-bold" : "text-gray-300"}`}
      >
        {match.player1}
      </div>

      <div className="text-3xl font-black bg-gray-900 px-6 py-2 rounded-lg tracking-widest border border-gray-700 shadow-inner">
        {match.player1Goals} - {match.player2Goals}
      </div>

      <div
        className={`text-center text-xl ${player2Won ? "text-green-400 font-bold" : "text-gray-300"}`}
      >
        {match.player2}
      </div>
    </div>
  );
}
