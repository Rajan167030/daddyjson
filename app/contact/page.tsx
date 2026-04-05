"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Youtube, Twitter, Linkedin, Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { GlassCard } from "@/components/ui/cards/glass-card"
import { FloatingLabelInput } from "@/components/ui/input/floating-label-input"
import { FloatingLabelTextarea } from "@/components/ui/input/floating-label-textarea"
import { GlowButton } from "@/components/ui/buttons/glow-button"
import { Faq } from "@/components/faq"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [queryId, setQueryId] = useState("")
  const [submitError, setSubmitError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = (await response.json()) as { queryId?: string }
        setSubmitStatus('success')
        setQueryId(data.queryId || '')
        setFormData({ name: '', email: '', message: '' })
      } else {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string; details?: string }
        setSubmitStatus('error')
        setQueryId('')
        setSubmitError([errorData.error, errorData.details].filter(Boolean).join(' | '))
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setQueryId('')
      setSubmitError(error instanceof Error ? error.message : 'Network request failed')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="container relative px-4 md:px-6 py-12">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-200/20 tracking-wider">
          DADDY JSON
        </h1>
      </div>
      
      <div className="relative z-10 mx-auto max-w-4xl space-y-12">
        <FadeIn className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Have a question or want to collaborate? Get in touch with us.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2">
          <ScrollReveal direction="left">
            <GlassCard className="space-y-6 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Send a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="name"
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="email"
                    type="email"
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelTextarea
                    id="message"
                    label="Message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                {submitStatus === 'success' && (
                  <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                    ✅ Message sent successfully! Query ID: <span className="font-semibold">{queryId || 'Assigned'}</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    ❌ Failed to send message. Please try again or contact us directly.
                    {submitError ? <div className="mt-1 text-xs break-words">{submitError}</div> : null}
                  </div>
                )}
                <GlowButton type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </GlowButton>
              </form>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <GlassCard className="space-y-6 p-6 h-full">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Connect With Us</h2>
                <p className="text-muted-foreground">Follow us on social media or reach out directly.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>rajan.jha114430@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+918860573577</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>New Delhi</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Social Media</h3>
                <div className="flex gap-4">
                  <Link href="https://www.youtube.com/@DaddyJSON" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="YouTube Channel"
                      className="hover:text-primary hover:border-primary transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="https://x.com/rajanjh40593219" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Twitter/X"
                      className="hover:text-primary hover:border-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="https://github.com/Rajan167030" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="GitHub"
                      className="hover:text-primary hover:border-primary transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/rajan-jha-4a921828a/" target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="LinkedIn"
                      className="hover:text-primary hover:border-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div id="newsletter" className="space-y-4 rounded-lg border p-6 bg-primary/5">
                <h3 className="text-lg font-medium">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-muted-foreground">
                  Get the latest updates, videos, and blog posts delivered to your inbox.
                </p>
                <div className="flex gap-2">
                  <FloatingLabelInput label="Your email address" />
                  <GlowButton type="submit">Subscribe</GlowButton>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <Faq />
        </ScrollReveal>
      </div>
    </div>
  )
}

