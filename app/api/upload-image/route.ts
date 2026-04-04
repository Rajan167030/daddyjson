import { createHash } from "crypto"
import { NextRequest, NextResponse } from "next/server"

function getCloudinaryEnv() {
  const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET
  const folder = process.env.CLOUDINARY_FOLDER || "daddy_json/blogs"

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables")
  }

  return { cloudName, apiKey, apiSecret, folder }
}

function signUpload(folder: string, timestamp: number, apiSecret: string) {
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  return createHash("sha1").update(toSign).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { fileData } = await request.json()

    if (!fileData || typeof fileData !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing fileData" },
        { status: 400 }
      )
    }

    const { cloudName, apiKey, apiSecret, folder } = getCloudinaryEnv()
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = signUpload(folder, timestamp, apiSecret)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const body = new URLSearchParams({
      file: fileData,
      api_key: apiKey,
      timestamp: String(timestamp),
      signature,
      folder,
    })

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error?.message || "Cloudinary upload failed",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      secure_url: data.secure_url,
      public_id: data.public_id,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
