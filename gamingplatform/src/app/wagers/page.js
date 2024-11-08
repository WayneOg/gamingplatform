"use client";


import { useState, useEffect } from 'react';

export default function Wagers() {
  const [wagers, setWagers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    game: '',
    amount: '',
  });
  const currentUser = "Player1"; // Simulated current user - replace with actual auth

  useEffect(() => {
    fetchWagers();
  }, []);

  async function fetchWagers() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/wagers/");
      const data = await response.json();
      setWagers(data);
    } catch (error) {
      console.error("Error fetching wagers:", error);
    }
  }

  async function createWager(e) {
    e.preventDefault();
    if (!formData.game || !formData.amount) {
      alert("Please fill in all fields");
      return;
    }

    const newWager = {
      game: formData.game,
      amount: parseFloat(formData.amount),
      players: [currentUser],
      status: "open"
    };

    try {
      const response = await fetch("http://localhost:8000/api/wagers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newWager)
      });
      const data = await response.json();
      setWagers(prevWagers => [...prevWagers, data]);
      setShowCreateForm(false);
      setFormData({ game: '', amount: '' });
    } catch (error) {
      console.error("Error creating wager:", error);
    }
  }

  async function removeWager(wagerId) {
    try {
      await fetch(`http://localhost:8000/api/wagers/${wagerId}/`, {
        method: "DELETE",
      });
      setWagers(prevWagers => prevWagers.filter(wager => wager.id !== wagerId));
    } catch (error) {
      console.error("Error removing wager:", error);
    }
  }

  async function joinWager(wagerId) {
    try {
      const wager = wagers.find(w => w.id === wagerId);
      if (wager.players.length >= 2) {
        alert("This wager already has two players!");
        return;
      }

      if (wager.players.includes(currentUser)) {
        alert("You are already in this wager!");
        return;
      }

      const updatedWager = {
        ...wager,
        players: [...wager.players, currentUser],
        status: "in_progress"
      };

      const response = await fetch(`http://localhost:8000/api/wagers/${wagerId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedWager)
      });

      const data = await response.json();
      setWagers(prevWagers => 
        prevWagers.map(w => w.id === wagerId ? data : w)
      );
    } catch (error) {
      console.error("Error joining wager:", error);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Wagers</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Wager
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Wager</h2>
            <form onSubmit={createWager} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Game</label>
                <input
                  type="text"
                  value={formData.game}
                  onChange={(e) => setFormData({...formData, game: e.target.value})}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                  placeholder="Enter game name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                  min="0"
                  step="0.01"
                  placeholder="Enter wager amount"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {wagers.map(wager => (
          <div key={wager.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{wager.game}</h3>
                <p className="text-gray-600">
                  Players: {wager.players.length === 0 
                    ? "Waiting for players" 
                    : wager.players.join(" vs ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${wager.amount}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  wager.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {wager.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {wager.players.length < 2 && !wager.players.includes(currentUser) && (
                <button 
                  onClick={() => joinWager(wager.id)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Join Wager
                </button>
              )}
              {wager.players[0] === currentUser && (
                <button 
                  onClick={() => removeWager(wager.id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Remove Wager
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}