import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { blogId, voteType, userId } = await request.json()

    if (!blogId || !voteType || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 })
    }

    const db = await getDb()

    // Check if user already voted on this blog
    const existingVote = await db.collection("blog_votes").findOne({
      blogId,
      userId
    })

    let result

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if same type
        await db.collection("blog_votes").deleteOne({ _id: existingVote._id })
        result = { action: 'removed', previousVote: voteType }
      } else {
        // Change vote type
        await db.collection("blog_votes").updateOne(
          { _id: existingVote._id },
          { $set: { voteType, updatedAt: new Date() } }
        )
        result = { action: 'changed', previousVote: existingVote.voteType, newVote: voteType }
      }
    } else {
      // Add new vote
      await db.collection("blog_votes").insertOne({
        blogId,
        userId,
        voteType,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      result = { action: 'added', newVote: voteType }
    }

    // Get updated vote counts
    const upvotes = await db.collection("blog_votes").countDocuments({
      blogId,
      voteType: 'up'
    })

    const downvotes = await db.collection("blog_votes").countDocuments({
      blogId,
      voteType: 'down'
    })

    return NextResponse.json({
      success: true,
      result,
      upvotes,
      downvotes,
      userVote: result.action === 'removed' ? null : voteType
    })

  } catch (error) {
    console.error("Error processing blog vote:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blogId = searchParams.get('blogId')
    const userId = searchParams.get('userId')

    if (!blogId) {
      return NextResponse.json({ error: "Blog ID required" }, { status: 400 })
    }

    const db = await getDb()

    // Get vote counts
    const upvotes = await db.collection("blog_votes").countDocuments({
      blogId,
      voteType: 'up'
    })

    const downvotes = await db.collection("blog_votes").countDocuments({
      blogId,
      voteType: 'down'
    })

    let userVote = null
    if (userId) {
      const userVoteDoc = await db.collection("blog_votes").findOne({
        blogId,
        userId
      })
      userVote = userVoteDoc?.voteType || null
    }

    return NextResponse.json({
      upvotes,
      downvotes,
      userVote
    })

  } catch (error) {
    console.error("Error fetching blog votes:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}