"use client";
import { useEffect, useState, use } from "react";

type Recommendation = {
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

type AuditData = {
  recommendations: Recommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
};

const statusColor = {
  overspending: "#ff4444",
  optimal: "#00ff80",
  consider: "#febc2e",
};

const statusLabel = {
  overspending: "Overspending",
  optimal: "Optimal",
  consider: "Consider",
};

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/results/${id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleEmailSubmit = async () => {
    if (!email) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, auditId: id }),
    });
    setSubmitted(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="text-center font-mono">
        <div className="text-green-400 text-sm animate-pulse mb-2">analyzing your spend...</div>
        <div style={{ color: "#333" }} className="text-xs">running audit engine</div>
      </div>
    </main>
  );

  if (!data) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <p style={{ color: "#666" }}>Audit not found.</p>
    </main>
  );

  const isHighSavings = data.totalMonthlySavings > 500;
  const isLowSavings = data.totalMonthlySavings < 100;

  return (
    <main className="min-h-screen text-white" style={{ background: "#0a0a0f" }}>
      <div className="max-w-2xl mx-auto px-6 py-16">

        <a href="/" className="text-xs font-mono mb-6 inline-block" style={{ color: "#444" }}>← back</a>

        {/* Hero savings */}
        <div className="rounded-2xl p-8 mb-8 text-center"
          style={{ background: "rgba(0,255,128,0.05)", border: "1px solid rgba(0,255,128,0.2)" }}>
          <p className="text-xs font-mono mb-3" style={{ color: "#555" }}>total potential savings</p>
          <div className="text-6xl font-bold mb-1" style={{ color: "#00ff80" }}>
            ${data.totalMonthlySavings.toFixed(0)}
            <span className="text-2xl">/mo</span>
          </div>
          <div className="text-xl mt-2" style={{ color: "#444" }}>
            ${data.totalAnnualSavings.toFixed(0)}/year
          </div>
          {isLowSavings && (
            <p className="mt-4 text-sm" style={{ color: "#666" }}>
              You're spending well. Your AI stack looks optimized.
            </p>
          )}
        </div>

        {/* Credex CTA */}
        {isHighSavings && (
          <div className="rounded-2xl p-6 mb-8"
            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)" }}>
            <p className="text-xs font-mono mb-2" style={{ color: "#00d4ff" }}>💡 capture more savings</p>
            <p className="text-sm mb-4" style={{ color: "#888" }}>
              You could save <strong style={{ color: "#fff" }}>${data.totalAnnualSavings.toFixed(0)}/year</strong> by
              switching to discounted AI credits through Credex.
            </p>
            <a href="https://credex.rocks" target="_blank"
              className="inline-block px-6 py-2 rounded-lg text-sm font-bold"
              style={{ background: "#00d4ff", color: "#000" }}>
              Book a Credex Consultation →
            </a>
          </div>
        )}

        {/* AI Summary */}
        {data.aiSummary && (
          <div className="rounded-2xl p-5 mb-8 font-mono text-sm"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs mb-3" style={{ color: "#555" }}>// ai summary</p>
            <p style={{ color: "#aaa", lineHeight: 1.7 }}>{data.aiSummary}</p>
          </div>
        )}

        {/* Breakdown */}
        <h2 className="text-sm font-mono mb-4" style={{ color: "#00ff80" }}>// breakdown</h2>
        <div className="space-y-3 mb-10">
          {data.recommendations.map((rec) => (
            <div key={rec.tool} className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${statusColor[rec.status]}22`,
              }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold">{rec.tool}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                    style={{
                      background: `${statusColor[rec.status]}15`,
                      color: statusColor[rec.status],
                      border: `1px solid ${statusColor[rec.status]}30`,
                    }}>
                    {statusLabel[rec.status]}
                  </span>
                </div>
                {rec.monthlySavings > 0 && (
                  <span className="text-sm font-bold font-mono" style={{ color: "#00ff80" }}>
                    -${rec.monthlySavings.toFixed(0)}/mo
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-xs font-mono">
                <div>
                  <p style={{ color: "#444" }}>current</p>
                  <p style={{ color: "#fff" }}>{rec.currentPlan}</p>
                  <p style={{ color: "#666" }}>${rec.currentSpend.toFixed(0)}/mo</p>
                </div>
                <div className="flex items-center justify-center" style={{ color: "#333" }}>→</div>
                <div>
                  <p style={{ color: "#444" }}>recommended</p>
                  <p style={{ color: "#fff" }}>{rec.recommendedPlan}</p>
                  <p style={{ color: "#666" }}>${rec.estimatedSpend.toFixed(0)}/mo</p>
                </div>
              </div>

              <p className="text-xs" style={{ color: "#555", lineHeight: 1.6 }}>{rec.reason}</p>
            </div>
          ))}
        </div>

        {/* Email capture */}
        {!submitted ? (
          <div className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-bold mb-1">Get your report by email</p>
            <p className="text-xs mb-4" style={{ color: "#555" }}>
              {isLowSavings
                ? "We'll notify you when new optimizations apply to your stack."
                : "We'll send your full audit report and saving opportunities."}
            </p>
            <div className="flex gap-2">
              <input type="email" placeholder="you@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-sm font-mono outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              />
              <button onClick={handleEmailSubmit}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                style={{ background: "linear-gradient(90deg,#00ff80,#00d4ff)", color: "#000" }}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-5 mb-6 text-center font-mono text-sm"
            style={{ background: "rgba(0,255,128,0.05)", border: "1px solid rgba(0,255,128,0.2)", color: "#00ff80" }}>
            ✓ Report sent! Check your inbox.
          </div>
        )}

        {/* Share */}
        <button onClick={copyLink}
          className="w-full py-3 rounded-xl text-sm font-mono transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#666" }}>
          {copying ? "✓ Link copied!" : "Share this audit →"}
        </button>

      </div>
    </main>
  );
}