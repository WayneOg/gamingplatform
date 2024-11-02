// src/components/ui/card.js
import React from 'react'

export function Card({ className, ...props }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className || ''}`}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={`font-semibold text-xl leading-none tracking-tight ${className || ''}`}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={`text-sm text-gray-600 ${className || ''}`}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={`p-6 pt-0 ${className || ''}`}
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className || ''}`}
      {...props}
    />
  )
}