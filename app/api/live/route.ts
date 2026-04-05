import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { title, description, youtubeLink, isActive, scheduledTime } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()
    const session = {
      title,
      description,
      youtubeLink,
      scheduledTime,
      isActive: isActive || false,
      createdAt: new Date(),
    }

    await db.collection("live_sessions").insertOne(session)

    return NextResponse.json({ message: "Live session added successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error adding live session:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const db = await getDb()
    let query = {}
    if (activeOnly) {
      query = { isActive: true }
    }

    const sessions = await db.collection("live_sessions").find(query).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(sessions, { status: 200 })
  } catch (error) {
    console.error("Error fetching live sessions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const { isActive } = await request.json()
    const db = await getDb()

    await db.collection("live_sessions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive } }
    )

    return NextResponse.json({ message: "Session updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating live session:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
