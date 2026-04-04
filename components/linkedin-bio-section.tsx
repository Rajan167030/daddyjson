"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Linkedin, Twitter, Github } from "lucide-react"

export function LinkedInBioSection() {
  const linkedinUrl = "https://www.linkedin.com/in/rajan-jha-4a921828a/"
  const [avatarUrl, setAvatarUrl] = useState("/profile.jpg")

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      try {
        const res = await fetch("https://api.github.com/users/Rajan167030", {
          cache: "force-cache",
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        })
        if (res.ok) {
          const data = (await res.json()) as { avatar_url?: string }
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url)
          }
        }
      } catch (error) {
        console.log("Failed to fetch GitHub profile, using fallback image", error)
      }
    }

    fetchGitHubProfile()
  }, [])

  return (
    <Card className="overflow-hidden border-primary/20 hover:border-primary/40 transition-colors duration-300">
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 p-8 md:p-12">
        {/* Profile Image */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 rounded-2xl blur-xl opacity-20" />

            {/* Image container */}
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
              <Image
                src={avatarUrl}
                alt="Rajan Jha"
                width={200}
                height={200}
                className="w-full h-full object-cover"
                priority
                unoptimized
              />
            </div>

            {/* LinkedIn Badge */}
            <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 shadow-lg">
              <Linkedin className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 pt-4">
            <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-blue-500/10 hover:border-blue-500 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-blue-500" />
              </Button>
            </Link>
            <Link href="https://x.com/rajanjh40593219" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-sky-400/10 hover:border-sky-400 transition-colors"
                title="Twitter"
              >
                <Twitter className="h-5 w-5 text-sky-400" />
              </Button>
            </Link>
            <Link href="https://github.com/Rajan167030" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-gray-500/10 hover:border-gray-500 transition-colors"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="mailto:rajan.jha114430@gmail.com">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-500/10 hover:border-red-500 transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5 text-red-500" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Bio Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold">Rajan Jha</h3>
            <p className="text-lg text-primary font-semibold">Co-Founder@ Zerocarbon & Events INFO | Mentor & Judge 5x Hackathons | AI & Full stack engineer | Speaker | Freelancer</p>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Welcome to daddy.json - your go-to destination for everything tech-related. On this channel, I'm passionate about simplifying technology through engaging content, coding tutorials, gadget reviews, and deep-dive discussions that make tech easy to understand. From exploring the latest innovations and emerging tools to breaking down open-source projects on GitHub, we bridge the gap between curiosity and creation. Here, you'll learn not just what's new in tech — but how to use it effectively to build amazing things.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">Open Source</p>
                <p className="text-sm text-muted-foreground">Contributor</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">Tech Creator</p>
                <p className="text-sm text-muted-foreground"></p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">Judge & Mentor</p>
                <p className="text-sm text-muted-foreground">5x Hackathon</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">AI & Full Stack</p>
                <p className="text-sm text-muted-foreground">Engineer</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex gap-4 flex-wrap">
            <Link href={linkedinUrl} target="_blank">
              <Button className="bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg transition-shadow w-full md:w-auto">
                View LinkedIn Profile
              </Button>
            </Link>
            <Link href="https://github.com/Rajan167030" target="_blank">
              <Button className="bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg transition-shadow w-full md:w-auto">
                View GitHub Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Supported By Section */}
      <div className="border-t border-primary/10 bg-gradient-to-r from-primary/5 to-purple-500/5 px-8 py-8 md:px-12 md:py-10">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Supported By</h4>
          <div className="flex flex-wrap gap-2">
            {["Event INFO", "Zerocarbon", "Founders Connect", "Devnovate", "God Labs", "HackWithIndia"].map((company) => (
              <span
                key={company}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-sm font-semibold text-foreground hover:from-primary/20 hover:to-purple-500/20 transition-all duration-300"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
