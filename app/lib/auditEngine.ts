export type ToolInput = {
  plan: string;
  seats: number;
  monthlySpend: number;
};

export type AuditRecommendation = {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  estimatedSpend: number;
  monthlySavings: number;
  reason: string;
  status: "overspending" | "optimal" | "consider";
};

export type AuditResult = {
  recommendations: AuditRecommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
};

export function runAudit(
  tools: Record<string, ToolInput>,
  teamSize: number,
  useCase: string
): AuditResult {
  const recommendations: AuditRecommendation[] = [];

  // --- CURSOR ---
  if (tools.cursor?.plan) {
    const { plan, seats, monthlySpend } = tools.cursor;
    const current = monthlySpend || (plan === "Pro" ? 20 * seats : plan === "Business" ? 40 * seats : 0);

    if (plan === "Business" && seats <= 5) {
      recommendations.push({
        tool: "Cursor",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Downgrade to Pro",
        recommendedPlan: "Pro",
        estimatedSpend: 20 * seats,
        monthlySavings: current - 20 * seats,
        reason: `Business plan adds admin controls not needed under 5 seats. Pro covers same AI features at $20/seat vs $40/seat.`,
        status: "overspending",
      });
    } else if (plan === "Pro" && seats === 1 && useCase !== "coding") {
      recommendations.push({
        tool: "Cursor",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Consider Hobby plan",
        recommendedPlan: "Hobby",
        estimatedSpend: 0,
        monthlySavings: current,
        reason: `Solo non-coding usage likely stays under Hobby limits (2,000 completions/day). Try free tier first.`,
        status: "consider",
      });
    } else {
      recommendations.push({
        tool: "Cursor",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `Your Cursor plan fits your team size and use case well.`,
        status: "optimal",
      });
    }
  }

  // --- GITHUB COPILOT ---
  if (tools.github_copilot?.plan) {
    const { plan, seats, monthlySpend } = tools.github_copilot;
    const prices: Record<string, number> = { Individual: 10, Business: 19, Enterprise: 39 };
    const current = monthlySpend || (prices[plan] ?? 10) * seats;

    if (plan === "Business" && seats === 1) {
      recommendations.push({
        tool: "GitHub Copilot",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Downgrade to Individual",
        recommendedPlan: "Individual",
        estimatedSpend: 10,
        monthlySavings: current - 10,
        reason: `Individual plan ($10/mo) has identical AI features for solo devs. Business adds policy controls only useful for teams.`,
        status: "overspending",
      });
    } else if (plan === "Enterprise" && seats < 10) {
      recommendations.push({
        tool: "GitHub Copilot",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Downgrade to Business",
        recommendedPlan: "Business",
        estimatedSpend: 19 * seats,
        monthlySavings: current - 19 * seats,
        reason: `Enterprise adds Copilot Chat in GitHub.com and fine-tuning — rarely needed under 10 seats. Business covers all core features.`,
        status: "overspending",
      });
    } else {
      recommendations.push({
        tool: "GitHub Copilot",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `Copilot plan matches your team size well.`,
        status: "optimal",
      });
    }
  }

  // --- CLAUDE ---
  if (tools.claude?.plan) {
    const { plan, seats, monthlySpend } = tools.claude;
    const prices: Record<string, number> = { Free: 0, Pro: 20, Max: 100, Team: 30, Enterprise: 60 };
    const current = monthlySpend || (prices[plan] ?? 20) * seats;

    if (plan === "Team" && seats <= 2) {
      recommendations.push({
        tool: "Claude",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Switch to Pro (individual)",
        recommendedPlan: "Pro",
        estimatedSpend: 20 * seats,
        monthlySavings: current - 20 * seats,
        reason: `Team plan requires minimum 5 seats billed. Under 3 users, individual Pro at $20/seat is cheaper with same model access.`,
        status: "overspending",
      });
    } else if (plan === "Max" && useCase === "writing") {
      recommendations.push({
        tool: "Claude",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Downgrade to Pro",
        recommendedPlan: "Pro",
        estimatedSpend: 20 * seats,
        monthlySavings: current - 20 * seats,
        reason: `Max plan is designed for heavy API/coding workloads. Writing use cases rarely hit Pro plan limits ($20/mo).`,
        status: "overspending",
      });
    } else {
      recommendations.push({
        tool: "Claude",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `Claude plan aligns with your team size and use case.`,
        status: "optimal",
      });
    }
  }

  // --- CHATGPT ---
  if (tools.chatgpt?.plan) {
    const { plan, seats, monthlySpend } = tools.chatgpt;
    const prices: Record<string, number> = { Free: 0, Plus: 20, Team: 30, Enterprise: 60 };
    const current = monthlySpend || (prices[plan] ?? 20) * seats;

    if (plan === "Team" && seats <= 2) {
      recommendations.push({
        tool: "ChatGPT",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Switch to Plus",
        recommendedPlan: "Plus",
        estimatedSpend: 20 * seats,
        monthlySavings: current - 20 * seats,
        reason: `ChatGPT Team ($30/seat) adds shared workspace — not worth it under 3 users. Plus gives same GPT-4o access at $20/seat.`,
        status: "overspending",
      });
    } else if (plan === "Plus" && seats >= 5) {
      recommendations.push({
        tool: "ChatGPT",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Upgrade to Team",
        recommendedPlan: "Team",
        estimatedSpend: 30 * seats,
        monthlySavings: current - 30 * seats,
        reason: `At 5+ seats, Team plan adds shared context, admin controls, and higher limits — worth the $10/seat premium.`,
        status: "consider",
      });
    } else {
      recommendations.push({
        tool: "ChatGPT",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `ChatGPT plan fits your current usage well.`,
        status: "optimal",
      });
    }
  }

  // --- ANTHROPIC API ---
  if (tools.anthropic_api?.plan) {
    const { monthlySpend } = tools.anthropic_api;
    const current = monthlySpend || 0;

    if (current > 100) {
      recommendations.push({
        tool: "Anthropic API",
        currentPlan: "API Direct",
        currentSpend: current,
        recommendedAction: "Enable prompt caching",
        recommendedPlan: "API Direct + Caching",
        estimatedSpend: current * 0.1,
        monthlySavings: current * 0.9,
        reason: `Prompt caching reduces repeated context costs by up to 90%. At $${current}/mo, enabling caching could save ~$${(current * 0.9).toFixed(0)}/mo.`,
        status: "overspending",
      });
    } else {
      recommendations.push({
        tool: "Anthropic API",
        currentPlan: "API Direct",
        currentSpend: current,
        recommendedAction: "Monitor usage",
        recommendedPlan: "API Direct",
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `API spend looks reasonable. Enable prompt caching proactively to keep costs low as you scale.`,
        status: "optimal",
      });
    }
  }

  // --- OPENAI API ---
  if (tools.openai_api?.plan) {
    const { monthlySpend } = tools.openai_api;
    const current = monthlySpend || 0;

    if (current > 50) {
      recommendations.push({
        tool: "OpenAI API",
        currentPlan: "API Direct",
        currentSpend: current,
        recommendedAction: "Use Batch API for async jobs",
        recommendedPlan: "API Direct + Batch",
        estimatedSpend: current * 0.5,
        monthlySavings: current * 0.5,
        reason: `OpenAI Batch API offers 50% discount for async workloads with 24hr turnaround. Ideal for data processing, evals, and non-realtime tasks.`,
        status: "overspending",
      });
    } else {
      recommendations.push({
        tool: "OpenAI API",
        currentPlan: "API Direct",
        currentSpend: current,
        recommendedAction: "Monitor usage",
        recommendedPlan: "API Direct",
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `OpenAI API spend is within normal range for your usage.`,
        status: "optimal",
      });
    }
  }

  // --- GEMINI ---
  if (tools.gemini?.plan) {
    const { plan, seats, monthlySpend } = tools.gemini;
    const prices: Record<string, number> = { Free: 0, Pro: 19.99, Ultra: 29.99 };
    const current = monthlySpend || (prices[plan] ?? 0) * seats;

    if (plan === "Ultra" && useCase !== "data" && useCase !== "research") {
      recommendations.push({
        tool: "Gemini",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Downgrade to Pro",
        recommendedPlan: "Pro",
        estimatedSpend: 19.99 * seats,
        monthlySavings: current - 19.99 * seats,
        reason: `Gemini Ultra's advanced reasoning is mainly valuable for data/research workloads. Pro covers coding and writing at $10/seat less.`,
        status: "overspending",
      });
    } else {
      recommendations.push({
        tool: "Gemini",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `Gemini plan fits your use case well.`,
        status: "optimal",
      });
    }
  }

  // --- WINDSURF ---
  if (tools.windsurf?.plan) {
    const { plan, seats, monthlySpend } = tools.windsurf;
    const prices: Record<string, number> = { Free: 0, Pro: 15, Teams: 35 };
    const current = monthlySpend || (prices[plan] ?? 0) * seats;

    if (plan === "Teams" && seats <= 3) {
      recommendations.push({
        tool: "Windsurf",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Switch to individual Pro plans",
        recommendedPlan: "Pro",
        estimatedSpend: 15 * seats,
        monthlySavings: current - 15 * seats,
        reason: `Windsurf Teams adds shared billing and admin controls. Under 4 seats, individual Pro plans save $20/seat/mo with same AI features.`,
        status: "overspending",
      });
    } else if (plan === "Pro" && seats === 1 && useCase !== "coding") {
      recommendations.push({
        tool: "Windsurf",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "Try Free tier",
        recommendedPlan: "Free",
        estimatedSpend: 0,
        monthlySavings: current,
        reason: `Windsurf Free tier includes 5 free AI flows/day — sufficient for occasional non-coding use. Downgrade and upgrade only if you hit limits.`,
        status: "consider",
      });
    } else {
      recommendations.push({
        tool: "Windsurf",
        currentPlan: plan,
        currentSpend: current,
        recommendedAction: "No change needed",
        recommendedPlan: plan,
        estimatedSpend: current,
        monthlySavings: 0,
        reason: `Windsurf plan matches your usage pattern.`,
        status: "optimal",
      });
    }
  }

  const totalMonthlySpend = recommendations.reduce((s, r) => s + r.currentSpend, 0);
  const totalMonthlySavings = recommendations.reduce((s, r) => s + Math.max(0, r.monthlySavings), 0);

  return {
    recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}