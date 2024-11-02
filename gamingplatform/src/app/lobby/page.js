"use client";

import { useState, useEffect } from 'react';

export default function Lobby() {
  const onlinePlayers = [
    { id: 1, username: "Player1", status: "online", game: "Fortnite" },
    { id: 2, username: "Player2", status: "in-game", game: "CS:GO" },
  ];

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  let socket;

  useEffect(() => {
    // Connect to WebSocket server
    socket = new WebSocket("ws://localhost:8000/ws/chat/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChatMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => socket.close(); // Close WebSocket connection on cleanup
  }, []);

  const sendMessage = () => {
    if (socket && message) {
      socket.send(JSON.stringify({ message }));
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Game Lobby</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <div className="h-96 bg-gray-50 rounded mb-4 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded my-1">{msg}</div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border rounded-l"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Online Players</h2>
            <div className="space-y-2">
              {onlinePlayers.map(player => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      player.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span>{player.username}</span>
                  </div>
                  <span className="text-sm text-gray-500">{player.game}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
