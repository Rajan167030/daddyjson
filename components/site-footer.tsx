"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Youtube, Twitter, Linkedin, Eye, Users, KeyRound } from "lucide-react"
import { useEffect, useState } from "react"
import { isAdmin } from "@/lib/admin"

export function SiteFooter() {
  const [visitorStats, setVisitorStats] = useState({ total: 0, unique: 0 })
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const stored = localStorage.getItem("adminEmail")
    setIsAdminUser(stored ? isAdmin(stored) : false)

    // Track visitor on component mount
    const trackVisitor = async () => {
      try {
        const response = await fetch('/api/visitors/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        const stats = await response.json()
        setVisitorStats(stats)
      } catch (error) {
        console.error('Failed to track visitor:', error)
        // Fallback to localStorage for demo
        const total = parseInt(localStorage.getItem('totalVisits') || '0') + 1
        const unique = parseInt(localStorage.getItem('uniqueVisits') || '0')
        localStorage.setItem('totalVisits', total.toString())
        setVisitorStats({ total, unique })
      }
    }

    trackVisitor()
  }, [])
  return (
    <footer className="border-t bg-background relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse-glow"></div>
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">daddy.json</h3>
            <p className="text-sm text-muted-foreground">
              Exploring the latest in tech news, coding tutorials, gadget reviews, and insightful discussions.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Our Vision</h3>
            <p className="text-sm text-muted-foreground">
              To democratize technology education and empower developers worldwide with cutting-edge knowledge and practical skills.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Connect</h3>
            <div className="flex space-x-2">
              <Link href="https://www.youtube.com/@DaddyJSON" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="YouTube Channel"
                  className="hover:text-primary hover:scale-110 transition-transform"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://x.com/rajanjh40593219" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Twitter/X"
                  className="hover:text-primary hover:scale-110 transition-transform"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/Rajan167030" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="GitHub"
                  className="hover:text-primary hover:scale-110 transition-transform"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
              </Link>
              <Link href="https://www.linkedin.com/in/rajan-jha-4a921828a/" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="LinkedIn"
                  className="hover:text-primary hover:scale-110 transition-transform"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          {isAdminUser && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Admin
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/write-blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Write Blog
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Subscribe</h3>
            <p className="text-sm text-muted-foreground">Join our newsletter for the latest updates.</p>
            <Link href="/contact#newsletter">
              <Button variant="outline" className="w-full hover:border-primary hover:text-primary transition-colors">
                Subscribe
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Website Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Total Visits: <span className="font-medium text-foreground">{visitorStats.total.toLocaleString()}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Unique Visitors: <span className="font-medium text-foreground">{visitorStats.unique.toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} daddy.json. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

