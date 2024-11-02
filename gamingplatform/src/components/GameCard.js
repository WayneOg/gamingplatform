// File: src/components/GameCard.js
"use client";

import { useState } from 'react';
import { Trophy, Users, Star } from 'lucide-react';

export const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
          {game.currentPlayers} playing
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{game.title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{game.players} per match</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Trophy className="w-4 h-4 mr-2" />
            <span>Prize pool: ${game.prizePool}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-2" />
            <span>{game.rating} / 5.0</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
            Play Now
          </button>
          
          <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
            Create Tournament
          </button>
        </div>
      </div>
    </div>
  );
};