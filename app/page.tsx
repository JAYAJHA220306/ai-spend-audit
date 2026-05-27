"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const TOOLS = [
  { name: "Cursor", plan: "Pro", spend: "$20/mo", tip: "Switch to Hobby — saves $20/mo if under 2k completions/day" },
  { name: "GitHub Copilot", plan: "Business", spend: "$19/mo", tip: "Individual plan covers same features for $10/mo" },
  { name: "Claude", plan: "Pro", spend: "$20/mo", tip: "Team plan only worth it at 5+ seats" },
  { name: "ChatGPT", plan: "Plus", spend: "$20/mo", tip: "Team only needed at 3+ users" },
  { name: "Gemini", plan: "Ultra", spend: "$19.99/mo", tip: "API direct is 60% cheaper for dev workloads" },
  { name: "Windsurf", plan: "Pro", spend: "$15/mo", tip: "Free tier covers most solo dev usage" },
  { name: "OpenAI API", plan: "Direct", spend: "$50/mo", tip: "Batch API for async jobs cuts cost by 50%" },
  { name: "Anthropic API", plan: "Direct", spend: "$40/mo", tip: "Prompt caching reduces cost by up to 90%" },
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [selected, setSelected] = useState<typeof TOOLS[0] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const count = 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,128,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,128,${p.opacity})`;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="min-h-screen text-white overflow-hidden relative" style={{ background: "#0a0a0f" }}>
      {/* Particles canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* Glow */}
      <div style={{
        position: "absolute", top: -200, left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 500,
        background: "radial-gradient(circle,rgba(0,255,128,0.12) 0%,transparent 70%)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}
        className="max-w-3xl mx-auto px-6 py-20 text-center">

        <div className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full mb-8 font-mono"
          style={{ background: "rgba(0,255,128,0.08)", border: "1px solid rgba(0,255,128,0.25)", color: "#00ff80" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00ff80" }} />
          Free AI Spend Audit Tool
        </div>

        <h1 className="text-6xl font-bold mb-5 leading-tight tracking-tight">
          Stop overpaying for{" "}
          <span style={{
            backgroundImage: "linear-gradient(90deg,#00ff80,#00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            AI tools
          </span>
        </h1>

        <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: "#888" }}>
          Get an instant audit of your AI subscriptions. See exactly where
          you're overspending and how much you could save — in 2 minutes.
        </p>

        <Link href="/audit"
          className="inline-flex items-center gap-2 font-bold px-12 py-4 rounded-xl text-lg transition-transform hover:scale-105"
          style={{ background: "linear-gradient(90deg,#00ff80,#00d4ff)", color: "#000" }}>
          Start Free Audit →
        </Link>
        <p className="text-xs mt-3" style={{ color: "#444" }}>
          No login required · 2 minutes · 100% free
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-16 mb-12">
          {[
            { value: "$2,400", label: "Avg. annual savings" },
            { value: "8", label: "Tools audited" },
            { value: "2 min", label: "To complete" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-6"
              style={{
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(0,255,128,0.15)",
                backdropFilter: "blur(10px)",
              }}>
              <div className="text-3xl font-bold mb-1" style={{ color: "#00ff80" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <p className="text-xs uppercase mb-4" style={{ color: "#444", letterSpacing: "3px" }}>
          Click a tool to preview
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TOOLS.map((tool) => (
            <button key={tool.name} onClick={() => setSelected(tool)}
              className="px-4 py-2 rounded-lg text-xs font-mono transition-all"
              style={{
                background: selected?.name === tool.name ? "rgba(0,255,128,0.1)" : "rgba(0,0,0,0.5)",
                border: selected?.name === tool.name
                  ? "1px solid rgba(0,255,128,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
                color: selected?.name === tool.name ? "#00ff80" : "#666",
                backdropFilter: "blur(8px)",
              }}>
              {tool.name}
            </button>
          ))}
        </div>

        {/* Terminal */}
        {selected && (
          <div className="rounded-xl p-5 text-left font-mono text-xs"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(0,255,128,0.25)",
              backdropFilter: "blur(12px)",
            }}>
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <div className="space-y-1 leading-loose">
              <p><span style={{ color: "#444" }}>$ </span><span style={{ color: "#fff" }}>audit --tool="{selected.name}"</span></p>
              <p><span style={{ color: "#444" }}>→ plan:  </span><span style={{ color: "#00d4ff" }}>{selected.plan}</span></p>
              <p><span style={{ color: "#444" }}>→ spend: </span><span style={{ color: "#00d4ff" }}>{selected.spend}/user</span></p>
              <p><span style={{ color: "#444" }}>→ tip:   </span><span style={{ color: "#00ff80" }}>{selected.tip}</span></p>
              <p className="mt-2" style={{ color: "#333" }}>Run full audit to see total savings ↗</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}