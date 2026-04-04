import { NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCxkIzPnMxVVYr7FXLna5KNQ' // DaddyJSON channel ID
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@DaddyJSON'

async function fetchChannelById(channelId: string) {
  return fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`
  )
}

async function fetchChannelByHandle(handle: string) {
  return fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics,snippet&forHandle=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`
  )
}

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    )
  }

  try {
    // First try configured channel ID, then fallback to channel handle.
    let channelResponse = await fetchChannelById(CHANNEL_ID)
    
    if (!channelResponse.ok) {
      const details = await channelResponse.text()
      throw new Error(`Failed to fetch channel by ID (${channelResponse.status}): ${details.slice(0, 300)}`)
    }

    let channelData = await channelResponse.json()
    if (!channelData.items?.length) {
      channelResponse = await fetchChannelByHandle(CHANNEL_HANDLE)

      if (!channelResponse.ok) {
        const details = await channelResponse.text()
        throw new Error(`Failed to fetch channel by handle (${channelResponse.status}): ${details.slice(0, 300)}`)
      }

      channelData = await channelResponse.json()
    }

    if (!channelData.items?.length) {
      throw new Error(`No channel found for ID ${CHANNEL_ID} or handle ${CHANNEL_HANDLE}`)
    }

    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads
    const statistics = channelData.items[0]?.statistics
    const channelTitle = channelData.items[0]?.snippet?.title

    if (!uploadsPlaylistId) {
      throw new Error('No uploads playlist found')
    }

    // Fetch all videos with pagination
    let allVideos = []
    let nextPageToken = undefined

    while (true) {
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken || ''}&key=${YOUTUBE_API_KEY}`
      )

      if (!videosResponse.ok) {
        const details = await videosResponse.text()
        throw new Error(`Failed to fetch videos (${videosResponse.status}): ${details.slice(0, 300)}`)
      }

      const videosData = await videosResponse.json()

      // Transform the data to a simpler format
      const videos = videosData.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
      }))

      allVideos = [...allVideos, ...videos]

      // Check if there are more pages
      nextPageToken = videosData.nextPageToken
      if (!nextPageToken) {
        break
      }
    }

    return NextResponse.json({ 
      videos: allVideos,
      totalVideos: allVideos.length,
      source: {
        channelId: channelData.items[0]?.id || CHANNEL_ID,
        channelHandle: CHANNEL_HANDLE,
      },
      channelStats: {
        subscriberCount: statistics?.subscriberCount || '0',
        videoCount: statistics?.videoCount || '0',
        viewCount: statistics?.viewCount || '0',
        channelTitle: channelTitle || 'daddy.json'
      }
    })
  } catch (error) {
    console.error('YouTube API Error:', error)
    const details = error instanceof Error ? error.message : 'Unknown YouTube API error'
    return NextResponse.json(
      { error: 'Failed to fetch YouTube videos', details },
      { status: 500 }
    )
  }
}
