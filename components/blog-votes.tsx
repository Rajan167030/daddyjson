"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlogVotesProps {
  blogId: string
  initialUpvotes?: number
  initialDownvotes?: number
}

export function BlogVotes({ blogId, initialUpvotes = 0, initialDownvotes = 0 }: BlogVotesProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const { toast } = useToast()

  // Generate or get user ID
  useEffect(() => {
    let id = localStorage.getItem('blog-user-id')
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('blog-user-id', id)
    }
    setUserId(id)
  }, [])

  // Load vote data from server
  useEffect(() => {
    if (!userId) return

    const loadVotes = async () => {
      try {
        const response = await fetch(`/api/blog/vote?blogId=${blogId}&userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setUpvotes(data.upvotes || 0)
          setDownvotes(data.downvotes || 0)
          setUserVote(data.userVote)
        }
      } catch (error) {
        console.error('Error loading votes:', error)
        // Fallback to localStorage if API fails
        const savedVote = localStorage.getItem(`blog-vote-${blogId}`)
        if (savedVote === 'up' || savedVote === 'down') {
          setUserVote(savedVote)
        }
        const savedUpvotes = localStorage.getItem(`blog-upvotes-${blogId}`)
        const savedDownvotes = localStorage.getItem(`blog-downvotes-${blogId}`)
        if (savedUpvotes) setUpvotes(parseInt(savedUpvotes))
        if (savedDownvotes) setDownvotes(parseInt(savedDownvotes))
      }
    }

    loadVotes()
  }, [blogId, userId])

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isLoading || !userId) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/blog/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId, voteType, userId })
      })

      if (response.ok) {
        const data = await response.json()

        // Update state with server response
        setUpvotes(data.upvotes)
        setDownvotes(data.downvotes)
        setUserVote(data.userVote)

        // Update localStorage as backup
        if (data.userVote) {
          localStorage.setItem(`blog-vote-${blogId}`, data.userVote)
        } else {
          localStorage.removeItem(`blog-vote-${blogId}`)
        }
        localStorage.setItem(`blog-upvotes-${blogId}`, data.upvotes.toString())
        localStorage.setItem(`blog-downvotes-${blogId}`, data.downvotes.toString())

        // Show appropriate message
        let message = ""
        if (data.result.action === 'added') {
          message = `Blog ${voteType}voted!`
        } else if (data.result.action === 'removed') {
          message = "Vote removed"
        } else if (data.result.action === 'changed') {
          message = `Vote changed to ${voteType}vote`
        }

        toast({
          title: message,
          description: "Thanks for your feedback!",
        })

      } else {
        throw new Error('Failed to vote')
      }

    } catch (error) {
      console.error('Error voting:', error)

      // Fallback to localStorage if API fails
      const previousVote = userVote
      let newUpvotes = upvotes
      let newDownvotes = downvotes

      // Remove previous vote if exists
      if (previousVote === 'up') {
        newUpvotes -= 1
      } else if (previousVote === 'down') {
        newDownvotes -= 1
      }

      // Add new vote
      if (voteType === 'up') {
        if (previousVote !== 'up') {
          newUpvotes += 1
        }
        setUserVote(previousVote === 'up' ? null : 'up')
      } else {
        if (previousVote !== 'down') {
          newDownvotes += 1
        }
        setUserVote(previousVote === 'down' ? null : 'down')
      }

      setUpvotes(newUpvotes)
      setDownvotes(newDownvotes)

      // Save to localStorage
      const finalVote = previousVote === voteType ? null : voteType
      if (finalVote) {
        localStorage.setItem(`blog-vote-${blogId}`, finalVote)
      } else {
        localStorage.removeItem(`blog-vote-${blogId}`)
      }
      localStorage.setItem(`blog-upvotes-${blogId}`, newUpvotes.toString())
      localStorage.setItem(`blog-downvotes-${blogId}`, newDownvotes.toString())

      toast({
        title: "Vote saved locally",
        description: "Server unavailable, vote saved locally.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalVotes = upvotes - downvotes

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('up')}
          disabled={isLoading}
          className={`h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900 ${
            userVote === 'up' ? 'text-green-600 bg-green-100 dark:bg-green-900' : ''
          }`}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <span className={`text-sm font-medium ${
          totalVotes > 0 ? 'text-green-600' :
          totalVotes < 0 ? 'text-red-600' : 'text-muted-foreground'
        }`}>
          {totalVotes > 0 ? '+' : ''}{totalVotes}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('down')}
          disabled={isLoading}
          className={`h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 ${
            userVote === 'down' ? 'text-red-600 bg-red-100 dark:bg-red-900' : ''
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <div>{upvotes} up</div>
        <div>{downvotes} down</div>
      </div>
    </div>
  )
}