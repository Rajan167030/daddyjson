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
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const [allResponse, activeResponse] = await Promise.all([
          fetch("/api/live"),
          fetch("/api/live?active=true")
        ])

        if (allResponse.ok) {
          const allData = await allResponse.json()
          setSessions(allData)

          // Separate upcoming and past sessions
          const now = new Date()
          const upcoming = allData.filter((session: LiveSession) =>
            !session.isActive &&
            session.scheduledTime &&
            new Date(session.scheduledTime) > now
          )
          setUpcomingSessions(upcoming)
        }

        if (activeResponse.ok) {
          const activeData = await activeResponse.json()
          if (activeData.length > 0) {
            setActiveSession(activeData[0])
          }
        }
      } catch (error) {
        console.error("Failed to fetch live sessions", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-10">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Live Sessions</h1>
          <p className="text-muted-foreground text-lg">
            Join live sessions or watch recordings of our past sessions.
          </p>
        </section>

        {isLoading ? (
          <div className="text-center">Loading sessions...</div>
        ) : (
          <>
            {activeSession && (
              <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                    🔴 LIVE NOW
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-semibold">{activeSession.title}</h3>
                    <p className="text-muted-foreground">{activeSession.description}</p>
                    {activeSession.scheduledTime && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        📅 Scheduled: {new Date(activeSession.scheduledTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Link href="/live-session">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Join Live Session Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {upcomingSessions.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <Card key={session._id} className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="text-blue-700 dark:text-blue-300">{session.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2">{session.description}</p>
                        {session.scheduledTime && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            📅 Scheduled: {new Date(session.scheduledTime).toLocaleString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h2 className="text-2xl font-bold">Past Sessions</h2>
              <div className="space-y-8">
                {sessions.filter(session =>
                  !session.isActive &&
                  (!session.scheduledTime || new Date(session.scheduledTime) <= new Date())
                ).map((session) => (
                  <Card key={session._id}>
                    <CardHeader>
                      <CardTitle>{session.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">{session.description}</p>
                      {session.scheduledTime && (
                        <p className="text-sm text-muted-foreground mb-4">
                          📅 Scheduled: {new Date(session.scheduledTime).toLocaleString()}
                        </p>
                      )}
                      {session.youtubeLink && <YoutubeEmbed url={session.youtubeLink} />}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
