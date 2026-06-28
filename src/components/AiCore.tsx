import { useEffect, useRef, useState } from "react";
import { Cpu, Loader2, Sparkles, AlertTriangle } from "lucide-react";

interface AiCoreProps {
  status: "idle" | "processing" | "generating" | "error";
}

export default function AiCore({ status }: AiCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 240);
    let height = (canvas.height = 240);

    // Track dimensions on container resize if needed
    const resizeObserver = new ResizeObserver(() => {
      if (canvas) {
        width = canvas.width = canvas.clientWidth || 240;
        height = canvas.height = canvas.clientHeight || 240;
      }
    });
    resizeObserver.observe(canvas);

    let angle = 0;
    const particles: Array<{ x: number; y: number; r: number; speed: number; angle: number; distance: number }> = [];

    // Initialize core orbiting particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: 0,
        y: 0,
        r: Math.random() * 2 + 0.5,
        speed: 0.02 + Math.random() * 0.03,
        angle: Math.random() * Math.PI * 2,
        distance: 40 + Math.random() * 50
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Pulse rate and size adjustments based on system status
      let pulseMultiplier = 1;
      let coreColor = "rgba(59, 130, 246, 0.85)"; // Neon Blue
      let glowColor = "rgba(59, 130, 246, 0.35)";
      let speedMultiplier = 1;

      if (status === "processing") {
        pulseMultiplier = 1.1 + Math.sin(angle * 8) * 0.08;
        coreColor = "rgba(139, 92, 246, 0.9)"; // Neon Purple
        glowColor = "rgba(139, 92, 246, 0.45)";
        speedMultiplier = 2.5;
      } else if (status === "generating") {
        pulseMultiplier = 1.05 + Math.sin(angle * 4) * 0.05;
        coreColor = "rgba(16, 185, 129, 0.9)"; // Neon Emerald
        glowColor = "rgba(16, 185, 129, 0.45)";
        speedMultiplier = 1.8;
      } else if (status === "error") {
        pulseMultiplier = 0.95 + Math.sin(angle * 12) * 0.04;
        coreColor = "rgba(239, 68, 68, 0.9)"; // Alert Red
        glowColor = "rgba(239, 68, 68, 0.45)";
        speedMultiplier = 0.5;
      } else {
        // Idle
        pulseMultiplier = 1.0 + Math.sin(angle * 2) * 0.03;
        speedMultiplier = 1.0;
      }

      angle += 0.015 * speedMultiplier;

      // 1. Draw outer glowing ambient bounds
      const coreRadius = 45 * pulseMultiplier;
      const gradientOuter = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.2);
      gradientOuter.addColorStop(0, glowColor);
      gradientOuter.addColorStop(0.5, "rgba(9, 13, 22, 0)");
      ctx.fillStyle = gradientOuter;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw multiple layered orbital rings
      ctx.lineWidth = 1;
      
      // Ring 1 (Horizontal tilt)
      ctx.strokeStyle = status === "processing" ? "rgba(139, 92, 246, 0.35)" : status === "generating" ? "rgba(16, 185, 129, 0.35)" : "rgba(59, 130, 246, 0.35)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, coreRadius * 1.6, coreRadius * 0.4, angle * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 2 (Vertical tilt)
      ctx.strokeStyle = status === "processing" ? "rgba(139, 92, 246, 0.2)" : status === "generating" ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, coreRadius * 0.5, coreRadius * 1.8, -angle * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 3 (Outer dashboard orbital)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.1, 0, Math.PI * 2);
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 3. Draw smart orbital particles
      particles.forEach((p) => {
        p.angle += p.speed * speedMultiplier;
        const radiusFactor = status === "processing" ? 1.3 : 1.0;
        const px = cx + Math.cos(p.angle) * p.distance * radiusFactor * pulseMultiplier;
        const py = cy + Math.sin(p.angle) * p.distance * 0.8 * radiusFactor * pulseMultiplier;
        
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Draw thin connections to core in processing state
        if (status === "processing" && Math.random() > 0.92) {
          ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });

      // 4. Central Plasma Core Sphere
      const gradientCore = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius);
      gradientCore.addColorStop(0, "#ffffff");
      gradientCore.addColorStop(0.2, coreColor);
      gradientCore.addColorStop(1, "rgba(3, 7, 18, 0.8)");
      
      ctx.fillStyle = gradientCore;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner details (holographic grid lines inside Core)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 0.6, angle, angle + Math.PI * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 0.3, -angle * 1.5, -angle * 1.5 + Math.PI);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [status]);

  const getStatusText = () => {
    switch (status) {
      case "processing":
        return "PROCESSING STREAM";
      case "generating":
        return "SYNTHESIZING INSIGHTS";
      case "error":
        return "GUARDRAIL SHIELD ACTIVE";
      default:
        return "CORE INTEL ONLINE";
    }
  };

  const getStatusColors = () => {
    switch (status) {
      case "processing":
        return { text: "text-purple-400 border-purple-500/30 bg-purple-950/20", glow: "rgba(139, 92, 246, 0.2)" };
      case "generating":
        return { text: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20", glow: "rgba(16, 185, 129, 0.2)" };
      case "error":
        return { text: "text-red-400 border-red-500/30 bg-red-950/20", glow: "rgba(239, 68, 68, 0.2)" };
      default:
        return { text: "text-blue-400 border-blue-500/30 bg-blue-950/20", glow: "rgba(59, 130, 246, 0.2)" };
    }
  };

  const statusStyle = getStatusColors();

  return (
    <div 
      className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden h-full group transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      id="ai-core-container"
    >
      {/* Background ambient light */}
      <div 
        className="absolute w-40 h-40 rounded-full filter blur-[60px] opacity-10 transition-all duration-700 pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: statusStyle.glow
        }}
      />

      {/* Decorative corner brackets */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20" />

      {/* Title */}
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-400 mb-2">
        <Cpu className="w-3.5 h-3.5 animate-pulse" />
        THE AETHER CORE v2.5
      </div>

      {/* Interactive Core Canvas */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
        
        {/* Absolute inner centered icon based on state */}
        <div className="absolute pointer-events-none transition-all duration-500 scale-100 group-hover:scale-110">
          {status === "processing" ? (
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          ) : status === "generating" ? (
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
          ) : status === "error" ? (
            <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mt-2 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-widest flex items-center gap-2 ${statusStyle.text} shadow-sm transition-all duration-300`}>
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === "processing" ? "bg-purple-400" : status === "generating" ? "bg-emerald-400" : status === "error" ? "bg-red-400" : "bg-blue-400"}`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === "processing" ? "bg-purple-500" : status === "generating" ? "bg-emerald-500" : status === "error" ? "bg-red-500" : "bg-blue-500"}`}></span>
        </span>
        {getStatusText()}
      </div>
    </div>
  );
}
