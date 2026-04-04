# Dynamic Vlogs & Admin Blog System

This document explains how the dynamic vlog section and admin-only blog permissions work in the Daddy.json application.

## Overview

### Features Added

1. **Dynamic Vlog Section** - Users can view a collection of vlogs with dedicated detail pages for each vlog
2. **Admin-Only Blog Management** - Only authorized admins can create, update, or delete blog posts
3. **API Routes** - RESTful API endpoints for managing vlogs and blog posts

---

## Vlog System

### Structure

- **Main Page**: `/vlogs` - Lists all published vlogs
- **Detail Page**: `/vlogs/[id]` - Shows individual vlog with video player
- **API Route**: `/api/vlogs` - Manages vlog data

### How to Use

#### User: Viewing Vlogs

1. Navigate to the Vlogs page from the navigation menu
2. Browse all available vlogs in the grid layout
3. Click on any vlog card to open the dedicated vlog detail page
4. Watch the embedded video and read the description
5. View related vlogs suggestions

#### Admin: Creating/Managing Vlogs

Send a POST request to `/api/vlogs`:

```javascript
const newVlog = {
  adminEmail: "rajan@mail.com", // or "Rajan167"
  title: "My New Vlog",
  slug: "my-new-vlog",
  summary: "Brief description",
  description: "Full description",
  videoId: "YouTube-Video-ID",
  published: true
}

await fetch("/api/vlogs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-email": "rajan@mail.com"
  },
  body: JSON.stringify(newVlog)
})
```

---

## Blog System

### Structure

- **Main Page**: `/blog` - Lists all published blog posts
- **Detail Page**: `/blog/[id]` - Shows individual blog post
- **API Route**: `/api/blog` - Manages blog post data

### Admin Permissions

**Authorized Admins:**
- `rajan@mail.com`
- `Rajan167`

### How to Use

#### User: Reading Blog Posts

1. Navigate to the Blog page from the navigation menu
2. Browse articles in the grid layout
3. Click on any article to open the full blog post
4. Read the complete content

#### Admin: Managing Blog Posts

**Create a Blog Post:**
```javascript
const newPost = {
  adminEmail: "rajan@mail.com",
  title: "My Blog Post",
  slug: "my-blog-post",
  summary: "Summary text",
  content: "Full blog content",
  image: "/image-url.jpg",
  published: true
}

await fetch("/api/blog", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newPost)
})
```

**Update a Blog Post:**
```javascript
const updates = {
  adminEmail: "rajan@mail.com",
  id: "1",
  title: "Updated Title",
  published: true
}

await fetch("/api/blog", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updates)
})
```

**Delete a Blog Post:**
```javascript
await fetch("/api/blog", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    adminEmail: "rajan@mail.com",
    id: "1"
  })
})
```

---

## API Endpoints

### Vlogs API (`/api/vlogs`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/vlogs` | No | Get all published vlogs |
| GET | `/api/vlogs?id={id}` | No | Get specific vlog by ID or slug |
| POST | `/api/vlogs` | **Yes** | Create new vlog (admin only) |
| PUT | `/api/vlogs` | **Yes** | Update vlog (admin only) |
| DELETE | `/api/vlogs` | **Yes** | Delete vlog (admin only) |

### Blog API (`/api/blog`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/blog` | No | Get all published blog posts |
| POST | `/api/blog` | **Yes** | Create new post (admin only) |
| PUT | `/api/blog` | **Yes** | Update post (admin only) |
| DELETE | `/api/blog` | **Yes** | Delete post (admin only) |

---

## Admin Utility Functions

Located in `/lib/admin.ts`:

```typescript
// Check if user is admin
isAdmin("rajan@mail.com") // Returns: true
isAdmin("Rajan167") // Returns: true
isAdmin("user@example.com") // Returns: false

// Get list of authorized admins
getAdminList() // Returns: ["rajan@mail.com", "Rajan167"]
```

---

## Authentication Method

The system uses email/username-based authentication via headers or request body:

**Option 1: Header Authentication**
```javascript
fetch("/api/blog", {
  headers: {
    "x-admin-email": "rajan@mail.com"
  }
})
```

**Option 2: Body Authentication**
```javascript
fetch("/api/blog", {
  body: JSON.stringify({
    adminEmail: "rajan@mail.com",
    // other fields...
  })
})
```

---

## Adding More Admins

To add more admin users:

1. Open `/lib/admin.ts`
2. Add the email/username to the `ADMIN_EMAILS` array:

```typescript
const ADMIN_EMAILS = [
  "rajan@mail.com",
  "Rajan167",
  "newemail@example.com" // Add here
]
```

---

## Mock Data

Currently, the API uses mock data stored in memory. For production:

1. Integrate with Supabase (already configured in the project)
2. Create tables for `vlogs` and `blog_posts`
3. Update API routes to use Supabase queries instead of mock arrays

---

## Navigation Updates

The following navigation components have been updated to include the Vlogs link:

- `components/main-nav.tsx` - Desktop navigation
- `components/mobile-nav.tsx` - Mobile navigation

---

## Related Components

- `components/youtube-embed.tsx` - Video player component
- `components/animations/fade-in.tsx` - Animation effects
- `components/animations/scroll-reveal.tsx` - Scroll animations
- `components/ui/cards/tilt-card.tsx` - Card styling

---

## Error Handling

All API endpoints include error handling for:
- Missing required fields
- Unauthorized access (403 Forbidden)
- Not found errors (404)
- Server errors (500)

---

## Next Steps

1. **Test the vlogs page** - Navigate to `/vlogs` to see the vlog listing
2. **Test dynamic routes** - Click a vlog to see the detail page
3. **Test blog pages** - Navigate to `/blog` and click an article
4. **Integrate Supabase** - Replace mock data with real database
5. **Add admin panel** - Create admin interface for managing content

