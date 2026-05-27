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



## Day 4 — 2026-05-25

**Hours worked:** ~3

**What I did:** Wrote all the technical documentation today.
PRICING_DATA.md was the most important one — went through every
vendor's official pricing page and verified each number with a URL
and date. ARCHITECTURE.md has a Mermaid system diagram showing the
full data flow from form submission to results page. PROMPTS.md
documents the Groq prompt with the full iteration history of what
I tried before landing on the final version. TESTS.md lists all 7
tests with what each one covers and how to run them individually.

**What I learned:** Writing the architecture doc made me realize the
app's data flow is actually pretty clean — form to engine to database
to results, with the AI summary as a side step that can fail gracefully.

**Blockers:** None today, documentation day was straightforward.

**Plan for tomorrow:** Write GTM.md, ECONOMICS.md, LANDING_COPY.md,
METRICS.md, REFLECTION.md, and USER_INTERVIEWS.md. Also need to
update README.md with screenshots and the decisions section.

## Day 5 — 2026-05-26

**Hours worked:** ~4

**What I did:** Finished all the remaining markdown docs today.
USER_INTERVIEWS.md was first — wrote up all three conversations with
Rashmi, Manaswi, and Ritika. Genuinely useful exercise, their
responses actually changed two design decisions I made earlier in the
week. REFLECTION.md took the longest because I had to think honestly
about what went wrong and why. GTM, ECONOMICS, LANDING_COPY, and
METRICS were faster — got into a rhythm of just writing what I
actually think rather than what sounds impressive. Updated README with
the full stack table and instructions for running locally and running
tests.

**What I learned:** Writing the economics doc made me realize the
conversion math only works if the audit recommendations are trusted.
One wrong recommendation that costs someone money kills word of mouth
completely. The whole business depends on the audit engine being
accurate, which is why having tests for it matters more than almost
anything else in the codebase.

**Blockers:** None today.

**Plan for tomorrow:** Final checks before submission — verify live
URL works end to end, check all 11 required files exist at repo root,
run the tests one more time, submit the Google Form.

## Day 6 — 2026-05-27

**Hours worked:** ~3

**What I did:** Final day — cleaned up the repo, added all missing
docs to git, fixed an accidental file called "tatus" that got
committed. Updated README with screenshots and the decisions section.
Changed the homepage background from a static grid to an animated
particle network — floating green dots that connect with lines when
they get close. Ran final checks: 7 tests passing, live URL working,
GitHub Actions green. Submitted.

**What I learned:** Leaving docs to the last day is stressful.
Should have been writing DEVLOG entries and small docs throughout
the week instead of batching everything.

**Blockers:** None on the final day thankfully.

**Plan for tomorrow:** Wait for Round 2 results.
