// File: src/components/UserButton.js
"use client";

import { useState } from 'react'
import { UserCircle } from 'lucide-react'
import Link from 'next/link';

export default function UserButton() {
  const [isOnline, setIsOnline] = useState(true)
  
  return (
    <Link href="/login">
    <div className="relative">
      <button className="flex items-center space-x-2">
        <UserCircle className={`w-6 h-6 ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
        <span className="text-sm">Username</span>
      </button>
    </div>
    </Link>
  )
}
