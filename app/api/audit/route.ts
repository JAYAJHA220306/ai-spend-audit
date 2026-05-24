import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runAudit } from "@/app/lib/auditEngine";
import Groq from "groq-sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateSummary(
  recommendations: ReturnType<typeof runAudit>["recommendations"],
  totalMonthlySavings: number,
  totalAnnualSavings: number,
  useCase: string,
  teamSize: number
): Promise<string> {
  try {
    const toolList = recommendations
      .map((r) => `${r.tool} (${r.currentPlan}, $${r.currentSpend}/mo) → ${r.recommendedAction}`)
      .join("\n");

    const prompt = `You are an AI spend analyst. A ${teamSize}-person team primarily uses AI for ${useCase}.
Here is their audit:
${toolList}

Total potential monthly savings: $${totalMonthlySavings.toFixed(0)}
Total potential annual savings: $${totalAnnualSavings.toFixed(0)}

Write a 80-100 word personalized audit summary for this team. Be specific about their biggest saving opportunity. Be direct and helpful, not salesy. No bullet points, just one paragraph.`;

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() ?? fallbackSummary(totalMonthlySavings, useCase);
  } catch (err) {
    console.error("Groq error:", err);
    return fallbackSummary(totalMonthlySavings, useCase);
  }
}

function fallbackSummary(totalMonthlySavings: number, useCase: string): string {
  if (totalMonthlySavings === 0) {
    return `Your AI stack looks well-optimized for ${useCase} work. You're on the right plans for your team size and usage patterns. Keep an eye on API usage as you scale — enabling prompt caching early can prevent bill surprises down the line.`;
  }
  return `Based on your current subscriptions, you could save $${totalMonthlySavings.toFixed(0)}/month by making a few plan adjustments. The biggest opportunity is switching to plans that better match your team size and ${useCase} use case. These are straightforward changes that won't affect your day-to-day workflow.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, useCase } = body;

    const result = runAudit(tools, teamSize, useCase);

    const aiSummary = await generateSummary(
      result.recommendations,
      result.totalMonthlySavings,
      result.totalAnnualSavings,
      useCase,
      teamSize
    );

    const { data, error } = await supabase
      .from("audits")
      .insert({
        tools,
        team_size: teamSize,
        use_case: useCase,
        total_monthly_spend: result.totalMonthlySpend,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        recommendations: result.recommendations,
        ai_summary: aiSummary,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    return NextResponse.json({ id: data.id, ...result, aiSummary });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}