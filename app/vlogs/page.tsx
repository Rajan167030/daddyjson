"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { StaggeredChildren } from "@/components/animations/staggered-children"
import { StaggeredChild } from "@/components/animations/staggered-child"
import { TiltCard } from "@/components/ui/cards/tilt-card"
import { Skeleton } from "@/components/ui/skeleton"

interface Vlog {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  videoId: string
  thumbnail: string
  duration: string
  published: boolean
  views: number
}

export default function VlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchVlogs() {
      try {
        const response = await fetch("/api/vlogs")
        if (!response.ok) throw new Error("Failed to fetch vlogs")
        const data = await response.json()
        setVlogs(data.data)
      } catch (err) {
        console.error("Error fetching vlogs:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchVlogs()
  }, [])

  const shortenTitle = (title: string, maxLength = 60) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength).trim() + "..."
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="space-y-8">
        {/* Header */}
        <FadeIn className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Video Blogs (Vlogs)
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Explore our collection of educational video content about web development,
            programming, and technology
          </p>
          {!loading && !error && (
            <p className="text-sm text-muted-foreground">
              {vlogs.length} vlogs available
            </p>
          )}
        </FadeIn>

        {/* Loading State */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="text-center space-y-4">
                <div className="text-5xl">⚠️</div>
                <h3 className="text-2xl font-bold">Error Loading Vlogs</h3>
                <p className="text-muted-foreground max-w-sm">
                  We encountered an error loading the vlogs. Please try refreshing the page.
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : vlogs.length === 0 ? (
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="text-center space-y-4">
                <div className="text-5xl">🎬</div>
                <h3 className="text-2xl font-bold">No Vlogs Yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  We're working on creating amazing video content. Stay tuned for our first vlog!
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* Vlogs Grid */
          <ScrollReveal>
            <StaggeredChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vlogs.map((vlog) => (
                <StaggeredChild key={vlog.id}>
                  <TiltCard className="h-full">
                    <Link href={`/vlogs/${vlog.slug}`}>
                      <article className="group relative flex flex-col space-y-3 h-full cursor-pointer">
                        {/* Thumbnail */}
                        <div className="card-zoom relative">
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <div className="text-center space-y-2">
                              <div className="text-4xl">▶️</div>
                              <div className="text-xs text-muted-foreground">
                                {vlog.duration}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2 px-1">
                          <h2 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">
                            {shortenTitle(vlog.title)}
                          </h2>
                          
                          {/* Meta Info */}
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>{vlog.date}</p>
                            <div className="flex items-center gap-2">
                              <Eye className="h-3 w-3" />
                              <span>{vlog.views.toLocaleString()} views</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {vlog.summary}
                          </p>
                        </div>

                        {/* View Button */}
                        <div className="pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 p-0 h-auto font-medium glow-effect"
                          >
                            Watch Now
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </article>
                    </Link>
                  </TiltCard>
                </StaggeredChild>
              ))}
            </StaggeredChildren>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
