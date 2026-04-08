import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { isAdmin } from "@/lib/admin"
import { getDb } from "@/lib/mongodb"

/**
 * Blog API Route
 * GET: Retrieve all published blog posts
 * POST: Create a new blog post (admin only)
 * PUT: Update a blog post (admin only)
 * DELETE: Delete a blog post (admin only)
 */

type BlogPostDoc = {
  _id?: ObjectId
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

const defaultPosts: BlogPostDoc[] = [
  {
    id: "post-1",
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js: A Beginner's Guide",
    date: "April 12, 2023",
    summary: "Learn how to build modern web applications with Next.js, from setup to deployment.",
    content: "Full content of the blog post...",
    image: "/placeholder.svg?height=400&width=600",
    authorEmail: "rajan@mail.com",
    published: true,
  },
  {
    id: "post-2",
    slug: "best-coding-practices",
    title: "10 Best Coding Practices Every Developer Should Know",
    date: "March 28, 2023",
    summary: "Improve your code quality and efficiency with these essential coding practices.",
    content: "Full content of the blog post...",
    image: "/placeholder.svg?height=400&width=600",
    authorEmail: "rajan@mail.com",
    published: true,
  },
]

function mapBlogPost(doc: BlogPostDoc, upvotes = 0, downvotes = 0) {
  const fallbackId = doc._id ? String(doc._id) : ""
  return {
    id: doc.id || fallbackId,
    slug: doc.slug,
    title: doc.title,
    date: doc.date,
    summary: doc.summary,
    content: doc.content,
    image: doc.image,
    authorEmail: doc.authorEmail,
    published: doc.published,
    upvotes,
    downvotes,
  }
}

async function getBlogCollection() {
  const db = await getDb()
  const collection = db.collection<BlogPostDoc>("blog_posts")
  await collection.createIndex({ slug: 1 }, { unique: true })
  return collection
}

async function seedIfEmpty() {
  const collection = await getBlogCollection()
  const count = await collection.countDocuments()
  if (count === 0) {
    await collection.insertMany(defaultPosts)
  }
}

/**
 * GET - Retrieve all published blog posts
 */
export async function GET(request: NextRequest) {
  try {
    await seedIfEmpty()
    const collection = await getBlogCollection()
    const id = request.nextUrl.searchParams.get("id")

    if (id) {
      const query = {
        $or: [
          { id },
          { slug: id },
          { $expr: { $eq: [{ $toString: "$_id" }, id] } },
        ],
      }

      const post = await collection.findOne(query)
      if (!post || !post.published) {
        return NextResponse.json(
          { success: false, error: "Blog post not found" },
          { status: 404 }
        )
      }

      // Get vote counts for this post
      const db = await getDb()
      const blogId = post.id || String(post._id)
      const upvotes = await db.collection("blog_votes").countDocuments({
        blogId,
        voteType: 'up'
      })
      const downvotes = await db.collection("blog_votes").countDocuments({
        blogId,
        voteType: 'down'
      })

      return NextResponse.json(
        {
          success: true,
          data: mapBlogPost(post as BlogPostDoc, upvotes, downvotes),
        },
        { status: 200 }
      )
    }

    const published = await collection.find({ published: true }).sort({ _id: -1 }).toArray()

    // Get vote counts for all posts
    const db = await getDb()
    const data = await Promise.all(published.map(async (post: BlogPostDoc) => {
      const blogId = post.id || String(post._id)
      const upvotes = await db.collection("blog_votes").countDocuments({
        blogId,
        voteType: 'up'
      })
      const downvotes = await db.collection("blog_votes").countDocuments({
        blogId,
        voteType: 'down'
      })
      return mapBlogPost(post, upvotes, downvotes)
    }))

    return NextResponse.json(
      {
        success: true,
        data,
        total: data.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a new blog post (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const adminEmail = body.adminEmail || request.headers.get("x-admin-email")

    // Check admin permission
    if (!isAdmin(adminEmail)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }

    const { title, slug, summary, content, image, published } = body
    if (!title || !slug || !summary || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, slug, summary, content" },
        { status: 400 }
      )
    }

    const collection = await getBlogCollection()
    const existing = await collection.findOne({ slug })
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 }
      )
    }

    const newPost: BlogPostDoc = {
      id: `post-${Date.now()}`,
      title,
      slug,
      summary,
      content,
      image: image || "/placeholder.svg",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      authorEmail: adminEmail,
      published: published ?? true,
    }

    const insertResult = await collection.insertOne(newPost)
    const createdPost = await collection.findOne({ _id: insertResult.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Blog post created successfully",
        data: createdPost ? mapBlogPost(createdPost as BlogPostDoc) : null,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update a blog post (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const adminEmail = body.adminEmail || request.headers.get("x-admin-email")

    // Check admin permission
    if (!isAdmin(adminEmail)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }

    const { id, title, slug, summary, content, image, published } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing post id" },
        { status: 400 }
      )
    }

    const collection = await getBlogCollection()

    if (slug) {
      const duplicate = await collection.findOne({
        slug,
        $and: [
          { id: { $ne: id } },
          { $expr: { $ne: [{ $toString: "$_id" }, id] } },
        ],
      })
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: "Slug already exists" },
          { status: 409 }
        )
      }
    }

    const updateFields: Partial<BlogPostDoc> = {}
    if (title) updateFields.title = title
    if (slug) updateFields.slug = slug
    if (summary) updateFields.summary = summary
    if (content) updateFields.content = content
    if (image) updateFields.image = image
    if (published !== undefined) updateFields.published = published

    const updateResult = await collection.findOneAndUpdate(
      {
        $or: [
          { id },
          { $expr: { $eq: [{ $toString: "$_id" }, id] } },
        ],
      },
      { $set: updateFields },
      { returnDocument: "after" }
    )

    if (!updateResult) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog post updated successfully",
        data: mapBlogPost(updateResult as BlogPostDoc),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete a blog post (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const adminEmail = body.adminEmail || request.headers.get("x-admin-email")

    // Check admin permission
    if (!isAdmin(adminEmail)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      )
    }

    const { id } = body
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing post id" },
        { status: 400 }
      )
    }

    const collection = await getBlogCollection()
    const deletedPost = await collection.findOneAndDelete({
      $or: [
        { id },
        { $expr: { $eq: [{ $toString: "$_id" }, id] } },
      ],
    })
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog post deleted successfully",
        data: mapBlogPost(deletedPost as BlogPostDoc),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
