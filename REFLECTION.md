# Reflection

## 1. The hardest bug I hit this week

The nastiest bug was the "audit not found" error on the results page.
The frustrating part was that everything looked fine on the surface —
the form submitted, the terminal showed a 200 response, Supabase had
the row saved. But the results page just kept saying "audit not found."

My first hypothesis was that Supabase wasn't saving correctly. I added
console.logs everywhere in the API route and confirmed the insert was
working fine and returning a valid UUID. So the problem wasn't the save.

My second hypothesis was that the redirect wasn't carrying the ID
correctly. I logged the ID being returned from the API and it was
there — `cd7ff7e4-eadd-43f5-b3e4-b348065e644d`. But when I looked at
the network tab, the results page was fetching `/api/results/undefined`
instead of the actual ID.

That's when I realized the ID was making it to the URL correctly
(`/results/cd7ff7e4...`) but the page component was reading it as
undefined. Turned out Next.js 16 changed how dynamic route params work
— `params` is now a Promise and you can't access `params.id` directly
anymore. You have to unwrap it with `React.use(params)` in client
components. The error message in the terminal mentioned this but I
initially dismissed it as a warning rather than the actual cause.

Switching from `const { id } = params` to `const { id } = use(params)`
fixed it immediately. Obvious in hindsight but cost me a couple of
hours.

---

## 2. A decision I reversed mid-week

I originally planned to use the Anthropic API for the AI summary
because the assignment says it's preferred. I signed up, checked the
pricing, and realized I'd need to add a credit card and there's no
meaningful free tier for new accounts.

I switched to Groq instead — it has a genuinely free tier with no
card required, and the assignment explicitly says "or any LLM" so it's
within the rules. I documented the reasoning in PROMPTS.md.

Then halfway through Day 3 I hit another problem — the Groq model I
was using (`llama3-8b-8192`) had been decommissioned. The API was
returning a 400 error but the try/catch was swallowing it silently and
falling back to the template summary. So the page looked fine but
wasn't actually using AI at all. Only caught it by reading the
terminal logs carefully.

Switched to `llama-3.3-70b-versatile` which works correctly and
actually produces better summaries than the 8b model did anyway.

---

## 3. What I would build in week 2

The shareable URL is the most underbuilt part of the current app.
Right now it just shows the same results page with a copy link button.
In week 2 I'd make the shared version actually designed for sharing —
a proper OG image generated server-side showing the total savings
number in big text, so when someone posts the link on Twitter it looks
like a screenshot worth clicking.

I'd also build the benchmark mode — "your AI spend per developer is
$X, companies your size average $Y." Right now the audit only tells
you if your plan is wrong. It doesn't tell you if your overall spend
level is high or low compared to similar teams. That context would
make the results much more actionable.

And honestly the audit engine needs more tools. The current 8 cover
the obvious ones but there are tools like Perplexity, Notion AI,
Grammarly, and various coding assistants that a lot of teams pay for.
Expanding the coverage would make the audit more complete.

---

## 4. How I used AI tools this week

I used Claude heavily throughout the week — probably 70% of the code
was written with Claude's help. I used it for boilerplate (setting up
the Next.js API routes, Supabase client initialization), for debugging
(pasting error messages and asking what was wrong), and for the
markdown documentation.

What I didn't trust AI with: the audit engine logic itself. The
reasoning behind each recommendation — why Cursor Business is
overkill for 5 seats, why Claude Team doesn't make sense under 3
users — that needed to be my own thinking. If I'd let Claude write
the audit rules they'd have been generic and wouldn't hold up to a
finance person reading them.

One specific time the AI was wrong: Claude suggested using
`useParams()` from next/navigation to get the route ID in the results
page. That's the correct approach for Next.js 14 but in Next.js 16
params is a Promise and needs `React.use()`. Following that suggestion
is actually what caused the hardest bug of the week.

---

## 5. Self-ratings

**Discipline: 6/10**
Started strong but the user interviews were left too late. I sent the
DMs on Day 3 when I should have done it on Day 1. Got lucky that
people replied quickly.

**Code quality: 7/10**
The audit engine is clean and well-structured. The API routes are
straightforward. The results page component is a bit long and could
be split into smaller components — I'd refactor that in week 2.

**Design sense: 7/10**
The dark theme with green accents works well for the target audience
(developers and technical founders). The results page hierarchy is
clear — big savings number first, breakdown second, email capture
last. Could use more visual polish on mobile.

**Problem solving: 8/10**
The params.id bug took too long to find but I did eventually find it
by eliminating hypotheses systematically rather than randomly changing
things. The Groq fallback issue I caught by reading logs rather than
waiting for a user to report it.

**Entrepreneurial thinking: 7/10**
The GTM and economics docs forced me to think about this as a real
product rather than a coding exercise. The user interviews genuinely
changed two design decisions. Could have gone deeper on the
distribution strategy.