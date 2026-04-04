import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { isAdmin } from '@/lib/admin'
import { getDb } from '@/lib/mongodb'

const resendApiKey = process.env.RESEND_API_KEY

const CONTACT_COLLECTION = 'contact_submissions'

function formatQueryId(id: number | null | undefined): string {
  if (typeof id !== 'number') return `Q-${Date.now()}`
  return `Q-${String(id).padStart(6, '0')}`
}

export async function GET(request: NextRequest) {
  try {
    const adminIdentifier = request.headers.get('x-admin-email')

    if (!isAdmin(adminIdentifier)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const submissionsRaw = await db
      .collection(CONTACT_COLLECTION)
      .find({})
      .sort({ created_at: -1 })
      .toArray()

    const submissions = submissionsRaw.map((item: any) => ({
      id: item._id?.toString?.() || '',
      queryId: item.queryId || formatQueryId(item.numericId),
      name: item.name || '',
      email: item.email || '',
      message: item.message || '',
      status: item.status || 'unread',
      created_at: item.created_at || new Date().toISOString(),
    }))

    return NextResponse.json({ data: submissions }, { status: 200 })
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to load admin queries', details },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
      status: 'unread',
      created_at: new Date().toISOString(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Use MongoDB for reliable local/production inserts.
    const db = await getDb()
    const count = await db.collection(CONTACT_COLLECTION).countDocuments()
    const numericId = count + 1
    const queryId = formatQueryId(numericId)

    const insertResult = await db.collection(CONTACT_COLLECTION).insertOne({
      numericId,
      queryId,
      ...payload,
    })

    if (!insertResult.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to save contact form data' },
        { status: 500 }
      )
    }

    // Send email notification using Resend
    try {
      if (resendApiKey) {
        const resend = new Resend(resendApiKey)
        const emailData = await resend.emails.send({
          from: 'Contact Form <onboarding@resend.dev>', // Use your verified domain
          to: 'rajan.jha114430@gmail.com', // Your email address
          subject: `New Contact Form Submission from ${name}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>

            <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <p style="margin: 10px 0;"><strong>Query ID:</strong> ${queryId}</p>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div style="background: #ffffff; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

            <p style="color: #666; font-size: 12px;">
              This message was sent from the daddy.json contact form.
            </p>
          </div>
        `,
        })

        console.log('Email sent successfully:', emailData)
      } else {
        console.warn('RESEND_API_KEY not set. Skipping email notification.')
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully!', queryId },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    const details = error instanceof Error ? error.message : 'Unknown internal error'
    return NextResponse.json(
      { error: 'Internal server error', details },
      { status: 500 }
    )
  }
}