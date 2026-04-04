"use client"

import { Button } from "@/components/ui/button"
import { YoutubeEmbed } from "@/components/youtube-embed"
import { LatestVideos } from "@/components/latest-videos"
import { ChannelStats } from "@/components/channel-stats"
import { ArrowRight, Youtube } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GlassCard } from "@/components/ui/cards/glass-card"
import { TiltCard } from "@/components/animations/tilt-card"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { StaggeredChildren } from "@/components/animations/staggered-children"
import { StaggeredChild } from "@/components/animations/staggered-child"
import { GlowButton } from "@/components/ui/buttons/glow-button"
import { BounceButton } from "@/components/ui/buttons/bounce-button"
import { GlassButton } from "@/components/ui/buttons/glass-button"
import { WaveDivider } from "@/components/ui/dividers/wave-divider"
import { BlobDivider } from "@/components/ui/dividers/blob-divider"

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <FadeIn delay={0.1} direction="left">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm backdrop-blur-sm border border-primary/20">
                  Welcome to daddy.json
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Where Technology <span className="text-primary">Meets Conversation</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Exploring the latest in tech news, coding tutorials, gadget reviews, and insightful discussions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="https://www.youtube.com/@DaddyJSON" target="_blank" rel="noopener noreferrer">
                    <GlowButton size="lg" className="gap-2">
                      <Youtube className="h-5 w-5" />
                      Subscribe on YouTube
                    </GlowButton>
                  </Link>
                  <Link href="/videos">
                    <GlassButton variant="outline" size="lg" className="gap-1">
                      Watch Videos
                      <ArrowRight className="h-4 w-4" />
                    </GlassButton>
                  </Link>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} direction="right">
              <TiltCard className="group">
                <YoutubeEmbed videoId="pO1BXqbiITQ" title="daddy.json Channel" />
              </TiltCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* Channel Intro */}
      <section className="py-12">
        <div className="container space-y-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About the Channel</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg mt-4">
              daddy.json is your go-to destination for everything tech-related. From breaking news and in-depth
              reviews to coding tutorials and tech tips, we cover it all with a conversational approach that makes
              technology accessible to everyone.
            </p>
          </ScrollReveal>

          {/* Channel Statistics */}
          <ScrollReveal delay={0.2}>
            <ChannelStats />
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex justify-center mt-6">
              <Link href="/about">
                <BounceButton variant="outline" className="gap-1">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
                </BounceButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <BlobDivider />

      {/* Latest Videos */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container space-y-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Latest Videos</h2>
                <p className="text-muted-foreground">Check out our most recent content</p>
              </div>
              <Link href="/videos">
                <Button variant="outline" className="gap-1 hover:bg-primary/10 transition-colors">
                  View All Videos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <LatestVideos limit={3} />
        </div>
      </section>

      <WaveDivider inverted={true} />

      {/* CTA Section */}
      <section className="py-12">
        <div className="container">
          <ScrollReveal>
            <GlassCard className="p-6 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent pointer-events-none"></div>
              <div className="grid gap-6 md:grid-cols-2 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Join Our Tech Community</h2>
                  <p className="text-muted-foreground">
                    Subscribe to our YouTube channel for weekly videos on tech news, coding tutorials, and gadget
                    reviews.
                  </p>
                  <Link href="https://www.youtube.com/@DaddyJSON" target="_blank" rel="noopener noreferrer">
                    <GlowButton size="lg" className="gap-2">
                      <Youtube className="h-5 w-5" />
                      Subscribe on YouTube
                    </GlowButton>
                  </Link>
                </div>
                <TiltCard className="group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-background border border-primary/20 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="daddy.json Logo"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl"
                      priority
                    />
                  </div>
                </TiltCard>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

