"use client"

import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BounceButton } from "@/components/ui/buttons/bounce-button"

export default function PrivacyPolicyPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <FadeIn className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </FadeIn>

        <ScrollReveal>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
              <p>
                Welcome to daddy.json ("we", "our", "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Personal Data:</strong> Name, email address, contact information when you voluntarily submit it</li>
                <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visits</li>
                <li><strong>Cookies:</strong> We use cookies to track user preferences and website functionality</li>
                <li><strong>YouTube Integration:</strong> Data from YouTube API for channel and video information</li>
                <li><strong>GitHub Integration:</strong> Profile information when you view creator details</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our website and services</li>
                <li>To notify you about changes to our services</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To analyze usage patterns and improve our content</li>
                <li>To detect and prevent fraudulent transactions</li>
                <li>To send promotional communications (with your consent)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">4. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">5. Third-Party Services</h2>
              <p>
                Our website integrates with third-party services including YouTube, GitHub, Groq AI, and other APIs. These services may collect information as described in their respective privacy policies. We are not responsible for their practices.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes via email or by posting the updated policy on our website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="text-foreground">
                Email: <a href="mailto:rajan.jha114430@gmail.com" className="text-primary hover:underline">rajan.jha114430@gmail.com</a><br />
                Location: New Delhi, India
              </p>
            </section>
          </div>
        </ScrollReveal>

        <div className="flex justify-center pt-8 border-t border-border">
          <Link href="/">
            <BounceButton className="gap-2">
              Back to Home
              <ArrowRight className="h-4 w-4" />
            </BounceButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
