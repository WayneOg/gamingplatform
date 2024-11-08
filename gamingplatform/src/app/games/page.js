"use client";

import { useEffect, useState } from 'react';
import { GameCard } from '@/components/GameCard';

export default function Games() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/games/')  // Update with your actual backend URL
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error('Error fetching games:', error));
  }, []);

  const handleCreateTournament = async (game) => {
    const formData = {
      name: `${game.title} Tournament`,  // Customize tournament name based on the game
      game: game.id,  // Assuming game.id corresponds to the game reference in the backend
      start_time: new Date().toISOString(),  // Set the start time to now or customize as needed
      prize_pool: game.prizePool || 100,  // Example default value
      entry_fee: game.entryFee || 10,  // Example default value
      max_players: game.maxPlayers || 10,  // Example default value
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tournaments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Tournament created:', data);
        // Optionally, update state or give feedback to the user
      } else {
        console.error('Error creating tournament:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Featured Games</h1>
          <p className="text-gray-300 text-lg">Choose your battlefield and dominate the competition</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              onCreateTournament={handleCreateTournament} // Ensure this prop is passed correctly
            />
          ))}
        </div>
      </div>
    </div>
  );
}
