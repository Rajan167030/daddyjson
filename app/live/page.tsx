"use client"
 
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { YoutubeEmbed } from "@/components/youtube-embed"
import Link from "next/link"
 
interface LiveSession {
  _id: string
  title: string
  description: string
  youtubeLink: string
  scheduledTime?: string
  isActive?: boolean
}
 
export default function LivePage() {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([])
  const [pastSessions, setPastSessions] = useState<LiveSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
 
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const [allResponse, activeResponse] = await Promise.all([
          fetch("/api/live"),
          fetch("/api/live?active=true"),
        ])
 
        if (!allResponse.ok || !activeResponse.ok) {
          setError(true)
          return
        }
 
        const allData: LiveSession[] = await allResponse.json()
        const activeData: LiveSession[] = await activeResponse.json()
 
        const now = new Date()
 
        const upcoming = allData.filter(
          (s) =>
            !s.isActive &&
            s.scheduledTime &&
            new Date(s.scheduledTime) > now
        )
 
        const past = allData.filter(
          (s) =>
            !s.isActive &&
            (!s.scheduledTime || new Date(s.scheduledTime) <= now)
        )
 
        setUpcomingSessions(upcoming)
        setPastSessions(past)
        setActiveSession(activeData.length > 0 ? activeData[0] : null)
      } catch (err) {
        console.error("Failed to fetch live sessions:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }
 
    fetchSessions()
  }, [])
 
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-10">
 
        {/* Header */}
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Live Sessions
          </h1>
          <p className="text-muted-foreground text-lg">
            Join live sessions or watch recordings of our past sessions.
          </p>
        </section>
 
        {/* Loading */}
        {isLoading && (
          <div className="text-center text-muted-foreground py-12">
            Loading sessions...
          </div>
        )}
 
        {/* Error */}
        {!isLoading && error && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-destructive/30">
            <p className="text-destructive font-medium">
              Failed to load sessions. Please try refreshing the page.
            </p>
          </div>
        )}
 
        {/* Content */}
        {!isLoading && !error && (
          <>
            {/* Active / Live Now */}
            {activeSession && (
              <Card className="border-green-500 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    LIVE NOW
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{activeSession.title}</h3>
                    <p className="text-muted-foreground">{activeSession.description}</p>
                    {activeSession.scheduledTime && (
                      <p className="text-sm text-muted-foreground">
                        Started:{" "}
                        {new Date(activeSession.scheduledTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Link href="/live-session">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                      Join Live Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
 
            {/* Upcoming */}
            {upcomingSessions.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <Card key={session._id}>
                      <CardHeader>
                        <CardTitle>{session.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        <p className="text-muted-foreground">{session.description}</p>
                        {session.scheduledTime && (
                          <p className="text-sm text-muted-foreground font-medium">
                            Scheduled:{" "}
                            {new Date(session.scheduledTime).toLocaleString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
 
            {/* Past Sessions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Past Sessions</h2>
              {pastSessions.length === 0 ? (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-muted">
                  <p className="text-muted-foreground">No past sessions yet.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {pastSessions.map((session) => (
                    <Card key={session._id}>
                      <CardHeader>
                        <CardTitle>{session.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-muted-foreground">{session.description}</p>
                        {session.scheduledTime && (
                          <p className="text-sm text-muted-foreground">
                            Recorded:{" "}
                            {new Date(session.scheduledTime).toLocaleString()}
                          </p>
                        )}
                        {session.youtubeLink && (
                         <YoutubeEmbed videoId={getYoutubeId(session.youtubeLink)} />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
 
      </div>
    </div>
  )
}