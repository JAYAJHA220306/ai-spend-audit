# AI Spend Audit

A free tool for startup founders and engineering teams to audit their AI tool subscriptions and find overspending.

**Live URL:** https://ai-spend-audit-nine-ruddy.vercel.app

## What it does

You enter your AI subscriptions (Cursor, Claude, ChatGPT, GitHub Copilot, etc.) with your current plan, seat count, and monthly spend. The audit engine compares your setup against official pricing data and flags where you're overpaying — wrong plan for your team size, cheaper alternatives that cover the same features, API optimizations you're missing.

Results page shows:
- Total monthly and annual savings
- Per-tool breakdown with current vs recommended plan
- A personalized AI-generated summary via Groq
- Shareable unique URL
- Email capture for report delivery via Resend

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| AI | Groq (llama-3.3-70b-versatile) |
| Email | Resend |
| Deploy | Vercel |
| CI | GitHub Actions |

## Running locally

```bash
git clone https://github.com/JAYAJHA220306/ai-spend-audit
cd ai-spend-audit
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GROQ_API_KEY=your_groq_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

## Running tests

```bash
npx jest
```

7 tests covering the audit engine logic.

## Required files

- [DEVLOG.md](./DEVLOG.md) — daily build log
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design and stack decisions
- [PRICING_DATA.md](./PRICING_DATA.md) — verified pricing sources
- [PROMPTS.md](./PROMPTS.md) — AI prompt design and iteration
- [TESTS.md](./TESTS.md) — test descriptions and results
- [GTM.md](./GTM.md) — go to market strategy
- [ECONOMICS.md](./ECONOMICS.md) — unit economics and LTV/CAC
- [LANDING_COPY.md](./LANDING_COPY.md) — landing page copy
- [METRICS.md](./METRICS.md) — north star metric and instrumentation plan
- [USER_INTERVIEWS.md](./USER_INTERVIEWS.md) — 3 user interviews
- [REFLECTION.md](./REFLECTION.md) — what I learned and would change

## Decisions

**1. Rules-based audit engine instead of AI**
The audit logic is pure TypeScript, not AI-generated. Hardcoded
rules are more reliable for financial recommendations — a finance
person can read the code and verify the logic. AI is only used
for the personalized summary paragraph, not the core math.

**2. Groq instead of Anthropic API**
The assignment allows any LLM. Groq has a genuine free tier with
no credit card required. Would switch to Claude in production for
better summary quality.

**3. Supabase over Firebase**
Postgres gives proper relational structure with a foreign key from
leads to audits. The SQL editor made schema setup fast. Firebase's
document model would have been messier for this use case.

**4. Email captured after results, never before**
Full audit results are shown without any login or email gate.
Email is only asked after the user sees their savings. This
maximizes completion rate and respects the user's time.

**5. Next.js App Router over separate frontend/backend**
One repo, one deployment, API routes alongside UI code. No
separate Express server needed. Vercel handles everything
with zero config.