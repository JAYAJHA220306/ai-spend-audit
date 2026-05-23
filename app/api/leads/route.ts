import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { email, auditId, companyName, role } = await req.json();

  const { error } = await supabase.from("leads").insert({
    email,
    audit_id: auditId,
    company_name: companyName,
    role,
  });

  if (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
