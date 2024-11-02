"use client";

import { useState, useEffect } from 'react';

export default function Wagers() {
  const [wagers, setWagers] = useState([]);

  // Fetch wagers from the backend
  useEffect(() => {
    async function fetchWagers() {
      try {
        const response = await fetch("http://localhost:8000/api/wagers/");
        const data = await response.json();
        setWagers(data);
      } catch (error) {
        console.error("Error fetching wagers:", error);
      }
    }
    fetchWagers();
  }, []);

  // Function to create a new wager
  async function createWager() {
    const newWager = {
      game: "Counter-Strike 2",
      amount: 50,
      players: ["Player1", "Player2"],
      status: "open"
    };

    try {
      const response = await fetch("http://localhost:8000/api/wagers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newWager)
      });
      const data = await response.json();
      setWagers(prevWagers => [...prevWagers, data]);
    } catch (error) {
      console.error("Error creating wager:", error);
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Wagers</h1>
        <button
          onClick={createWager}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Wager
        </button>
      </div>
      <div className="grid gap-6">
        {wagers.map(wager => (
          <div key={wager.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{wager.game}</h3>
                <p className="text-gray-600">
                  Players: {wager.players.join(" vs ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${wager.amount}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  wager.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {wager.status}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Join Wager
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
