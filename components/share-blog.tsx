"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Mail, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareBlogProps {
  title: string
  url: string
  description?: string
}

export function ShareBlog({ title, url, description }: ShareBlogProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || "")

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "The blog link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this blog post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => openShareWindow(shareLinks.facebook)}
              className="gap-2 justify-start"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => openShareWindow(shareLinks.twitter)}
              className="gap-2 justify-start"
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => openShareWindow(shareLinks.linkedin)}
              className="gap-2 justify-start"
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              onClick={() => openShareWindow(shareLinks.whatsapp)}
              className="gap-2 justify-start"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp
            </Button>
          </div>

          {/* Email Share */}
          <Button
            variant="outline"
            onClick={() => window.location.href = shareLinks.email}
            className="w-full gap-2 justify-start"
          >
            <Mail className="h-4 w-4" />
            Share via Email
          </Button>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Or copy the link:</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={url}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}