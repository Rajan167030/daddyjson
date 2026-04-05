"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { io, Socket } from "socket.io-client"

interface Comment {
  id: string
  user: string
  message: string
  timestamp: Date
}

interface LiveSession {
  _id: string
  title: string
  description: string
  scheduledTime?: string
}

export default function LiveSessionPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userName, setUserName] = useState("")
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const newSocket = io("/api/socket")
    setSocket(newSocket)

    newSocket.on("connect", () => {
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
    })

    newSocket.on("comment", (comment: Comment) => {
      setComments(prev => [...prev, comment])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Check for active sessions
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const response = await fetch("/api/live?active=true")
        if (response.ok) {
          const sessions = await response.json()
          if (sessions.length > 0) {
            setActiveSession(sessions[0])
            setShowAlert(true)
            // Auto-hide alert after 10 seconds
            setTimeout(() => setShowAlert(false), 10000)
          } else {
            setActiveSession(null)
          }
        }
      } catch (error) {
        console.error("Failed to check active session:", error)
      }
    }

    // Check immediately and then every 30 seconds
    checkActiveSession()
    const interval = setInterval(checkActiveSession, 30000)

    return () => clearInterval(interval)
  }, [])

  const sendComment = () => {
    if (newComment.trim() && socket && userName.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: userName,
        message: newComment,
        timestamp: new Date()
      }
      socket.emit("comment", comment)
      setComments(prev => [...prev, comment])
      setNewComment("")
    }
  }

  return (
    <div className="container mx-auto py-12">
      {showAlert && activeSession && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
          <AlertDescription className="text-green-800 dark:text-green-200">
            🎉 <strong>Session is Live!</strong> "{activeSession.title}" is now streaming. Join the live session below!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Video Stream */}
        <Card>
          <CardHeader>
            <CardTitle>Live Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-full object-cover"
              />
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Waiting for host to start session...
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Status: {isConnected ? "Connected" : "Disconnected"}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Live Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name..."
                className="mb-2"
              />
            </div>
            <ScrollArea className="h-64 mb-4">
              <div className="space-y-2">
                {comments.map(comment => (
                  <div key={comment.id} className="p-2 bg-muted rounded">
                    <div className="font-semibold">{comment.user}</div>
                    <div>{comment.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type a comment..."
                onKeyPress={(e) => e.key === "Enter" && sendComment()}
                disabled={!userName.trim()}
              />
              <Button onClick={sendComment} disabled={!userName.trim()}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
