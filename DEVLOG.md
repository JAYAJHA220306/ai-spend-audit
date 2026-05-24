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

## Day 3 — 2026-05-24

**Hours worked:** ~4

**What I did:** Got the AI summary working today — integrated Groq to
generate a personalized paragraph based on the audit results. Took a
while because the model I was using (llama3-8b-8192) turned out to be
decommissioned, so it was silently falling back to the template every
time. Only figured it out by actually reading the terminal logs. Switched
to llama-3.3-70b-versatile and it works now. Also set up the Resend
email so users get a confirmation when they submit their email on the
results page. Added Open Graph tags so the shareable links look good
when posted on Twitter or Slack. Pushed all the env variables to Vercel
and redeployed. Wrote 7 tests for the audit engine — all passing. Set
up GitHub Actions so tests run automatically on every push.

**What I learned:** Vercel doesn't read your local .env.local file at
all — you have to add every variable again manually in their dashboard.
Obvious in hindsight but cost me time. Also learned to always check
terminal logs when something seems to be "working" but giving wrong
output — the Groq fallback looked fine on screen but wasn't actually
using AI.

**Blockers:** The decommissioned Groq model was the main thing. The
error was swallowed by the try/catch so the page still loaded fine,
just with a templated summary instead of a real one. Took embarrassingly
long to spot.

**Plan for tomorrow:** Write all the markdown docs the assignment
requires. There are a lot of them — ARCHITECTURE, REFLECTION, GTM,
ECONOMICS, PROMPTS, PRICING_DATA, TESTS, LANDING_COPY, METRICS. Also
need to do the 3 user interviews, been putting them off.