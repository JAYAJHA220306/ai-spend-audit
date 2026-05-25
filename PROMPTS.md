# Prompts

## AI Summary Prompt

Used in: `app/api/audit/route.ts` — `generateSummary()` function

### The Prompt

You are an AI spend analyst. A {teamSize}-person team primarily uses
AI for {useCase}.
Here is their audit:
{toolList}
Total potential monthly savings: ${totalMonthlySavings}
Total potential annual savings: ${totalAnnualSavings}
Write a 80-100 word personalized audit summary for this team. Be
specific about their biggest saving opportunity. Be direct and
helpful, not salesy. No bullet points, just one paragraph.

### Why I wrote it this way

I wanted the output to feel like advice from a knowledgeable friend,
not a sales pitch. The "direct and helpful, not salesy" instruction
was added after the first few outputs kept recommending Credex
unprompted in a way that felt forced. Specifying "no bullet points,
just one paragraph" was necessary because the model defaulted to
a structured list format which looked bad on the results page.

Including the actual tool list and savings numbers in the prompt
forces the model to be specific rather than generic. Early versions
without the numbers produced summaries like "you could save a lot"
which was useless.

### What I tried that didn't work

**Version 1** — just asked for "a summary of this audit" with no
constraints. Output was too long, too generic, and always ended with
a sales pitch.

**Version 2** — added "be concise" but the model interpreted that
differently each time — sometimes 50 words, sometimes 200.

**Version 3** — specified "80-100 words" which gave consistent length.
Added "not salesy" and "one paragraph" which fixed the formatting.

### Fallback behavior

If the Groq API fails for any reason (rate limit, downtime, invalid
response), the code falls back to a templated summary generated
locally. This means the results page never breaks even if the AI
is unavailable. The fallback is clearly a template but covers the
key numbers so it's still useful.

### Model choice

Using `llama-3.3-70b-versatile` on Groq. Originally used
`llama3-8b-8192` but that model was decommissioned. The 70b model
produces noticeably better summaries — more specific, better tone.
Would consider switching to Claude claude-sonnet-4-5 in production
for even better output quality.