"use client"

import { useEffect, useState } from "react"

export function CursorEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    let moveTimeout: NodeJS.Timeout

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMoving(true)

      // Clear existing timeout
      clearTimeout(moveTimeout)

      // Set timeout to stop moving after 100ms of no movement
      moveTimeout = setTimeout(() => {
        setIsMoving(false)
      }, 100)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea, select')

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    document.addEventListener('mousemove', updateMousePosition)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      clearTimeout(moveTimeout)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 8}px, ${mousePosition.y - 8}px)`,
        }}
      />

      {/* Grey shadow effect */}
      {isMoving && (
        <div
          className="fixed top-0 left-0 w-6 h-6 bg-gray-400 rounded-full pointer-events-none z-40 opacity-30 blur-sm transition-opacity duration-200"
          style={{
            transform: `translate(${mousePosition.x - 11}px, ${mousePosition.y - 11}px)`,
          }}
        />
      )}

      {/* Cursor trail */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border-2 border-primary/50 rounded-full pointer-events-none z-40 transition-all duration-300 ease-out ${
          isHovering ? 'scale-150 opacity-100' : 'scale-100 opacity-75'
        }`}
        style={{
          transform: `translate(${mousePosition.x - 16}px, ${mousePosition.y - 16}px)`,
        }}
      />

      {/* Hover effect ring */}
      {isHovering && (
        <div
          className="fixed top-0 left-0 w-12 h-12 border border-primary/30 rounded-full pointer-events-none z-30 animate-ping"
          style={{
            transform: `translate(${mousePosition.x - 24}px, ${mousePosition.y - 24}px)`,
          }}
        />
      )}
    </>
  )
}