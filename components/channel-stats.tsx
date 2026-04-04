"use client"

import { useEffect, useState } from "react"
import { Users, Video, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChannelStats {
  subscriberCount: string
  videoCount: string
  viewCount: string
  channelTitle: string
}

export function ChannelStats() {
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/youtube')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setStats(data.channelStats)
      } catch (err) {
        console.error('Error fetching channel stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatNumber = (num: string) => {
    const n = parseInt(num)
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toLocaleString()
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-primary/20 hover:border-primary/40">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Subscribers</p>
            <p className="text-2xl font-bold">{formatNumber(stats.subscriberCount)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-purple-500/20 hover:border-purple-500/40">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Video className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Videos</p>
            <p className="text-2xl font-bold">{formatNumber(stats.videoCount)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 border-blue-500/20 hover:border-blue-500/40">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Eye className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold">{formatNumber(stats.viewCount)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
