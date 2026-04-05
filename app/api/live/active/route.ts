import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function PATCH() {
  try {
    const db = await getDb()
    await db.collection("live_sessions").updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    )

    return NextResponse.json({ message: "Active sessions marked as inactive" }, { status: 200 })
  } catch (error) {
    console.error("Error updating active sessions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}