// File: src/components/PlayerCard.js
"use client";

import { useState } from 'react';
import { Shield, Award, Clock } from 'lucide-react';

export const PlayerCard = ({ player }) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={player.avatar || "/api/placeholder/64/64"}
            alt={player.username}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
            player.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold">{player.username}</h3>
          <p className="text-gray-600">{player.rank}</p>
        </div>
        
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-blue-500 hover:text-blue-600"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>

      {showStats && (
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <Shield className="w-6 h-6 mx-auto text-blue-500 mb-1" />
            <div className="text-sm text-gray-600">Win Rate</div>
            <div className="font-bold">{player.winRate}%</div>
          </div>
          <div className="text-center">
            <Award className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
            <div className="text-sm text-gray-600">Tournaments</div>
            <div className="font-bold">{player.tournaments}</div>
          </div>
          <div className="text-center">
            <Clock className="w-6 h-6 mx-auto text-purple-500 mb-1" />
            <div className="text-sm text-gray-600">Play Time</div>
            <div className="font-bold">{player.playTime}h</div>
          </div>
        </div>
      )}
    </div>
  );
};
