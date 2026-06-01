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
      className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg mb-8 shadow-lg border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-4">Report a Match</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <input
            required
            type="text"
            name="player1"
            placeholder="Player 1 Name"
            value={formData.player1}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
          />
          <input
            required
            type="number"
            min="0"
            name="player1Goals"
            value={formData.player1Goals}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-bold text-center text-xl"
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
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
          />
          <input
            required
            type="number"
            min="0"
            name="player2Goals"
            value={formData.player2Goals}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white font-bold text-center text-xl"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-all cursor-pointer"
      >
        Save Match Result
      </button>
    </form>
  );
}
