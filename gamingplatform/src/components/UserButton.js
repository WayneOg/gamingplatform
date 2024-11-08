// File: src/components/UserButton.js
"use client";

import { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react'
import Link from 'next/link';


export default function UserProfile() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
  console.log("Stored username from localStorage:", storedUsername); // Debugging statement
  if (storedUsername) {
    setUsername(storedUsername);
  }
}, []);

  const isOnline = true; // Replace this with your actual online status logic

  return (
    <Link href="/login">
      <div className="relative">
        <button className="flex items-center space-x-2">
          <UserCircle className={`w-6 h-6 ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-sm">{username || 'Guest'}</span> {/* Show username or 'Guest' */}
        </button>
      </div>
    </Link>
  );
}
