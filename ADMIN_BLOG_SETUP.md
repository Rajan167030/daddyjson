# Admin Blog Management System

This document explains the admin-only blog management system for the Daddy.json website.

## Overview

The website now features:
- **Dynamic Blog System** - Users can view blog posts
- **Admin-Only Blog Management** - Only authorized admins can create, edit, and delete blog posts
- **Image Upload & Paste Support** - Admins can upload images or paste them directly while writing
- **Admin Dashboard** - Central hub for managing all blog content
- **Admin Blog Editor** - Rich editor for writing blog posts with image support

---

## Features

### For Users
✨ Browse published blog posts  
✨ Read full blog articles with featured images  
✨ Responsive design for all devices  

### For Admins
✨ Write and publish blog posts  
✨ Upload cover images by clicking or pasting from clipboard  
✨ Edit existing blog posts  
✨ Delete blog posts  
✨ Toggle between published and draft status  
✨ Preview blog posts before publishing  
✨ View all blog posts in a dashboard  

---

## How to Use

### Admin Login

1. **First Time Setup:**
   - Visit `/admin/write-blog` or `/admin/dashboard`
   - Enter your admin email (rajan@mail.com or Rajan167)
   - Click "Login as Admin"
   - Your session will be saved to localStorage

2. **To Logout:**
   - Click the "Logout" button in the admin dashboard footer

### Writing a Blog Post

1. **Navigate to Write Blog Page:**
   - Go to `/admin/write-blog`
   - Or use the "Write Blog" button on the blog page (visible only to logged-in admins)
   - Or click "Write Blog" in the admin section of the footer

2. **Fill in the Blog Form:**
   - **Title:** Enter your blog post title
   - **URL Slug:** Auto-generated from title (can be edited)
   - **Summary:** Brief description (appears on blog listing)
   - **Cover Image:** Upload by clicking or paste from clipboard
   - **Content:** Write your full blog post
   - **Status:** Choose Published or Draft

3. **Upload/Paste Image:**
   - **Click to Upload:** Click the image area and select a file
   - **Paste from Clipboard:** Copy an image and paste in the editor
   - Supported formats: JPG, PNG, GIF, WebP

4. **Preview Before Publishing:**
   - Click "Show Preview" to see how your blog will look
   - The preview shows the exact layout users will see
   - Click "Hide Preview" to continue editing

5. **Publish:**
   - Click "Publish Blog Post" to save and publish
   - You'll be redirected to the blog page after successful publish
   - Unpublished posts saved as drafts appear in the dashboard

### Managing Blog Posts

1. **Open Admin Dashboard:**
   - Go to `/admin/dashboard`
   - You'll see all your blog posts in a table

2. **View All Posts:**
   - See title, publish date, and current status
   - Status shows "Published" or "Draft"

3. **Edit a Post:**
   - Click the edit icon (pencil) next to a blog post
   - Make changes and save

4. **Delete a Post:**
   - Click the delete icon (trash) next to a blog post
   - Confirm deletion in the dialog
   - Post will be permanently removed

---

## Admin Credentials

**Authorized Admins:**
- Email: `rajan@mail.com`
- Username: `Rajan167`

To add more admins, edit `/lib/admin.ts` and add emails/usernames to the `ADMIN_EMAILS` array.

---

## API Endpoints

### Blog API (`/api/blog`)

**GET** - Retrieve all published blog posts
```javascript
const response = await fetch("/api/blog")
const { data } = await response.json()
// Returns: Array of published blog posts
```

**POST** - Create new blog post (admin only)
```javascript
const response = await fetch("/api/blog", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-email": "rajan@mail.com"
  },
  body: JSON.stringify({
    title: "My Blog Post",
    slug: "my-blog-post",
    summary: "Summary text",
    content: "Full content",
    image: "base64-image-data",
    published: true
  })
})
```

**PUT** - Update blog post (admin only)
```javascript
const response = await fetch("/api/blog", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "x-admin-email": "rajan@mail.com"
  },
  body: JSON.stringify({
    id: "post-id",
    title: "Updated Title",
    // ... other fields to update
  })
})
```

**DELETE** - Delete blog post (admin only)
```javascript
const response = await fetch("/api/blog", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    "x-admin-email": "rajan@mail.com"
  },
  body: JSON.stringify({ id: "post-id" })
})
```

---

## Pages

### User-Facing Pages
- `/blog` - Blog listing page with all published posts
- `/blog/[slug]` - Individual blog post detail page

### Admin Pages
- `/admin/write-blog` - Write/create a new blog post
- `/admin/dashboard` - Manage all blog posts
- `/admin/edit-blog/[id]` - Edit existing blog post (coming soon)

---

## Component Files

### New Components Created
- `app/admin/write-blog/page.tsx` - Blog editor with image upload
- `app/admin/dashboard/page.tsx` - Admin dashboard
- `app/blog/[id]/page.tsx` - Blog detail page
- `app/api/blog/route.ts` - Blog API endpoint
- `lib/admin.ts` - Admin authorization utilities

### Updated Components
- `app/blog/page.tsx` - Updated to fetch from API and show write blog button
- `components/site-footer.tsx` - Added admin section for logged-in admins
- `components/main-nav.tsx` - Removed vlogs link

---

## Image Upload

### Types of Images Supported
- JPG / JPEG
- PNG
- GIF
- WebP

### Image Storage
Images are stored as **base64 data** in the database. This allows:
✅ Instant preview and display  
✅ No external storage needed  
✅ Portable blog data  

For production, consider using a service like Imgur or AWS S3 for better performance.

---

## Authentication

The system uses localStorage-based authentication:

1. Admin enters their email/username in the login form
2. System checks against the `ADMIN_EMAILS` list in `/lib/admin.ts`
3. If authorized, email is saved to `localStorage.adminEmail`
4. All API requests include the `x-admin-email` header
5. Server validates admin status before allowing modifications

⚠️ **Note:** This is a simple auth system for demo purposes. For production, implement proper authentication with:
- Password-protected login
- Session tokens
- Database user management
- Secure password hashing

---

## Adding More Admins

To add more authorized admins:

1. Open `/lib/admin.ts`
2. Add email or username to the `ADMIN_EMAILS` array:

```typescript
const ADMIN_EMAILS = [
  "rajan@mail.com",
  "Rajan167",
  "newadmin@example.com", // Add here
]
```

3. The new admin will immediately have access

---

## Troubleshooting

### "Admin access required" message
- Make sure you're logged in with an authorized email
- Check that your email is in the `ADMIN_EMAILS` list
- Try logging out and logging back in

### Image not uploading
- Check file size (very large files may fail)
- Try a different image format
- Clear browser cache and try again
- Try pasting directly from clipboard

### Blog post not appearing
- Make sure "Published" status is selected
- Check the blog listing page after a few seconds
- Try refreshing the page

### Lost admin session
- Your session is saved in browser localStorage
- Clearing browser data will log you out
- You'll need to login again

---

## Future Enhancements

Planned features:
- [ ] Blog post categories/tags
- [ ] Search functionality
- [ ] Comment system
- [ ] Social sharing buttons
- [ ] SEO optimization
- [ ] Scheduled publishing
- [ ] Advanced text formatting
- [ ] Persistent image storage (S3/Imgur)
- [ ] Multi-user admin support
- [ ] Blog post analytics

---

## Support

For issues or questions, contact: rajan@mail.com

