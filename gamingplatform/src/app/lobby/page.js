"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

export default function Lobby() {
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const socket = useRef(null);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback((token) => {
    if (socket.current) {
      socket.current.close();
    }

    socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${token}`);

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, message: data.message }
      ]);
    };

    socket.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection error");
    };
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setLoggedInUser(null);
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
  }, []);

  // Check if user is authenticated by verifying JWT token
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      setLoggedInUser(null);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/check-auth/", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
        setLoggedInUser(data.username);
        initializeWebSocket(token);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to check authentication status", error);
      handleLogout();
    }
  }, [handleLogout, initializeWebSocket]);

  // Fetch online players with JWT token
  const fetchOnlinePlayers = useCallback(async () => {
    if (!isAuthenticated || !loggedInUser) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');

      const response = await fetch("http://127.0.0.1:8000/api/online-players", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched online players:", data); // Debugging

      if (Array.isArray(data)) {
        setOnlinePlayers(data);
      } else {
        console.error("API response is not an array:", data);
        setError("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Failed to fetch online players", error);
      setError("Failed to load online players");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, loggedInUser, handleLogout]);

  // Initialize auth check and WebSocket
  useEffect(() => {
    checkAuthStatus();
    const authCheckInterval = setInterval(checkAuthStatus, 30000);
    return () => {
      clearInterval(authCheckInterval);
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [checkAuthStatus]);

  // Fetch online players when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOnlinePlayers();
      const interval = setInterval(fetchOnlinePlayers, 30000);
      return () => clearInterval(interval);
    } else {
      setOnlinePlayers([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchOnlinePlayers]);

  const sendMessage = useCallback(() => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN && message.trim()) {
      socket.current.send(JSON.stringify({
        message: message.trim(),
      }));
      setMessage("");
    } else if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not open, attempting to reconnect...");
      checkAuthStatus();
    }
  }, [message, checkAuthStatus]);

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Game Lobby</h1>
      {loggedInUser && (
        <p className="mb-4 text-green-600">Welcome, {loggedInUser}!</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <div className="h-96 bg-gray-50 rounded mb-4 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded my-1 ${
                    msg.username === loggedInUser 
                      ? 'bg-blue-100 ml-4' 
                      : 'bg-gray-100 mr-4'
                  }`}
                >
                  <strong>{msg.username}:</strong> {msg.message}
                </div>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-l"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            ) : (
              <p className="text-red-500">Please log in to send messages.</p>
            )}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Online Players</h2>
            <div className="space-y-2">
              {!isAuthenticated ? (
                <div className="text-red-500">Please log in to view online players</div>
              ) : isLoading ? (
                <div className="text-gray-500">Loading players...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : onlinePlayers.length === 0 ? (
                <div className="text-gray-500">No players online</div>
              ) : (
                onlinePlayers.map((player) => (
                  <div
                    key={`player-${player.username}`}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${player.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span>{player.username}</span>
                    </div>
                    <span className="text-sm text-gray-500">{player.game || 'No game'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
