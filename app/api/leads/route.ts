import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, auditId, companyName, role } = await req.json();

  const { error: dbError } = await supabase.from("leads").insert({
    email,
    audit_id: auditId,
    company_name: companyName,
    role,
  });

  if (dbError) {
    console.error("Lead insert error:", dbError);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: "AI Spend Audit <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #00ff80; font-size: 24px; margin-bottom: 8px;">Your audit is ready.</h1>
          <p style="color: #888; margin-bottom: 24px;">Here's a link to your full AI spend report:</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/results/${auditId}"
             style="display: inline-block; background: #00ff80; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            View Full Report →
          </a>
          <p style="color: #555; margin-top: 32px; font-size: 12px;">
            If your audit shows significant savings, our team at Credex may reach out — we help teams get the same AI tools at lower cost through discounted credits.
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error("Email send error:", emailErr);
    // Don't fail the request if email fails
  }

  return NextResponse.json({ success: true });
}