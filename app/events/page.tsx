"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface Event {
  _id: string
  title: string
  description: string
  link: string
  imageUrl: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.error("Failed to fetch events", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Events</h1>
          <p className="text-muted-foreground text-lg">
            Check out our upcoming and past events.
          </p>
        </section>

        {isLoading ? (
          <div className="text-center">Loading events...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link href={event.link} key={event._id} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-56 w-full">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-muted-foreground mt-2">{event.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

