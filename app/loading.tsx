"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Loading() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show loading on initial website load, not on navigation
    const hasVisited = localStorage.getItem('hasVisited')
    
    if (!hasVisited) {
      setIsVisible(true)
      // Keep loading page visible for 5 seconds on first visit
      const timer = setTimeout(() => {
        setIsVisible(false)
        localStorage.setItem('hasVisited', 'true')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-primary/5 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Main loading container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Logo with animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
          
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-purple-500 animate-spin" style={{ animation: 'spin 3s linear infinite' }} />
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-primary border-l-purple-500 animate-spin" style={{ animation: 'spin 2s linear infinite reverse' }} />

          {/* Logo image */}
          <div className="relative w-32 h-32 flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full backdrop-blur-sm border border-primary/20">
            <Image
              src="/logo.png"
              alt="daddy.json"
              width={100}
              height={100}
              className="w-24 h-24 drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Loading text with animation */}
        <div className="space-y-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-pulse">
            daddy.json
          </h2>
          
          {/* Animated loading dots */}
          <div className="flex justify-center items-center gap-1 h-8">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>

          <p className="text-muted-foreground text-sm md:text-base mt-4">
            Loading awesome content...
          </p>
        </div>

        {/* Bottom tech tagline */}
        <div className="absolute bottom-8 text-center">
          <p className="text-xs md:text-sm text-muted-foreground/60">
            Preparing your tech experience
          </p>
        </div>

        {/* Floating tech icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-2xl opacity-10 animate-float">💻</div>
          <div className="absolute bottom-32 left-1/4 text-2xl opacity-10 animate-float animation-delay-2000">🚀</div>
          <div className="absolute bottom-20 right-1/4 text-2xl opacity-10 animate-float animation-delay-1500">🎯</div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
        }

        .dark .bg-grid-pattern {
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent);
        }
      `}</style>
    </div>
  )
}
