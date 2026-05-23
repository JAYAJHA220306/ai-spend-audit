import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runAudit } from "@/app/lib/auditEngine";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, useCase } = body;

    const result = runAudit(tools, teamSize, useCase);

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
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    console.log("Returning ID:", data.id);
    return NextResponse.json({ id: data.id, ...result });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}