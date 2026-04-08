"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Plus, X } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { StaggeredChildren } from "@/components/animations/staggered-children"
import { StaggeredChild } from "@/components/animations/staggered-child"
import { TiltCard } from "@/components/ui/cards/tilt-card"
import { Skeleton } from "@/components/ui/skeleton"
import { isAdmin } from "@/lib/admin"
import { ShareBlog } from "@/components/share-blog"
import { BlogVotes } from "@/components/blog-votes"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BlogPost {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  image: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [authError, setAuthError] = useState("")
  const [authenticating, setAuthenticating] = useState(false)

  useEffect(() => {
    // Check if user is already admin
    const stored = localStorage.getItem("adminEmail")
    if (stored && isAdmin(stored)) {
      setIsAdminUser(true)
    }

    // Fetch blog posts
    async function fetchPosts() {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) throw new Error("Failed to fetch blog posts")
        const data = await response.json()
        setPosts(data.data)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    if (!adminEmail.trim()) {
      setAuthError("Please enter your email")
      return
    }

    if (!isAdmin(adminEmail)) {
      setAuthError("Invalid admin credentials. Authorized: rajan@mail.com, Rajan167")
      return
    }

    setAuthenticating(true)
    try {
      // Save to localStorage
      localStorage.setItem("adminEmail", adminEmail)
      setIsAdminUser(true)
      setShowAuthDialog(false)
      setAdminEmail("")
    } catch (err) {
      setAuthError("Authentication failed. Please try again.")
    } finally {
      setAuthenticating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminEmail")
    setIsAdminUser(false)
  }

  return (
    <>
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <FadeIn className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Blog</h1>
                <p className="text-xl text-muted-foreground max-w-[700px]">
                  Read our latest articles on tech news, coding tutorials, and gadget reviews
                </p>
                {!loading && !error && (
                  <p className="text-sm text-muted-foreground">
                    {posts.length} articles available
                  </p>
                )}
              </div>

              {/* Admin Button */}
              {!isAdminUser ? (
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="gap-2 h-fit"
                >
                  <Plus className="h-4 w-4" />
                  Write Blog
                </Button>
              ) : (
                <div className="flex gap-2 items-center">
                  <Link href="/admin/write-blog">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Write Blog
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Loading State */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <div className="text-center space-y-4">
                  <div className="text-5xl">⚠️</div>
                  <h3 className="text-2xl font-bold">Error Loading Articles</h3>
                  <p className="text-muted-foreground max-w-sm">
                    We encountered an error loading the blog articles. Please try refreshing the page.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ) : posts.length === 0 ? (
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <div className="text-center space-y-4">
                  <div className="text-5xl">📝</div>
                  <h3 className="text-2xl font-bold">No Articles Yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    We're working on creating amazing content. Check back soon for our first article!
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <StaggeredChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <StaggeredChild key={post.id}>
                    <TiltCard className="h-full">
                      <article className="group relative flex flex-col space-y-2 h-full">
                        <Link href={`/blog/${post.slug}`} className="flex-1 flex flex-col">
                          <div className="card-zoom">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              width={600}
                              height={400}
                              className="card-zoom-image object-cover aspect-video rounded-t-lg"
                            />
                          </div>
                          <div className="flex-1 space-y-2 p-4">
                            <h2 className="text-xl font-bold">{post.title}</h2>
                            <p className="text-sm text-muted-foreground">{post.date}</p>
                            <p className="text-muted-foreground">{post.summary}</p>
                          </div>
                        </Link>
                        <div className="p-4 pt-0 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Link href={`/blog/${post.slug}`}>
                              <Button variant="ghost" className="gap-1 p-0 h-auto font-medium glow-effect">
                                Read More
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </Link>
                            <BlogVotes
                              blogId={post.id}
                              initialUpvotes={post.upvotes || 0}
                              initialDownvotes={post.downvotes || 0}
                            />
                          </div>
                          <ShareBlog
                            title={post.title}
                            url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : ''}
                            description={post.summary}
                          />
                        </div>
                      </article>
                    </TiltCard>
                  </StaggeredChild>
                ))}
              </StaggeredChildren>
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Admin Authentication</DialogTitle>
                <DialogDescription>
                  Login to write and manage blog posts
                </DialogDescription>
              </div>
              <button
                onClick={() => setShowAuthDialog(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-500">
                {authError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email / Username</label>
              <Input
                type="text"
                placeholder="rajan@mail.com or Rajan167"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                disabled={authenticating}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Authorized admins: rajan@mail.com, Rajan167
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAuthDialog(false)}
                disabled={authenticating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={authenticating}
                className="flex-1"
              >
                {authenticating ? "Authenticating..." : "Login"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

