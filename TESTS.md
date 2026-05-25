# Tests

## Running the tests

```bash
npx jest
```

## Test file

`app/lib/auditEngine.test.ts`

## What the tests cover

All 7 tests cover the audit engine logic in `app/lib/auditEngine.ts`.
The audit engine is the most critical part of the app — it's where
savings recommendations are calculated, so it needs to be correct.

### Test 1 — Cursor Business overspending for small team
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** A team of 3 on Cursor Business ($40/seat) should
be flagged as overspending. Pro plan covers the same features at
$20/seat for teams under 5.
**How to run:** `npx jest --testNamePattern="flags Cursor Business"`

### Test 2 — Cursor Hobby is optimal
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** A solo user on the free Hobby plan should be
marked as optimal with zero savings — no unnecessary upsell.
**How to run:** `npx jest --testNamePattern="marks Cursor Hobby"`

### Test 3 — GitHub Copilot Business for solo user
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** A single user on Copilot Business ($19/mo) should
be flagged — Individual plan has identical AI features for $10/mo.
Expected savings: $9/mo.
**How to run:** `npx jest --testNamePattern="flags GitHub Copilot"`

### Test 4 — Claude Team for 2 users
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** Claude Team requires minimum 5 seats billed.
2 users on Team plan are overpaying vs individual Pro at $20/seat.
**How to run:** `npx jest --testNamePattern="flags Claude Team"`

### Test 5 — Gemini Ultra for non data/research use
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** Gemini Ultra's advanced reasoning is only worth
it for data/research workloads. A writing use case should be flagged
as overspending — Pro covers it at $10/seat less.
**How to run:** `npx jest --testNamePattern="flags Gemini Ultra"`

### Test 6 — Annual savings calculation
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** Total annual savings must always equal total
monthly savings multiplied by 12. Tests the math is correct.
**How to run:** `npx jest --testNamePattern="calculates total annual"`

### Test 7 — Zero savings for optimal stack
**File:** `app/lib/auditEngine.test.ts`
**What it tests:** An already-optimized stack should return zero
savings. The engine should never manufacture savings that don't exist.
**How to run:** `npx jest --testNamePattern="returns zero savings"`

## Test results

```
PASS  app/lib/auditEngine.test.ts
  Audit Engine
    ✓ flags Cursor Business as overspending for small team
    ✓ marks Cursor Hobby as optimal
    ✓ flags GitHub Copilot Business for solo user
    ✓ flags Claude Team for 2 users
    ✓ flags Gemini Ultra for non data/research use
    ✓ calculates total annual savings correctly
    ✓ returns zero savings for optimal stack

Tests:       7 passed, 7 total
Time:        1.287s
```