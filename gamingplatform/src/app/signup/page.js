"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gameId, setGameId] = useState(''); // State for selected game ID
  const [games, setGames] = useState([]); // State to hold fetched games
  const [message, setMessage] = useState(''); // State for feedback message
  const router = useRouter();

  useEffect(() => {
    // Fetch games from your backend API
    const fetchGames = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/gameslist/"); // Adjust API endpoint as needed
        if (response.ok) {
          const data = await response.json();
          setGames(data); // Assuming the response is an array of game objects
        } else {
          console.error('Failed to fetch games');
        }
      } catch (error) {
        console.error('An error occurred while fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          game_id: gameId, // Include the selected game ID
        }),
      });

      if (response.ok) {
        setMessage('Signup successful! Redirecting to login...'); // Set success message
        setTimeout(() => {
          router.push('/login'); // Redirect to login after a short delay
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Signup failed: ${errorData.error || 'Unknown error'}`); // Set error message
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred while signing up.'); // Set error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Sign Up</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="game_id" className="block text-sm font-medium mb-2">
            Select Game:
          </label>
          <select 
            id="game_id" 
            name="game_id" 
            value={gameId} // Bind the select value to gameId state
            onChange={(e) => setGameId(e.target.value)} // Update gameId state on change
            required
          >
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name} {/* Assuming each game has an id and name */}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>} {/* Display feedback message */}
        <p className="mt-4 text-sm">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </form>
    </div>
  );
}
