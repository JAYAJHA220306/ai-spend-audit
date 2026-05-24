import { runAudit } from "./auditEngine";

describe("Audit Engine", () => {
  test("flags Cursor Business as overspending for small team", () => {
    const result = runAudit(
      { cursor: { plan: "Business", seats: 3, monthlySpend: 120 } },
      3, "coding"
    );
    const cursor = result.recommendations.find(r => r.tool === "Cursor");
    expect(cursor?.status).toBe("overspending");
    expect(cursor?.monthlySavings).toBeGreaterThan(0);
  });

  test("marks Cursor Hobby as optimal", () => {
    const result = runAudit(
      { cursor: { plan: "Hobby", seats: 1, monthlySpend: 0 } },
      1, "coding"
    );
    const cursor = result.recommendations.find(r => r.tool === "Cursor");
    expect(cursor?.status).toBe("optimal");
  });

  test("flags GitHub Copilot Business for solo user", () => {
    const result = runAudit(
      { github_copilot: { plan: "Business", seats: 1, monthlySpend: 19 } },
      1, "coding"
    );
    const cop = result.recommendations.find(r => r.tool === "GitHub Copilot");
    expect(cop?.status).toBe("overspending");
    expect(cop?.monthlySavings).toBe(9);
  });

  test("flags Claude Team for 2 users", () => {
    const result = runAudit(
      { claude: { plan: "Team", seats: 2, monthlySpend: 60 } },
      2, "writing"
    );
    const claude = result.recommendations.find(r => r.tool === "Claude");
    expect(claude?.status).toBe("overspending");
  });

  test("flags Gemini Ultra for non data/research use", () => {
    const result = runAudit(
      { gemini: { plan: "Ultra", seats: 1, monthlySpend: 29.99 } },
      1, "writing"
    );
    const gemini = result.recommendations.find(r => r.tool === "Gemini");
    expect(gemini?.status).toBe("overspending");
  });

  test("calculates total annual savings correctly", () => {
    const result = runAudit(
      { github_copilot: { plan: "Business", seats: 1, monthlySpend: 19 } },
      1, "coding"
    );
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  test("returns zero savings for optimal stack", () => {
    const result = runAudit(
      { cursor: { plan: "Hobby", seats: 1, monthlySpend: 0 } },
      1, "coding"
    );
    expect(result.totalMonthlySavings).toBe(0);
  });
});