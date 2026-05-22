import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,128,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,128,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,128,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-green-500/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Free AI Spend Audit Tool
        </div>

        {/* Headline */}
        <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight">
          Stop overpaying for{" "}
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #00ff80, #00d4ff)" }}>
            AI tools
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get an instant audit of your AI subscriptions. See exactly where
          you're overspending and how much you could save — in 2 minutes.
        </p>

        <Link
          href="/audit"
          className="inline-flex items-center gap-2 text-black font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg"
          style={{ background: "linear-gradient(90deg, #00ff80, #00d4ff)" }}
        >
          Start Free Audit
          <span>→</span>
        </Link>
        <p className="text-gray-600 text-sm mt-4">
          No login required · Takes 2 minutes · 100% free
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-20 mb-16">
          {[
            { value: "$2,400", label: "Avg. annual savings found" },
            { value: "8", label: "AI tools audited" },
            { value: "2 min", label: "Time to complete" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur"
            >
              <div className="text-3xl font-bold text-green-400 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">
          We audit spend on
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Cursor","GitHub Copilot","Claude","ChatGPT",
            "Gemini","Windsurf","OpenAI API","Anthropic API",
          ].map((tool) => (
            <span
              key={tool}
              className="bg-white/5 text-gray-300 px-4 py-2 rounded-lg text-sm border border-white/10 hover:border-green-500/40 transition-colors"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}