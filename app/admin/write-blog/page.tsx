"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FadeIn } from "@/components/animations/fade-in"
import { isAdmin } from "@/lib/admin"

export default function WriteBlogPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    image: "",
    published: true,
  })

  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    // Check if user is admin from localStorage
    const stored = localStorage.getItem("adminEmail")
    if (stored && isAdmin(stored)) {
      setIsAuthorized(true)
      setAdminEmail(stored)
    }
    setLoading(false)
  }, [])

  const handleImagePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault()
        const blob = item.getAsFile()
        if (blob) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string
            setImagePreview(dataUrl)
            setFormData((prev) => ({ ...prev, image: dataUrl }))
          }
          reader.readAsDataURL(blob)
        }
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setImagePreview(dataUrl)
      setFormData((prev) => ({ ...prev, image: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePublishToggle = () => {
    setFormData((prev) => ({ ...prev, published: !prev.published }))
  }

  const uploadImageToCloudinary = async (fileData: string) => {
    const response = await fetch("/api/upload-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileData }),
    })

    const data = await response.json()
    if (!response.ok || !data?.secure_url) {
      throw new Error(data?.error || "Image upload failed")
    }

    return data.secure_url as string
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate form
    if (!formData.title || !formData.slug || !formData.summary || !formData.content) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      let imageUrl = formData.image

      if (formData.image && formData.image.startsWith("data:image/")) {
        setUploadingImage(true)
        imageUrl = await uploadImageToCloudinary(formData.image)
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post")
      }

      setSuccess("Blog post created successfully! Redirecting...")
      setTimeout(() => {
        router.push("/blog")
      }, 2000)

      // Reset form
      setFormData({
        title: "",
        slug: "",
        summary: "",
        content: "",
        image: "",
        published: true,
      })
      setImagePreview("")
    } catch (err: any) {
      setError(err.message || "Failed to create blog post")
    } finally {
      setUploadingImage(false)
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthorized) {
    return (
      <div className="container px-4 md:px-6 py-12">
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold">Admin Access Required</h1>
          <p className="text-xl text-muted-foreground">
            You need to be logged in as an admin to write blog posts.
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
                onClick={() => {
                  if (isAdmin(adminEmail)) {
                    localStorage.setItem("adminEmail", adminEmail)
                    setIsAuthorized(true)
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
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter">Write Blog Post</h1>
              <p className="text-muted-foreground">
                Logged in as: <span className="font-semibold">{adminEmail}</span>
              </p>
            </div>
            <Link href="/blog">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-500">
              {success}
            </div>
          )}

          <div className="grid gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter blog title"
                disabled={submitting}
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="auto-generated-slug"
                disabled={submitting}
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/{formData.slug}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Summary <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Write a brief summary of your blog post"
                rows={3}
                disabled={submitting}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.summary.length} characters
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Blog Cover Image</label>
              <div
                onPaste={handleImagePaste}
                className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview("")
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl">📸</div>
                    <div>
                      <p className="font-medium">Paste image or click to upload</p>
                      <p className="text-sm text-muted-foreground">
                        Image is uploaded to Cloudinary when you publish
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={submitting}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById("image-upload")?.click()
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        Choose Image
                      </Button>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Blog Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your full blog content here..."
                rows={12}
                disabled={submitting}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {formData.content.length} characters
              </p>
            </div>

            {/* Publish Status */}
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex-1">
                <p className="font-medium">Publish Status</p>
                <p className="text-sm text-muted-foreground">
                  {formData.published
                    ? "This blog post will be published immediately"
                    : "This blog post will be saved as draft"}
                </p>
              </div>
              <Button
                type="button"
                variant={formData.published ? "default" : "outline"}
                size="sm"
                onClick={handlePublishToggle}
                className="gap-2"
              >
                {formData.published ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Draft
                  </>
                )}
              </Button>
            </div>

            {/* Preview Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="border border-primary/20 rounded-lg p-6 bg-primary/5 space-y-4">
                <h2 className="text-2xl font-bold">{formData.title}</h2>
                {imagePreview && (
                  <div className="aspect-video relative">
                    <img
                      src={imagePreview}
                      alt={formData.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <p className="text-muted-foreground">{formData.summary}</p>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm">{formData.content}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={submitting || uploadingImage}
              className="w-full"
            >
              {uploadingImage ? "Uploading Image..." : submitting ? "Publishing..." : "Publish Blog Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
