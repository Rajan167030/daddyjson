import { NextRequest, NextResponse } from "next/server"

type ChatRole = "user" | "assistant"

type ChatMessage = {
  role: ChatRole
  content: string
}

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
    type?: string
    code?: string
  }
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const GITHUB_PROFILE_URL = "https://github.com/Rajan167030"
const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/rajan-jha-4a921828a/"
const PERSONAL_SITE_URL = "https://rajanjha.vercel.app"
const DEFAULT_MODEL = "llama-3.3-70b-versatile"
const FALLBACK_MODEL = "llama-3.1-8b-instant"

const BASE_CONTEXT = `You are JSON AI, the assistant for daddy.json.

Identity alignment:
- "daddy.json" brand and "Rajan Jha" personal brand have the same goal.
- Shared goal: make technology practical, understandable, and useful through tutorials, reviews, and real-world project guidance.

Verified profile details:
- Creator: Rajan Jha
- Location: New Delhi, India
- Contact: rajan.jha114430@gmail.com | +918860573577
- YouTube: @DaddyJSON
- GitHub: ${GITHUB_PROFILE_URL}
- LinkedIn: ${LINKEDIN_PROFILE_URL}
- Personal site: ${PERSONAL_SITE_URL}

Response behavior:
- Be concise, friendly, and technically accurate.
- If asked who created daddy.json, answer: "daddy.json was created by Rajan Jha."
- When relevant, mention the shared mission between Rajan and daddy.json.`

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []

  return input
    .map((item) => {
      if (!item || typeof item !== "object") return null

      const role = (item as { role?: unknown }).role
      const content = (item as { content?: unknown }).content

      if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
        return null
      }

      const trimmed = content.trim()
      if (!trimmed) return null

      return {
        role,
        content: trimmed.slice(0, 2000),
      }
    })
    .filter((msg): msg is ChatMessage => msg !== null)
    .slice(-12)
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

async function fetchWebsiteExcerpt(url: string, label: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "JSON-AI-Bot/1.0",
      },
      signal: AbortSignal.timeout(7000),
      cache: "no-store",
    })

    if (!response.ok) {
      return `${label}: unavailable (${response.status})`
    }

    const html = await response.text()
    const excerpt = stripHtml(html).slice(0, 600)
    return excerpt ? `${label}: ${excerpt}` : `${label}: available (no text extracted)`
  } catch {
    return `${label}: unavailable`
  }
}

async function fetchGitHubSummary(): Promise<string> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/Rajan167030", {
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      }),
      fetch("https://api.github.com/users/Rajan167030/repos?sort=updated&per_page=5", {
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      }),
    ])

    if (!userRes.ok || !reposRes.ok) {
      return "GitHub: unavailable"
    }

    const userData = (await userRes.json()) as {
      name?: string
      bio?: string
      public_repos?: number
      followers?: number
    }

    const reposData = (await reposRes.json()) as Array<{
      name?: string
      description?: string
    }>

    const repoLines = reposData
      .filter((repo) => repo?.name)
      .map((repo) => `${repo.name}${repo.description ? ` - ${repo.description}` : ""}`)
      .slice(0, 5)
      .join("; ")

    return `GitHub summary: name=${userData.name || "Rajan Jha"}, bio=${userData.bio || "n/a"}, public_repos=${userData.public_repos ?? "n/a"}, followers=${userData.followers ?? "n/a"}, recent_repos=${repoLines || "n/a"}`
  } catch {
    return "GitHub: unavailable"
  }
}

async function callGroq(
  groqApiKey: string,
  model: string,
  promptContext: string,
  messages: ChatMessage[],
): Promise<{ ok: true; reply: string } | { ok: false; status: number; details: string }> {
  const groqResponse = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 700,
      messages: [
        { role: "system", content: promptContext },
        ...messages,
      ],
    }),
    cache: "no-store",
  })

  if (!groqResponse.ok) {
    const errText = await groqResponse.text()
    return {
      ok: false,
      status: groqResponse.status,
      details: errText.slice(0, 600),
    }
  }

  const data = (await groqResponse.json()) as GroqResponse
  const reply = data.choices?.[0]?.message?.content?.trim()

  if (!reply) {
    return {
      ok: false,
      status: 502,
      details: "Groq returned no assistant message",
    }
  }

  return {
    ok: true,
    reply,
  }
}

export async function POST(request: NextRequest) {
  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 })
  }

  try {
    const body = (await request.json()) as { messages?: unknown }
    const messages = sanitizeMessages(body.messages)

    if (messages.length === 0) {
      return NextResponse.json({ error: "At least one user message is required" }, { status: 400 })
    }

    const [siteSummary, githubSummary] = await Promise.all([
      fetchWebsiteExcerpt(PERSONAL_SITE_URL, "Personal website"),
      fetchGitHubSummary(),
    ])

    const promptContext = `${BASE_CONTEXT}\n\nPublic context snapshot:\n- ${siteSummary}\n- ${githubSummary}\n- LinkedIn URL: ${LINKEDIN_PROFILE_URL} (profile scraping can be limited by platform restrictions).`

    const preferredModel = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL
    const modelCandidates = Array.from(new Set([preferredModel, DEFAULT_MODEL, FALLBACK_MODEL]))

    let chosenModel = preferredModel
    let chosenReply = ""
    let lastError: { status: number; details: string } | null = null

    for (const model of modelCandidates) {
      const result = await callGroq(groqApiKey, model, promptContext, messages)

      if (result.ok) {
        chosenModel = model
        chosenReply = result.reply
        break
      }

      lastError = { status: result.status, details: result.details }

      const isModelNotAvailable =
        result.status === 400 || result.status === 404 || /model|deprecat|not\s+found|unsupported/i.test(result.details)

      if (!isModelNotAvailable) {
        const passthroughStatus = result.status >= 400 && result.status < 600 ? result.status : 502
        return NextResponse.json(
          {
            error: `Groq API request failed (${result.status})`,
            details: result.details,
            model,
          },
          { status: passthroughStatus },
        )
      }
    }

    if (!chosenReply) {
      return NextResponse.json(
        {
          error: "All configured Groq models failed",
          details: lastError?.details || "Unknown upstream error",
          lastStatus: lastError?.status || 502,
          triedModels: modelCandidates,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      reply: chosenReply,
      provider: "groq",
      model: chosenModel,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error"
    return NextResponse.json({ error: "Failed to process chat request", details: message }, { status: 500 })
  }
}
