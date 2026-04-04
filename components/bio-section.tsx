"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Linkedin, Twitter, Github } from "lucide-react"

interface BioProfile {
  name: string
  title: string
  bio: string
  image: string
  email?: string
  linkedIn?: string
  twitter?: string
  github?: string
}

const profileData: BioProfile = {
  name: "Rajan Jha",
  title: "Tech Enthusiast | Content Creator | Founder",
  bio: "I'm passionate about simplifying technology through engaging content, coding tutorials, gadget reviews, and deep-dive discussions that make tech easy to understand. From exploring the latest innovations and emerging tools to breaking down open-source projects on GitHub, I aim to bridge the gap between curiosity and creation. Here, you'll learn not just what's new in tech — but how to use it effectively to build amazing things.",
  image: "/placeholder-user.jpg", // Replace with your actual image at /public/profile.jpg
  email: "rajan.jha114430@gmail.com",
  linkedIn: "https://www.linkedin.com/in/rajan-jha-4a921828a/",
  twitter: "https://x.com/rajanjh40593219",
  github: "https://github.com/Rajan167030",
}

export function BioSection() {
  return (
    <div className="w-full">
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
                  src={profileData.image}
                  alt={profileData.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {profileData.linkedIn && (
                <Link href={profileData.linkedIn} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-blue-500/10 hover:border-blue-500 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 text-blue-500" />
                  </Button>
                </Link>
              )}
              {profileData.twitter && (
                <Link href={profileData.twitter} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-sky-400/10 hover:border-sky-400 transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="h-5 w-5 text-sky-400" />
                  </Button>
                </Link>
              )}
              {profileData.github && (
                <Link href={profileData.github} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-500/10 hover:border-gray-500 transition-colors"
                    title="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              {profileData.email && (
                <Link href={`mailto:${profileData.email}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-500/10 hover:border-red-500 transition-colors"
                    title="Email"
                  >
                    <Mail className="h-5 w-5 text-red-500" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold">{profileData.name}</h3>
              <p className="text-lg text-primary font-semibold">{profileData.title}</p>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                {profileData.bio}
              </p>

              {/* Stats or Quick Info */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">100+</p>
                  <p className="text-sm text-muted-foreground">Videos Created</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">50K+</p>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">1M+</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="https://www.linkedin.com/in/rajan-jha-4a921828a/" target="_blank">
                <Button className="bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg transition-shadow">
                  Connect on LinkedIn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
