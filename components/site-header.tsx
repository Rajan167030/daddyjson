import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Youtube } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Left side (desktop only) */}
        <div className="hidden md:flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="daddy.json logo" 
                width={40} 
                height={40} 
                className="rounded transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" 
              />
              <div className="absolute inset-0 rounded bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
        </div>

        {/* Centered Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <MainNav />
        </div>

        {/* Desktop actions - Right side */}
        <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
          <Link href="https://www.youtube.com/@DaddyJSON" target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 group hover:bg-primary/10 transition-all duration-300"
            >
              <Youtube className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block font-medium">Subscribe</span>
            </Button>
          </Link>
          <ModeToggle />
        </div>

        {/* Mobile menu - Right side */}
        <div className="flex items-center space-x-2 md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
