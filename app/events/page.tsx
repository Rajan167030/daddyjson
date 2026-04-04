"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Mic2 } from "lucide-react"

const upcomingEvents = [
  {
    title: "AI Builders Meetup 2026",
    date: "May 18, 2026",
    location: "New Delhi",
    role: "Speaker",
    description: "Hands-on session on AI + full stack product development.",
    image: "/placeholder.jpg",
  },
  {
    title: "Founder-Tech Connect",
    date: "June 7, 2026",
    location: "Gurugram",
    role: "Panel Mentor",
    description: "Founder growth, event tech systems, and developer ecosystem strategy.",
    image: "/placeholder.jpg",
  },
  {
    title: "HackWithIndia 2026",
    date: "July 12-13, 2026",
    location: "Bengaluru",
    role: "Judge & Mentor",
    description: "Mentoring and evaluating innovative student and startup teams.",
    image: "/placeholder.jpg",
  },
]

const pastEvents = [
  {
    title: "Devnovate Sprint Day",
    date: "Feb 2026",
    location: "Noida",
    role: "Mentor",
  },
  {
    title: "Founders Connect Tech Circle",
    date: "Jan 2026",
    location: "New Delhi",
    role: "Speaker",
  },
  {
    title: "God Labs Build Session",
    date: "Dec 2025",
    location: "Remote",
    role: "Workshop Lead",
  },
  {
    title: "Event INFO Product Showcase",
    date: "Nov 2025",
    location: "New Delhi",
    role: "Co-Founder",
  },
  {
    title: "Zerocarbon Tech x Ops Meetup",
    date: "Sep 2025",
    location: "Gurugram",
    role: "Co-Founder",
  },
]

export default function EventsPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % upcomingEvents.length)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % upcomingEvents.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const activeEvent = upcomingEvents[activeIndex]

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Events</h1>
          <p className="text-muted-foreground text-lg">
            Supported events, speaking sessions, judging rounds, and community meetups.
          </p>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Current Event Panel</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted"
                aria-label="Previous event"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted"
                aria-label="Next event"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <article className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-primary">Live Rotating Card (Auto every 4s)</p>
            <div className="relative mt-3 h-64 w-full overflow-hidden rounded-xl border md:h-96">
              <Image
                src={activeEvent.image}
                alt={activeEvent.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h3 className="mt-2 text-2xl font-semibold">{activeEvent.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> {activeEvent.date}
            </p>
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {activeEvent.location}
            </p>
            <p className="mt-1 text-sm text-primary flex items-center gap-2">
              <Mic2 className="h-4 w-4" /> {activeEvent.role}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{activeEvent.description}</p>

            <div className="mt-4 flex items-center gap-2">
              {upcomingEvents.map((event, idx) => (
                <button
                  key={event.title}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${idx === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"}`}
                  aria-label={`Go to event ${idx + 1}`}
                />
              ))}
            </div>
          </article>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article key={event.title} className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> {event.date}
                </p>
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {event.location}
                </p>
                <p className="mt-1 text-sm text-primary flex items-center gap-2">
                  <Mic2 className="h-4 w-4" /> {event.role}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">Past Events</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {pastEvents.map((event) => (
              <article
                key={`${event.title}-${event.date}`}
                className="rounded-xl border border-border/80 bg-muted/30 p-4"
              >
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{event.date} • {event.location}</p>
                <p className="text-sm text-primary mt-1">Role: {event.role}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
