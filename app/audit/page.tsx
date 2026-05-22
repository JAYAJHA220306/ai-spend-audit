"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TOOLS_CONFIG = [
  {
    id: "cursor",
    name: "Cursor",
    plans: [
      { name: "Hobby", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Business", price: 40 },
    ],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    plans: [
      { name: "Individual", price: 10 },
      { name: "Business", price: 19 },
      { name: "Enterprise", price: 39 },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 20 },
      { name: "Max", price: 100 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60 },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    plans: [
      { name: "Free", price: 0 },
      { name: "Plus", price: 20 },
      { name: "Team", price: 30 },
      { name: "Enterprise", price: 60 },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    plans: [{ name: "API Direct", price: 0 }],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    plans: [{ name: "API Direct", price: 0 }],
  },
  {
    id: "gemini",
    name: "Gemini",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 19.99 },
      { name: "Ultra", price: 29.99 },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    plans: [
      { name: "Free", price: 0 },
      { name: "Pro", price: 15 },
      { name: "Teams", price: 35 },
    ],
  },
];

const USE_CASES = ["coding", "writing", "data", "research", "mixed"];

type ToolEntry = {
  enabled: boolean;
  plan: string;
  seats: number;
  monthlySpend: number;
};

type FormState = {
  tools: Record<string, ToolEntry>;
  teamSize: number;
  useCase: string;
};

const defaultForm = (): FormState => ({
  tools: Object.fromEntries(
    TOOLS_CONFIG.map((t) => [
      t.id,
      { enabled: false, plan: t.plans[0].name, seats: 1, monthlySpend: 0 },
    ])
  ),
  teamSize: 1,
  useCase: "mixed",
});

export default function AuditPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm());
  const [loading, setLoading] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("audit_form");
    if (saved) setForm(JSON.parse(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("audit_form", JSON.stringify(form));
  }, [form]);

  const toggleTool = (id: string) => {
    setForm((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [id]: { ...prev.tools[id], enabled: !prev.tools[id].enabled },
      },
    }));
  };

  const updateTool = (id: string, field: keyof ToolEntry, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [id]: { ...prev.tools[id], [field]: value },
      },
    }));
  };

  const enabledTools = TOOLS_CONFIG.filter((t) => form.tools[t.id]?.enabled);

  const handleSubmit = async () => {
    if (enabledTools.length === 0) {
      alert("Please select at least one tool.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      router.push(`/results/${data.id}`);
    } catch (e) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white" style={{ background: "#0a0a0f" }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <a href="/" className="text-xs font-mono mb-6 inline-block"
            style={{ color: "#444" }}>← back</a>
          <h1 className="text-3xl font-bold mb-2">Your AI Spend Audit</h1>
          <p style={{ color: "#666" }} className="text-sm">
            Select the tools you pay for and enter your current plan details.
          </p>
        </div>

        {/* Team info */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-mono mb-4" style={{ color: "#00ff80" }}>// team info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-2 block" style={{ color: "#666" }}>Team size</label>
              <input
                type="number" min={1} value={form.teamSize}
                onChange={(e) => setForm((p) => ({ ...p, teamSize: Number(e.target.value) }))}
                className="w-full rounded-lg px-3 py-2 text-sm font-mono outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              />
            </div>
            <div>
              <label className="text-xs mb-2 block" style={{ color: "#666" }}>Primary use case</label>
              <select
                value={form.useCase}
                onChange={(e) => setForm((p) => ({ ...p, useCase: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm font-mono outline-none"
                style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
              >
                {USE_CASES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        <h2 className="text-sm font-mono mb-4" style={{ color: "#00ff80" }}>// select your tools</h2>
        <div className="space-y-3 mb-8">
          {TOOLS_CONFIG.map((tool) => {
            const entry = form.tools[tool.id];
            const isOn = entry?.enabled;
            const selectedPlan = tool.plans.find((p) => p.name === entry?.plan);

            return (
              <div key={tool.id} className="rounded-2xl overflow-hidden transition-all"
                style={{
                  border: isOn ? "1px solid rgba(0,255,128,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  background: isOn ? "rgba(0,255,128,0.04)" : "rgba(255,255,255,0.02)",
                }}>
                {/* Tool header — click to toggle */}
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
                  onClick={() => toggleTool(tool.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                      style={{
                        borderColor: isOn ? "#00ff80" : "#333",
                        background: isOn ? "#00ff80" : "transparent",
                      }}>
                      {isOn && <span style={{ color: "#000", fontSize: 10, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span className="font-mono text-sm" style={{ color: isOn ? "#fff" : "#555" }}>
                      {tool.name}
                    </span>
                  </div>
                  {isOn && selectedPlan && (
                    <span className="text-xs font-mono" style={{ color: "#00ff80" }}>
                      ${(selectedPlan.price * entry.seats).toFixed(0)}/mo
                    </span>
                  )}
                </div>

                {/* Expanded fields */}
                {isOn && (
                  <div className="px-5 pb-5 grid grid-cols-3 gap-3 border-t"
                    style={{ borderColor: "rgba(0,255,128,0.1)" }}>
                    <div className="mt-4">
                      <label className="text-xs mb-1 block" style={{ color: "#555" }}>Plan</label>
                      <select
                        value={entry.plan}
                        onChange={(e) => updateTool(tool.id, "plan", e.target.value)}
                        className="w-full rounded-lg px-2 py-2 text-xs font-mono outline-none"
                        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                      >
                        {tool.plans.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} {p.price > 0 ? `($${p.price})` : "(free)"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="text-xs mb-1 block" style={{ color: "#555" }}>Seats</label>
                      <input
                        type="number" min={1} value={entry.seats}
                        onChange={(e) => updateTool(tool.id, "seats", Number(e.target.value))}
                        className="w-full rounded-lg px-2 py-2 text-xs font-mono outline-none"
                        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                      />
                    </div>
                    <div className="mt-4">
                      <label className="text-xs mb-1 block" style={{ color: "#555" }}>
                        Monthly spend ($)
                      </label>
                      <input
                        type="number" min={0} value={entry.monthlySpend}
                        onChange={(e) => updateTool(tool.id, "monthlySpend", Number(e.target.value))}
                        className="w-full rounded-lg px-2 py-2 text-xs font-mono outline-none"
                        style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary + submit */}
        {enabledTools.length > 0 && (
          <div className="rounded-2xl p-5 mb-6 font-mono text-sm"
            style={{ background: "rgba(0,255,128,0.05)", border: "1px solid rgba(0,255,128,0.2)" }}>
            <div className="flex justify-between items-center">
              <span style={{ color: "#666" }}>Total monthly spend</span>
              <span style={{ color: "#00ff80" }} className="text-lg font-bold">
                ${enabledTools.reduce((sum, t) => {
                  const e = form.tools[t.id];
                  const plan = t.plans.find((p) => p.name === e.plan);
                  return sum + (e.monthlySpend || (plan?.price ?? 0) * e.seats);
                }, 0).toFixed(0)}/mo
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || enabledTools.length === 0}
          className="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(90deg,#00ff80,#00d4ff)", color: "#000" }}
        >
          {loading ? "Analyzing your spend..." : "Run My Audit →"}
        </button>
      </div>
    </main>
  );
}