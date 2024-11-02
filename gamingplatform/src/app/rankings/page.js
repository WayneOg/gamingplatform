"use client";

import { useState, useEffect } from 'react';

export default function Rankings() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const response = await fetch("http://localhost:8000/api/games/");
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    }
    fetchRankings();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Rankings</h1>
      {rankings.map((game) => (
        <div key={game.name} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{game.name}</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Player</th>
                  <th className="px-4 py-2 text-right">Points</th>
                  <th className="px-4 py-2 text-right">Wins</th>
                </tr>
              </thead>
              <tbody>
                {game.players.map((player) => (
                  <tr key={player.username} className="border-t">
                    <td className="px-4 py-2">{player.rank}</td>
                    <td className="px-4 py-2">{player.username}</td>
                    <td className="px-4 py-2 text-right">{player.points}</td>
                    <td className="px-4 py-2 text-right">{player.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
