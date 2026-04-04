"use client"

import { useEffect, useState } from "react"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { StaggeredChildren } from "@/components/animations/staggered-children"
import { StaggeredChild } from "@/components/animations/staggered-child"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
}

export function LatestVideos({ limit = 3 }: { limit?: number }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/youtube')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setVideos(data.videos.slice(0, limit))
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
  }, [limit])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  // Shorten title to look good
  const shortenTitle = (title: string, maxLength = 50) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength).trim() + "..."
  }

  return (
    <StaggeredChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <StaggeredChild key={video.id}>
          <div className="group">
            <YoutubeEmbed 
              videoId={video.id} 
              title={shortenTitle(video.title)} 
            />
          </div>
        </StaggeredChild>
      ))}
    </StaggeredChildren>
  )
}
