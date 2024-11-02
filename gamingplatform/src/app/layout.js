// File: src/app/layout.js
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GameHub - Connect & Play',
  description: 'Connect with gamers, compete, and win',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  )
}