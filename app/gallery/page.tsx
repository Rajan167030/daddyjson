import Image from "next/image"
import fs from "fs"
import path from "path"

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public", "moment")
  const imageFiles = fs.readdirSync(galleryDir)

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
          {imageFiles.map((file, idx) => (
            <figure
              key={`${file}-${idx}`}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={`/moment/${file}`}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </figure>
          ))}
        </section>
      </div>
    </div>
  )
}

