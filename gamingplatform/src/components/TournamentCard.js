// File: src/components/TournamentCard.js
export const TournamentCard = ({ tournament }) => {
    const timeRemaining = tournament.startTime - Date.now();
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={tournament.image || "/api/placeholder/400/200"}
            alt={tournament.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold">{tournament.name}</h3>
            <p className="text-sm opacity-90">{tournament.game}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Starts in {days} days
            </div>
            <div className="text-lg font-bold text-green-600">
              ${tournament.prizePool}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Entry Fee</span>
              <span className="font-medium">${tournament.entryFee}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Players</span>
              <span className="font-medium">{tournament.players}/{tournament.maxPlayers}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${(tournament.players / tournament.maxPlayers) * 100}%` }}
              />
            </div>
          </div>
          
          <button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
            Join Tournament
          </button>
        </div>
      </div>
    );
  };
  