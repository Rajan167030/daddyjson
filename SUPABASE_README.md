# Supabase Setup for Contact Form

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully set up

## 2. Get Your Project Credentials

1. Go to your project settings
2. Copy the "Project URL" and "anon public" key
3. Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up the Database

1. Go to the SQL Editor in your Supabase dashboard
2. Run the SQL from `supabase-setup.sql` to create the contact_submissions table

## 4. Set Up Email Notifications with Resend

### Step 1: Create a Resend Account
1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your email address

### Step 2: Get Your API Key
1. Go to your Resend dashboard
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key

### Step 3: Update Environment Variables
Add your Resend API key to `.env.local`:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### Step 4: Verify Your Domain (Optional but Recommended)
1. In Resend dashboard, go to Domains
2. Add and verify your domain (e.g., daddyjson.com)
3. Update the `from` email in the API route to use your verified domain

## 5. Test the Contact Form

1. Start your development server: `pnpm dev`
2. Go to the contact page (`/contact`)
3. Fill out and submit the form
4. Check your email (rajan.jha114430@gmail.com) for the notification
5. Check your Supabase dashboard to see the submissions in the `contact_submissions` table

## Email Template

The email notification includes:
- Sender's name and email
- Message content
- Submission timestamp
- Professional HTML formatting

## Troubleshooting

### Email Not Sending?
1. Check your Resend API key is correct
2. Verify your Resend account has sending credits
3. Check the server logs for any errors
4. Make sure the `from` email is properly configured

### Database Issues?
1. Ensure the `contact_submissions` table was created
2. Check your Supabase credentials
3. Verify Row Level Security policies are set up

## Alternative Email Services

If you prefer other services, you can easily modify the `/app/api/contact/route.ts` file to use:
- SendGrid
- Mailgun
- Postmark
- AWS SES

Just replace the Resend code with your preferred service's API calls.