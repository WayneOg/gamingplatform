// File: src/app/games/page.js
import { GameCard } from '@/components/GameCard';

export default function Games() {
  const games = [
    {
      id: 1,
      title: "Counter-Strike 2",
      players: "5v5",
      currentPlayers: 1240,
      prizePool: "5,000",
      rating: 4.8,
      image: "/api/placeholder/400/300"
    },
    // Add more games...
  ];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Featured Games</h1>
          <p className="text-gray-300 text-lg">Choose your battlefield and dominate the competition</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}