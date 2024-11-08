"use client";

import { useState, useEffect } from 'react';

export default function Rankings() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/games/");
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    }
    fetchRankings();
  }, []);

  const headers = [
    { id: 'rank', label: 'Rank' },
    { id: 'player', label: 'Player' },
    { id: 'points', label: 'Points' },
    { id: 'wins', label: 'Wins' }
  ];

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Rankings</h1>
      {rankings.map((game, gameIndex) => (
        <div key={gameIndex} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{game.name}</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map(header => (
                    <th key={header.id} className="px-4 py-2 text-left">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(game.players) ? (
                  game.players.map((player, playerIndex) => (
                    <tr key={`${gameIndex}-${playerIndex}`} className="border-t">
                      <td className="px-4 py-2">{player.rank}</td>
                      <td className="px-4 py-2">{player.username}</td>
                      <td className="px-4 py-2 text-right">{player.points}</td>
                      <td className="px-4 py-2 text-right">{player.wins}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-center">
                      No players available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
