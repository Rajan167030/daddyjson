"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/videos", label: "Videos" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Mobile Logo - Only visible on mobile */}
      <Link href="/" className="flex md:hidden items-center space-x-2 group">
        <div className="relative">
          <Image 
            src="/logo.png" 
            alt="daddy.json logo" 
            width={32} 
            height={32} 
            className="rounded" 
          />
        </div>
        <span className="font-bold text-sm">daddy.json</span>
      </Link>

      {/* Desktop Navigation - Centered capsule navbar */}
      <nav
        className={cn(
          "grid grid-cols-7 items-center rounded-2xl border border-border/70 bg-muted/40 p-1 text-xs md:text-sm font-medium backdrop-blur-sm",
          className,
        )}
        {...props}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-5 py-2 text-center transition-all duration-300",
              pathname === item.href
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}

