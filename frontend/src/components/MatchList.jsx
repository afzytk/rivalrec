import MatchCard from "./MatchCard";

export default function MatchList({ matches }) {
  if (matches.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No matches recorded yet. Play a game!
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold text-gray-400 mb-4">Recent Matches</h2>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
