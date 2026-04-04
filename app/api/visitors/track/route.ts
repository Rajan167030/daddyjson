import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

type VisitorStatsDoc = {
  _id: string
  totalVisits: number
  uniqueVisitors: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Clean IP (remove port if present)
    const cleanIp = ip.split(',')[0].split(':')[0]

    const db = await getDb()
    const statsCollection = db.collection<VisitorStatsDoc>('visitor_stats')

    await statsCollection.updateOne(
      { _id: 'global' },
      {
        $inc: { totalVisits: 1 },
        $addToSet: { uniqueVisitors: cleanIp },
      },
      { upsert: true }
    )

    const stats = await statsCollection.findOne({ _id: 'global' })

    return NextResponse.json({
      total: stats?.totalVisits ?? 0,
      unique: stats?.uniqueVisitors?.length ?? 0,
    })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}