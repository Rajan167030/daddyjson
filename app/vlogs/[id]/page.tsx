"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { Skeleton } from "@/components/ui/skeleton"

interface Vlog {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  description: string
  videoId: string
  thumbnail: string
  duration: string
  authorEmail: string
  published: boolean
  views: number
}

export default function VlogDetailPage({ params }: { params: { id: string } }) {
  const [vlog, setVlog] = useState<Vlog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [relatedVlogs, setRelatedVlogs] = useState<Vlog[]>([])

  useEffect(() => {
    async function fetchVlog() {
      try {
        // Fetch the specific vlog
        const response = await fetch(`/api/vlogs?id=${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch vlog")
        
        const data = await response.json()
        if (!data.data) throw new Error("Vlog not found")
        
        setVlog(data.data)

        // Fetch related vlogs
        const allVlogsResponse = await fetch("/api/vlogs")
        if (allVlogsResponse.ok) {
          const allVlogsData = await allVlogsResponse.json()
          const related = allVlogsData.data
            .filter((v: Vlog) => v.id !== data.data.id)
            .slice(0, 3)
          setRelatedVlogs(related)
        }
      } catch (err) {
        console.error("Error fetching vlog:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchVlog()
  }, [params.id])

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-8 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (error || !vlog) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold">Vlog Not Found</h1>
          <p className="text-xl text-muted-foreground">
            We couldn't find the vlog you're looking for.
          </p>
          <Link href="/vlogs">
            <Button size="lg">Back to Vlogs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <FadeIn>
          <Link href="/vlogs">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Vlogs
            </Button>
          </Link>
        </FadeIn>

        {/* Video Player */}
        <ScrollReveal>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <YoutubeEmbed videoId={vlog.videoId} title={vlog.title} />
          </div>
        </ScrollReveal>

        {/* Vlog Header */}
        <FadeIn className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            {vlog.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{vlog.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{vlog.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{vlog.views.toLocaleString()} views</span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-lg text-muted-foreground">{vlog.summary}</p>
        </FadeIn>

        {/* Divider */}
        <div className="border-t" />

        {/* Description */}
        <ScrollReveal>
          <div className="prose prose-invert max-w-none dark:prose-invert">
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {vlog.description ||
                "This is a great educational vlog about web development and programming. Watch it to learn new skills and improve your coding knowledge."}
            </p>
          </div>
        </ScrollReveal>

        {/* Related Vlogs */}
        {relatedVlogs.length > 0 && (
          <>
            <div className="border-t" />
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tighter">Related Vlogs</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedVlogs.map((relVlog) => (
                    <Link key={relVlog.id} href={`/vlogs/${relVlog.slug}`}>
                      <div className="group cursor-pointer space-y-3 rounded-lg border p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                        <div className="aspect-video rounded overflow-hidden bg-muted">
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            {relVlog.duration}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {relVlog.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            {relVlog.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </>
        )}

        {/* Author Info */}
        <ScrollReveal className="border-t pt-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Created by:{" "}
              <span className="font-semibold text-foreground">
                {vlog.authorEmail}
              </span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
