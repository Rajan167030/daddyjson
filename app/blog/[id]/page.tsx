"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  content: string
  image: string
  authorEmail: string
  published: boolean
}

interface BlogDetailPageProps {
  params: {
    id: string
  }
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog?id=${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch blog post")
        
        const data = await response.json()
        if (!data.data) throw new Error("Blog post not found")
        
        setPost(data.data)
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-8 max-w-3xl mx-auto">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold">Blog Post Not Found</h1>
          <p className="text-xl text-muted-foreground">
            We couldn't find the blog post you're looking for.
          </p>
          <Link href="/blog">
            <Button size="lg">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Back Button */}
        <FadeIn>
          <Link href="/blog">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </FadeIn>

        {/* Featured Image */}
        {post.image && (
          <ScrollReveal>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src={post.image}
                alt={post.title}
                width={900}
                height={600}
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          </ScrollReveal>
        )}

        {/* Blog Header */}
        <FadeIn className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.authorEmail}</span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-lg text-muted-foreground">{post.summary}</p>
        </FadeIn>

        {/* Divider */}
        <div className="border-t" />

        {/* Blog Content */}
        <ScrollReveal>
          <div className="prose prose-invert max-w-none dark:prose-invert">
            <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </ScrollReveal>

        {/* Divider */}
        <div className="border-t" />

        {/* Author Section */}
        <ScrollReveal className="bg-primary/5 rounded-lg p-6 border border-primary/10">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">About the Author</h3>
            <p className="text-muted-foreground">
              This article was written by <span className="font-semibold text-foreground">{post.authorEmail}</span>
            </p>
          </div>
        </ScrollReveal>

        {/* Related Articles */}
        <ScrollReveal className="space-y-6 pt-8">
          <h2 className="text-2xl font-bold tracking-tighter">More Articles</h2>
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              Browse all articles
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </div>
  )
}
