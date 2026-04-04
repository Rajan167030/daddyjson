"use client"

import { useEffect, useState } from "react"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { ChannelStats } from "@/components/channel-stats"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { StaggeredChildren } from "@/components/animations/staggered-children"
import { StaggeredChild } from "@/components/animations/staggered-child"
import { FadeIn } from "@/components/animations/fade-in"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/youtube')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setVideos(data.videos)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError(true)
        // Fallback to hardcoded videos
        setVideos([
          { id: "95arBATd5QI", title: "Build Modern Web Apps", description: "", thumbnail: "", publishedAt: "" },
          { id: "TG2AWzsnKm4", title: "JavaScript Essentials", description: "", thumbnail: "", publishedAt: "" },
          { id: "pO1BXqbiITQ", title: "React Development Guide", description: "", thumbnail: "", publishedAt: "" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Shorten title to look good
  const shortenTitle = (title: string, maxLength = 60) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength).trim() + "..."
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="space-y-12">
        <FadeIn className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Videos</h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Watch our latest tech videos, tutorials, and reviews
          </p>
        </FadeIn>

        {/* Channel Statistics */}
        <ScrollReveal>
          <ChannelStats />
        </ScrollReveal>

        {/* Videos Section */}
        <div className="space-y-6">
          <FadeIn className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Full Videos</h2>
            <p className="text-muted-foreground">
              In-depth tutorials, reviews, and tech discussions
            </p>
            {!loading && !error && (
              <p className="text-sm text-muted-foreground">
                {videos.length} videos available
              </p>
            )}
          </FadeIn>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <StaggeredChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <StaggeredChild key={video.id} className="group">
                    <div className="card-zoom">
                      <YoutubeEmbed 
                        videoId={video.id} 
                        title={shortenTitle(video.title)} 
                      />
                    </div>
                  </StaggeredChild>
                ))}
              </StaggeredChildren>
            </ScrollReveal>
          )}
        </div>

        {/* Shorts Section */}
        <div className="space-y-6 border-t pt-12">
          <FadeIn className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">🎬 Shorts</h2>
            <p className="text-muted-foreground">
              Quick tech tips and bite-sized content
            </p>
          </FadeIn>

          {/* Coming Soon Message */}
          <ScrollReveal>
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="text-center space-y-4">
                <div className="text-5xl">🚀</div>
                <h3 className="text-2xl font-bold">Coming Soon!</h3>
                <p className="text-muted-foreground max-w-sm">
                  We're working on some amazing short-form content. Stay tuned for quick tech tips, hacks, and bite-sized tutorials!
                </p>
                <div className="pt-4">
                  <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary border border-primary/20">
                    Shorts launching soon
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
