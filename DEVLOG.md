# Dev Log

## Day 1 — 2026-05-22

**Hours worked:** ~4

**What I did:** Set up Next.js with TypeScript and Tailwind. Created GitHub repo and deployed to Vercel. Set up Supabase with audits and leads tables. Configured environment variables for Supabase, Groq, and Resend. Built the homepage with grid background, the audit form with 8 AI tools, and the audit engine with rules-based recommendations for each tool.

**What I learned:** How to fix PowerShell execution policy issues on Windows. How Supabase SQL editor works.

**Blockers:** Matrix canvas animation not rendering in dev mode, settled on grid background instead.

**Plan for tomorrow:** Build the API routes connecting the form to Supabase and the results page showing per-tool recommendations and savings. Test the full end-to-end flow.

## Day 2 — 2026-05-23

**Hours worked:** ~5

**What I did:** Spent most of the day getting the full flow working —
form to database to results page. Built the audit engine first, which
was actually pretty satisfying to write. Each tool has its own logic:
checking if the plan matches the team size, whether there's a cheaper
alternative, stuff like that. Then built the API routes and the results
page. Looked straightforward on paper but debugging took forever.

**What I learned:** Next.js 16 changed how dynamic route params work —
you can't just do params.id anymore, you have to unwrap it with
React.use(). Spent way too long on this before figuring it out. Also
learned that Supabase has row-level security on by default which just
silently blocks all your inserts. Would've been nice to know that
earlier.

**Blockers:** The params.id bug was the worst part of the day. The
error message wasn't obvious at all — it just showed "audit not found"
on the frontend while the backend was actually saving fine. Had to
add console.logs everywhere to figure out the data was saving to
Supabase correctly but the ID wasn't reaching the results page.

**Plan for tomorrow:** Groq AI summary, Resend email confirmation,
Open Graph tags for the shareable links, and push a working build
to Vercel.