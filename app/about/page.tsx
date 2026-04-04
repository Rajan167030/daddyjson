"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { StaggeredChildren } from "@/components/animations/staggered-children"
import { StaggeredChild } from "@/components/animations/staggered-child"
import { LinkedInBioSection } from "@/components/linkedin-bio-section"
import { GlassCard } from "@/components/ui/cards/glass-card"
import { BounceButton } from "@/components/ui/buttons/bounce-button"
import { CursorEffect } from "@/components/cursor-effect"

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <CursorEffect />
      <div className="mx-auto max-w-4xl space-y-12">
        <FadeIn className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">About</h1>
          <p className="text-xl text-muted-foreground">Simplifying technology through practical learning and real-world project guidance</p>
        </FadeIn>

        {/* LinkedIn Bio Section with Profile Image */}
        <ScrollReveal>
          <LinkedInBioSection />
        </ScrollReveal>

        <ScrollReveal>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What We Focus On</h2>
            <StaggeredChildren className="grid gap-6 sm:grid-cols-2">
              <StaggeredChild>
                <GlassCard className="space-y-3 p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold">🎓 Learning Made Easy</h3>
                  <p className="text-muted-foreground">
                    Transform complex tech concepts into simple, understandable content that anyone can follow—from beginners to experienced developers.
                  </p>
                </GlassCard>
              </StaggeredChild>
              <StaggeredChild>
                <GlassCard className="space-y-3 p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold">💻 Real-World Projects</h3>
                  <p className="text-muted-foreground">
                    Build actual applications and systems through hands-on tutorials. Not just theory—practical skills you can use immediately.
                  </p>
                </GlassCard>
              </StaggeredChild>
              <StaggeredChild>
                <GlassCard className="space-y-3 p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold">🔍 Smart Reviews</h3>
                  <p className="text-muted-foreground">
                    Get honest, in-depth reviews of developer tools, frameworks, and technologies to help you make informed choices.
                  </p>
                </GlassCard>
              </StaggeredChild>
              <StaggeredChild>
                <GlassCard className="space-y-3 p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold">🚀 Open Source Guides</h3>
                  <p className="text-muted-foreground">
                    Explore trending open-source projects, understand how they work, and learn how to contribute to the global developer community.
                  </p>
                </GlassCard>
              </StaggeredChild>
            </StaggeredChildren>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Rajan Jha: The Creator</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rajan Jha is a passionate tech educator, open-source contributor, and creator of the daddy.json channel. Based in New Delhi, India, he's dedicated to making technology accessible and practical for everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With experience as a hackathon mentor, technical workshop speaker, and Medium writer, Rajan brings real-world expertise to every piece of content. His mission is to bridge the gap between curiosity and creation—helping you not just understand what's new in tech, but how to build amazing things with it.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Shared Mission</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 pt-4 border-l-4 border-primary pl-4">
                  <h3 className="font-bold text-lg">For Beginners</h3>
                  <p className="text-muted-foreground">Start your coding journey with clear, step-by-step tutorials. Learn fundamentals the right way from day one.</p>
                </div>
                <div className="space-y-2 pt-4 border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-lg">For Developers</h3>
                  <p className="text-muted-foreground">Stay updated with the latest trends, tools, and best practices. Level up your skills with advanced tutorials and deep dives.</p>
                </div>
                <div className="space-y-2 pt-4 border-l-4 border-pink-500 pl-4">
                  <h3 className="font-bold text-lg">For Creators</h3>
                  <p className="text-muted-foreground">Learn how to build projects that matter. From idea to deployment, we cover the complete development journey.</p>
                </div>
                <div className="space-y-2 pt-4 border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-lg">For Community</h3>
                  <p className="text-muted-foreground">Join a community of learners sharing knowledge and building amazing things together.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex justify-center">
          <Link href="/contact">
            <BounceButton className="gap-2">
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </BounceButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

