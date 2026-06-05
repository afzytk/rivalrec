import { useState } from "react";

const initialFormState = {
  player1: "",
  player2: "",
  player1Goals: 0,
  player2Goals: 0,
};

export default function MatchForm({ onMatchAdded }) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newMatch = await response.json();
        onMatchAdded(newMatch);
        setFormData(initialFormState);
      }
    } catch (error) {
      console.error("Error submitting match:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-bold">Report a Match</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <input
            required
            type="text"
            name="player1"
            placeholder="Player 1 Name"
            value={formData.player1}
            onChange={handleChange}
            className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-white"
          />
          <input
            required
            type="number"
            min="0"
            name="player1Goals"
            value={formData.player1Goals}
            onChange={handleChange}
            className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-center text-xl font-bold text-white"
          />
        </div>

        <div className="space-y-2">
          <input
            required
            type="text"
            name="player2"
            placeholder="Player 2 Name"
            value={formData.player2}
            onChange={handleChange}
            className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-white"
          />
          <input
            required
            type="number"
            min="0"
            name="player2Goals"
            value={formData.player2Goals}
            onChange={handleChange}
            className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-center text-xl font-bold text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full cursor-pointer rounded bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-500"
      >
        Save Match Result
      </button>
    </form>
  );
}
