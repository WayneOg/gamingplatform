"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true at the start of the request
    setError(null); // Clear any previous errors

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed. Please try again.");
        setLoading(false); // Stop loading on failure
        return;
      }

      const data = await response.json();
      console.log("Data from login response:", data);

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      setLoggedInUser(data.username);
      setIsAuthenticated(true);

      checkAuthStatus(); // Check authentication status
      router.push('/'); // Redirect to the dashboard after successful login

    } catch (error) {
      console.error("An error occurred in handleSubmit:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Ensure loading is stopped in both success and error cases
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500" aria-live="assertive">{error}</p>}
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
        <button 
          type="submit" 
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={loading} // Disable button during loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-4 text-sm">
          Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
