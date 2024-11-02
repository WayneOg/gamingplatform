// File: src/components/Navbar.js
import Link from 'next/link'
import  UserButton  from '@/components/UserButton'


export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">GameHub</Link>
          <div className="flex space-x-4">
            <Link href="/lobby" className="hover:text-gray-300">Lobby</Link>
            <Link href="/games" className="hover:text-gray-300">Games</Link>
            <Link href="/rankings" className="hover:text-gray-300">Rankings</Link>
            <Link href="/wagers" className="hover:text-gray-300">Wagers</Link>
            <Link href="/tournaments" className="hover:text-gray-300">Tournaments</Link>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
