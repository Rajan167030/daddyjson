"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddLiveSessionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, youtubeLink }),
      })

      if (response.ok) {
        router.push("/live")
      } else {
        console.error("Failed to add live session")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Live Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-lg bg-secondary">
            <h3 className="font-bold text-lg mb-2">How to go live:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Use a screen recording tool like OBS or Loom to record your session.</li>
              <li>After the session, upload the recorded video to your YouTube channel.</li>
              <li>Paste the YouTube video link below and add your session details.</li>
            </ol>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter session title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Session Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter session description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">YouTube Video Link</Label>
              <Input
                id="youtubeLink"
                type="url"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding Session..." : "Add Live Session"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
