import Image from "next/image"

const galleryItems = [
  { src: "/placeholder.jpg", alt: "Hackathon judging panel", caption: "Hackathon Judge Session" },
  { src: "/placeholder.jpg", alt: "Speaking at tech event", caption: "AI Full Stack Talk" },
  { src: "/placeholder.jpg", alt: "Community meetup", caption: "Founder-Tech Meetup" },
  { src: "/placeholder.jpg", alt: "Workshop stage", caption: "Developer Workshop" },
  { src: "/placeholder.jpg", alt: "Panel discussion", caption: "Product & AI Panel" },
  { src: "/placeholder.jpg", alt: "Mentorship session", caption: "Mentor Round" },
  { src: "/placeholder.jpg", alt: "Audience interaction", caption: "Q&A Session" },
  { src: "/placeholder.jpg", alt: "Community networking", caption: "Networking Moments" },
  { src: "/placeholder.jpg", alt: "Award ceremony", caption: "Event Highlights" },
]

export default function GalleryPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Gallery</h1>
          <p className="text-muted-foreground text-lg">
            Event memories, speaking moments, mentoring sessions, and community interactions.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, idx) => (
            <figure
              key={`${item.caption}-${idx}`}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">{item.caption}</figcaption>
            </figure>
          ))}
        </section>

        <p className="text-sm text-muted-foreground text-center">
          Add your real event photos in the public folder and update image paths in this page.
        </p>
      </div>
    </div>
  )
}
