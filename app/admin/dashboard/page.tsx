"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FadeIn } from "@/components/animations/fade-in"
import { isAdmin } from "@/lib/admin"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BlogPost {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  image: string
  published: boolean
  authorEmail: string
}

interface ContactQuery {
  id: string
  queryId: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [adminEmail, setAdminEmail] = useState("")
  const [error, setError] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [queries, setQueries] = useState<ContactQuery[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("adminEmail")
    if (stored && isAdmin(stored)) {
      setIsAuthorized(true)
      setAdminEmail(stored)
      fetchPosts()
      fetchQueries(stored)
    }
    setLoading(false)
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      if (!response.ok) throw new Error("Failed to fetch blog posts")
      const data = await response.json()
      setPosts(data.data)
    } catch (err) {
      console.error("Error fetching blog posts:", err)
      setError("Failed to fetch blog posts")
    }
  }

  const fetchQueries = async (email: string) => {
    try {
      const response = await fetch("/api/contact", {
        headers: {
          "x-admin-email": email,
        },
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || "Failed to fetch user queries")
      }

      const data = await response.json()
      setQueries(data.data || [])
    } catch (err) {
      console.error("Error fetching contact queries:", err)
      setError("Failed to fetch contact queries")
    }
  }

  const handleDelete = async () => {
    if (!deleteId || !adminEmail) return

    try {
      setDeleting(true)
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({ id: deleteId }),
      })

      if (!response.ok) throw new Error("Failed to delete blog post")

      setPosts(posts.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (err: any) {
      setError(err.message || "Failed to delete blog post")
    } finally {
      setDeleting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminEmail")
    setIsAuthorized(false)
    setAdminEmail("")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthorized) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            You need to be logged in as an admin to access this page.
          </p>

          <div className="bg-primary/10 rounded-lg p-6 text-left space-y-4 border border-primary/20">
            <h2 className="font-semibold">Admin Login:</h2>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter admin email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <Button
                onClick={async () => {
                  if (isAdmin(adminEmail)) {
                    localStorage.setItem("adminEmail", adminEmail)
                    setIsAuthorized(true)
                    await Promise.all([fetchPosts(), fetchQueries(adminEmail)])
                  } else {
                    setError("Invalid admin credentials")
                  }
                }}
                className="w-full"
              >
                Login as Admin
              </Button>
              <p className="text-sm text-muted-foreground">
                Authorized admins: rajan@mail.com, Rajan167
              </p>
            </div>
          </div>

          <Link href="/blog">
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Logged in as: <span className="font-semibold">{adminEmail}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/blog">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href="/admin/write-blog">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Write New Blog
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
            {error}
          </div>
        )}

        {/* Blog Posts Table */}
        <div className="border rounded-lg overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Link href="/admin/write-blog">
                <Button>Write Your First Blog Post</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Title</th>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/blog/${post.slug}`} className="hover:underline font-medium">
                          {post.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{post.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-green-500/20 text-green-600"
                              : "bg-yellow-500/20 text-yellow-600"
                          }`}
                        >
                          {post.published ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/edit-blog/${post.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-red-500 hover:text-red-600"
                            onClick={() => setDeleteId(post.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact Queries Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="border-b bg-muted/40 px-6 py-4">
            <h2 className="text-xl font-semibold">User Queries (Contact Page)</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Every user query is assigned a unique Query ID.
            </p>
          </div>

          {queries.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No user queries yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Query ID</th>
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Message</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.map((query) => (
                    <tr key={query.id} className="border-b align-top hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{query.queryId}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{query.name}</div>
                        <div className="text-sm text-muted-foreground">{query.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-[420px] whitespace-pre-wrap">
                        {query.message}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          query.status === "unread"
                            ? "bg-yellow-500/20 text-yellow-700"
                            : "bg-green-500/20 text-green-700"
                        }`}>
                          {query.status || "unread"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {query.created_at ? new Date(query.created_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
