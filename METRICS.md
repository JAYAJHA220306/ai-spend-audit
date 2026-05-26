# Metrics

## North Star metric

**Audits completed per week.**

Not visitors, not signups, not revenue. An audit completed means
someone got real value from the tool — they put in their actual
spend data and got a personalized breakdown. Everything else
(email captures, Credex consultations, revenue) is downstream of
this number.

DAU would be wrong for this tool — people audit their stack once
a quarter, not every day. Signups would be wrong — the tool works
without signup. Audits completed is the one number that measures
whether the tool is actually doing its job.

## 3 input metrics that drive the North Star

**1. Landing page → audit start rate**
What percentage of visitors click "Start Free Audit." Measures
whether the landing page copy and positioning are working. Target:
35-45%. Below 25% means the landing page isn't communicating value.

**2. Audit start → audit completion rate**
What percentage of people who start the form actually submit it.
Measures whether the form is too long, too confusing, or asking
for information people don't have. Target: 60-70%. Below 50%
means the form needs simplification.

**3. Audit completion → email capture rate**
What percentage of people who see their results give their email.
Measures whether the results are valuable enough to warrant
follow-up. Target: 25-35%. Below 15% means either the results
aren't compelling or the email ask feels too pushy.

## What I'd instrument first

1. A simple event on "Run My Audit" button click — to measure
   audit start rate from the landing page
2. A completion event when the results page loads with a valid
   audit ID — to measure form completion rate
3. An event on email form submission — to measure lead capture rate
4. Which tools are most commonly selected — to prioritize which
   tools to add next and which recommendations to improve

All four can be done with a simple analytics tool like Plausible
or even a custom events table in Supabase. No need for a complex
analytics stack at this stage.

## What number triggers a pivot decision

If audit completion rate drops below 40% consistently for two weeks,
that's a signal the form is broken — either too long, asking for
information people don't have, or the tool selection is confusing.
That would trigger a redesign of the input form before any other
work.

If email capture rate is below 10% after 200 audits, the results
page isn't delivering enough value — the recommendations aren't
specific enough or the savings numbers are too low to feel worth
acting on. That would trigger a deeper look at the audit engine
logic and results page design.