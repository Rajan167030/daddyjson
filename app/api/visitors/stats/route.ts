import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

type VisitorStatsDoc = {
  _id: string
  totalVisits: number
  uniqueVisitors: string[]
}

export async function GET() {
  try {
    const db = await getDb()
    const statsCollection = db.collection<VisitorStatsDoc>('visitor_stats')
    const stats = await statsCollection.findOne({ _id: 'global' })

    return NextResponse.json({
      total: stats?.totalVisits ?? 0,
      unique: stats?.uniqueVisitors?.length ?? 0,
    })
  } catch (error) {
    console.error('Stats retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve stats' },
      { status: 500 }
    )
  }
}