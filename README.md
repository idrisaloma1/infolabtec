# INFOLAB TECH BRIDGE

"From Learning to Building." — dynamic portfolio + content management platform for INFOLAB's
Bootcamp: class activities, photo/video galleries, student project portfolio, events, and an
admin dashboard, all editable without touching code.

## Structure

```
infolab-tech-bridge/
  backend/    Express API + Postgres (Supabase-ready), JWT admin auth, file uploads
  frontend/   React (Vite) + Tailwind CSS, React Router
```

## Status — full site built

**Backend** — full DB schema (activities, media, projects, events, gallery, messages, admins,
site_stats); auth (login + one-time admin setup); activities (public + admin CRUD, draft → review
→ publish, photo/video upload, media reorder/caption/delete); projects; events; gallery albums;
contact messages; editable homepage stats; admin dashboard summary counts. Security: helmet, CORS
allow-list, rate limiting on login and the contact form, bcrypt password hashing, JWT-protected
admin routes, file type/size validation on uploads.

**Public site** — Home (hero, animated stats, about teaser, "What We Teach" cards, bootcamp
learning journey, featured projects, "From Our Classroom" featured activities, CTA), About,
Photo Gallery (category-filtered class activities grid), Activity detail (photo lightbox +
muted-preview video player), Portfolio (category-filtered project grid), Project detail, Next
Event (live countdown, registration details), Contact (form wired to the API + WhatsApp button).

**Admin dashboard** (`/admin`, JWT-protected) — login, dashboard summary counts, Manage Class
Activities (create/edit, draft→review→publish, multi-photo/video upload, delete media), Manage
Portfolio (create/edit projects, screenshot upload, URL validation), Manage Events (countdown
fields, banner upload), Manage Gallery (standalone albums + media upload), Manage Messages
(read/unread, delete), Manage Homepage Stats.

Still to build/refine: image optimization + auto-thumbnailing pipeline, drag-to-reorder for
activity media (currently upload-order only), Supabase Storage swap-in for uploads (see note
below), a Manage Bootcamps screen (the `bootcamps` table exists but has no admin UI yet), and
production email notifications via Resend for new contact messages.

## Local setup

### Backend
```bash
cd backend
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, SETUP_SECRET, CORS_ORIGIN
npm install
npm run migrate           # applies schema.sql
npm run dev                # http://localhost:4000
```

Create the first admin (one-time, then remove SETUP_SECRET from your env):
```bash
curl -X POST http://localhost:4000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Idris","email":"admin@infolabtechbridge.com","password":"a-strong-password","setupSecret":"<your SETUP_SECRET>"}'
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # http://localhost:5173, proxies /api and /uploads to :4000
```

## Deploying (matches the EduTec pattern)

- **Backend**: Railway, with `DATABASE_URL` pointed at a Supabase Postgres instance. Run
  `npm run migrate` once against production before first boot. Uploaded media currently lands on
  local disk under `backend/uploads` — fine on a single Railway service with a persistent volume,
  but for real scale swap `middleware/upload.js`'s disk storage for Supabase Storage (S3-compatible)
  so files survive redeploys and can be served from a CDN.
- **Frontend**: build with `npm run build` and deploy the `dist/` folder (Railway static service,
  Vercel, or Netlify all work) — point it at the backend's public URL via `vite.config.js` proxy
  or an `VITE_API_URL` env var once we wire that in.
- **Email** (contact-form notifications, event reminders): use Resend, same as EduTec, since
  Railway blocks outbound SMTP.

## Next step

Tell me which of the "still to build/refine" items to tackle next, or flag anything you want
changed in what's already there — happy to keep iterating in the same pattern.
