"use client";

import { useState, useEffect } from 'react';
import { TournamentCard } from '@/components/TournamentCard';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tournaments/");
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    }
    fetchTournaments();
  }, []);

  const handleRemoveTournament = (tournamentId) => {
    console.log(`Removing tournament with id: ${tournamentId}`); // Debug log
    setTournaments(prevTournaments => prevTournaments.filter(t => t.id !== tournamentId));
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Live Tournaments</h1>
          <p className="text-gray-300 text-lg">Compete for glory and prizes</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map(tournament => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onRemove={handleRemoveTournament} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
