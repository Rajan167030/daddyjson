import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { v2 as cloudinary } from "cloudinary"
import { ObjectId } from "mongodb"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const link = formData.get("link") as string
    const image = formData.get("image") as File

    if (!title || !description || !link || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const eventId = new ObjectId()

    // Upload image to Cloudinary
    const arrayBuffer = await image.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "events",
          public_id: eventId.toHexString(),
        },
        (error, result) => {
          if (error) {
            reject(error)
          }
          resolve(result)
        }
      ).end(buffer)
    })

    // @ts-ignore
    const imageUrl = uploadResult.secure_url

    const db = await getDb()
    const event = {
      _id: eventId,
      title,
      description,
      link,
      imageUrl,
      createdAt: new Date(),
    }

    await db.collection("events").insertOne(event)

    return NextResponse.json({ message: "Event added successfully", eventId: eventId.toHexString() }, { status: 201 })
  } catch (error) {
    console.error("Error adding event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const events = await db.collection("events").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
