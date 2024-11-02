import React from 'react'
import { Users, MessageCircle, Trophy } from 'lucide-react'


// Mapping of icons to make selection easier
const ICONS = {
  users: Users,
  chat: MessageCircle,
  trophy: Trophy
}

export default function FeatureCard({ 
  title, 
  description, 
  icon = 'users' 
}) {
  const IconComponent = ICONS[icon]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center 
      hover:shadow-md transition-all duration-300 ease-in-out 
      hover:border-blue-200 hover:scale-105">
      <div className="mb-4 flex justify-center">
        <div className="bg-blue-50 p-3 rounded-full">
          <IconComponent className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}