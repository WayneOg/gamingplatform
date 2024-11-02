import { ArrowRight, Trophy, Users, Gamepad2, Flame, Sword, Crosshair, Car, Football, Chess, Brain  } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import Navbar from '@/components/Navbar';

const FeaturedGames = [
  { title: "League of Legends", players: "2.3M", category: "MOBA" },
  { title: "Valorant", players: "1.8M", category: "FPS" },
  { title: "Minecraft", players: "1.5M", category: "Sandbox" },
  { title: "Fortnite", players: "2.1M", category: "Battle Royale" }
]

const GameCategories = [
  { title: "Action RPG", icon: Sword, games: "245+" },
  { title: "FPS", icon: Crosshair, games: "180+" },
  { title: "Racing", icon: Car, games: "120+" },

  { title: "Puzzle", icon: Brain, games: "300+" },
]


export default function HomePage() {
  return (
  <div className="min-h-screen bg-gray-50">

  <main className="container mx-auto px-4 py-8">
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Your Gateway to <span className="text-blue-600">Gaming Glory</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with millions of gamers worldwide, compete in tournaments, 
          and climb the ranks to become a legend.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold 
            hover:bg-blue-700 flex items-center gap-2">
            Get Started <ArrowRight size={20} />
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold 
            hover:bg-gray-50">
            Browse Games
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">10M+</h3>
          <p className="text-gray-600">Active Players</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center">
          <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">1000+</h3>
          <p className="text-gray-600">Daily Tournaments</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl text-center">
          <Gamepad2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold">100+</h3>
          <p className="text-gray-600">Game Titles</p>
        </div>
      </section>

      
        {/* Game Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Game Categories</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {GameCategories.map((category, index) => (
              <div key={index} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all 
                  cursor-pointer group">
                <div className="flex flex-col items-center text-center">
                  <category.icon className="w-8 h-8 text-blue-600 mb-3 
                    group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.games} Games</p>
                </div>
              </div>
            ))}
          </div>
        </section>


      {/* Trending Games Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="text-orange-500" />
            Trending Games
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">
            View All
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {FeaturedGames.map((game, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4" />
                <h3 className="font-semibold">{game.title}</h3>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{game.category}</span>
                  <span>{game.players} players</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>

     {/* About Section */}
        <section className="mb-16 bg-white rounded-xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">About GameHub</h2>
            <p className="text-gray-600 mb-6">
              GameHub is the ultimate destination for gamers worldwide. We provide a platform 
              where passionate players can connect, compete, and grow together. From casual 
              gaming to professional esports, GameHub offers something for every type of gamer.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Community First</h3>
                <p className="text-sm text-gray-600">Join millions of players and make new friends</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Fair Play</h3>
                <p className="text-sm text-gray-600">Advanced anti-cheat system for fair competition</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Our team is always here to help you</p>
              </div>
            </div>
          </div>
        </section>
      </main>

    {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">GameHub</h3>
              <p className="text-gray-600 text-sm">
                Your ultimate gaming destination for competitive play and community.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Home</a></li>
                <li><a href="#" className="hover:text-blue-600">Games</a></li>
                <li><a href="#" className="hover:text-blue-600">Tournaments</a></li>
                <li><a href="#" className="hover:text-blue-600">Rankings</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Discord</a></li>
                <li><a href="#" className="hover:text-blue-600">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-600">Instagram</a></li>
                <li><a href="#" className="hover:text-blue-600">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 GameHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>

  )
}