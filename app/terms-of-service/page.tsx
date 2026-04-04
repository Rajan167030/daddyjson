"use client"

import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BounceButton } from "@/components/ui/buttons/bounce-button"

export default function TermsOfServicePage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <FadeIn className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </FadeIn>

        <ScrollReveal>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using daddy.json ("Site," "we," "us," or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on daddy.json for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the Site</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">3. Disclaimer</h2>
              <p>
                The materials on daddy.json are provided on an 'as is' basis. daddy.json makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">4. Limitations of Liability</h2>
              <p>
                In no event shall daddy.json or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on daddy.json, even if daddy.json or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on daddy.json could include technical, typographical, or photographic errors. daddy.json does not warrant that any of the materials on its Site are accurate, complete, or current. daddy.json may make changes to the materials contained on its Site at any time without notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">6. Links</h2>
              <p>
                daddy.json has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by daddy.json of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">7. Modifications</h2>
              <p>
                daddy.json may revise these terms of service for its Site at any time without notice. By using this Site, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">8. User Content</h2>
              <p>
                By submitting content to our Site (comments, messages, feedback), you grant daddy.json a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">9. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Post or transmit unlawful, threatening, abusive, defamatory, obscene or otherwise objectionable material</li>
                <li>Disrupt the normal flow of dialogue within our Site</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools (bots, scrapers) without permission</li>
                <li>Harass or harm other users</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">10. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts located in New Delhi, India.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
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
