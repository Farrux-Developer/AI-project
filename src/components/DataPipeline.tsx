import { useState, useRef, useEffect } from "react";
import { Upload, FileSpreadsheet, Play, CheckCircle, Database, Server, RefreshCw, Loader2 } from "lucide-react";
import { UploadSimResponse } from "../types";

interface DataPipelineProps {
  onIngestComplete: (response: UploadSimResponse) => void;
}

const SAMPLE_FILES = [
  { name: "sales_q2_2026.csv", size: "14.2 MB", rows: "189,000", color: "from-blue-500 to-cyan-500" },
  { name: "api_latency_log.csv", size: "3.1 MB", rows: "45,000", color: "from-purple-500 to-indigo-500" },
  { name: "user_metrics_v2.xlsx", size: "28.4 MB", rows: "420,000", color: "from-emerald-500 to-teal-500" }
];

export default function DataPipeline({ onIngestComplete }: DataPipelineProps) {
  const [selectedFile, setSelectedFile] = useState<typeof SAMPLE_FILES[0] | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState<"idle" | "uploading" | "streaming" | "complete">("idle");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle particle flow animation on canvas
  useEffect(() => {
    if (step !== "streaming") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.clientWidth || 400);
    let height = (canvas.height = canvas.clientHeight || 120);

    const particles: Array<{ x: number; y: number; speed: number; size: number; color: string }> = [];
    let animationFrameId: number;

    const spawnParticle = () => {
      particles.push({
        x: 40, // Left edge (Upload Node)
        y: height / 2 + (Math.random() * 20 - 10),
        speed: 2 + Math.random() * 4,
        size: Math.random() * 3 + 1,
        color: selectedFile?.name.includes("sales") 
          ? `rgba(59, 130, 246, ${Math.random() * 0.7 + 0.3})` 
          : selectedFile?.name.includes("api") 
          ? `rgba(168, 85, 247, ${Math.random() * 0.7 + 0.3})`
          : `rgba(16, 185, 129, ${Math.random() * 0.7 + 0.3})`
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw active connection tubes (Data Pipes)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, height / 2);
      ctx.lineTo(width - 40, height / 2);
      ctx.stroke();

      // Curved pipelines to DB tables
      ctx.beginPath();
      ctx.moveTo(40, height / 2);
      ctx.bezierCurveTo(width / 3, height / 2, (width * 2) / 3, 20, width - 40, 25);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(40, height / 2);
      ctx.bezierCurveTo(width / 3, height / 2, (width * 2) / 3, height - 20, width - 40, height - 25);
      ctx.stroke();

      // Spawn particles
      if (Math.random() > 0.1) spawnParticle();

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speed;

        // Path bifurcation
        let py = height / 2;
        if (p.x > width / 3) {
          const ratio = (p.x - width / 3) / (width * 0.6);
          const segment = i % 3;
          if (segment === 0) {
            // Curves upwards
            py = height / 2 - (height / 2 - 25) * Math.sin(ratio * Math.PI / 2);
          } else if (segment === 1) {
            // Stays centered
            py = height / 2;
          } else {
            // Curves downwards
            py = height / 2 + (height / 2 - 25) * Math.sin(ratio * Math.PI / 2);
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Remove offscreen particles
        if (p.x > width - 40) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [step, selectedFile]);

  const handleIngest = async () => {
    if (!selectedFile) return;
    setIngesting(true);
    setStep("uploading");
    setProgress(10);
    setLogs([`[AETHER DATA ENGINE] Initializing pipeline worker node 0x7E3...`]);

    const addLogWithDelay = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, `[${new Date().toISOString().slice(11, 19)}] ${msg}`]);
          resolve();
        }, delay);
      });
    };

    await addLogWithDelay(`Connecting to ingestion gateway. Active buffer threshold: 128MB.`, 400);
    setProgress(25);
    await addLogWithDelay(`Parsing target binary chunks. Character set identified: UTF-8.`, 300);
    setProgress(40);
    
    // Switch to active particles streaming
    setStep("streaming");
    await addLogWithDelay(`Mapping CSV structure into target database schema. Staging tables compiled.`, 500);
    setProgress(55);
    await addLogWithDelay(`Ingesting chunk 1/4 (25,000 rows)... Latency: 4.2ms. Threads active: 8.`, 400);
    setProgress(70);
    await addLogWithDelay(`Ingesting chunk 2/4 (50,000 rows)... Committing index modifications...`, 400);
    setProgress(85);
    await addLogWithDelay(`Bulk writing transactions into main PostgreSQL table storage.`, 500);
    setProgress(95);

    // Call server API simulation
    try {
      const res = await fetch("/api/upload-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          size: selectedFile.size
        })
      });
      const data: UploadSimResponse = await res.json();
      
      setProgress(100);
      setStep("complete");
      setIngesting(false);
      
      setLogs((prev) => [
        ...prev,
        ...data.logs.map(log => `[${new Date().toISOString().slice(11, 19)}] ${log}`),
        `[SUCCESS] Ingestion pipeline finalized. Sync status: OK.`
      ]);

      onIngestComplete(data);
    } catch (err) {
      setLogs((prev) => [...prev, `[ERROR] Pipeline crashed: connection refused to metadata server.`]);
      setIngesting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setStep("idle");
    setProgress(0);
    setLogs([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full p-1" id="data-pipeline-container">
      {/* File Loader Panel (4 Cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden">
        <div>
          <h3 className="text-sm font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            01. LOAD DATA SOURCE
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Выберите тяжелый датасет корпоративного уровня для симуляции высокоскоростного парсинга и наполнения СУБД Postgres.
          </p>

          <div className="space-y-3">
            {SAMPLE_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => step === "idle" && setSelectedFile(file)}
                disabled={step !== "idle"}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left group ${
                  selectedFile?.name === file.name
                    ? "border-blue-500/50 bg-blue-950/20 shadow-md shadow-blue-500/5"
                    : "border-white/5 bg-slate-900/20 hover:border-white/10 hover:bg-slate-900/40"
                } ${step !== "idle" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${file.color} bg-opacity-10 text-white shadow-inner`}>
                    <FileSpreadsheet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      {file.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">{file.size}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">{file.rows}</span>
                  <span className="text-[9px] font-mono text-slate-600 block">rows</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          {step === "idle" ? (
            <button
              onClick={handleIngest}
              disabled={!selectedFile}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs tracking-wider transition-all duration-300 ${
                selectedFile
                  ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-98 shadow-lg shadow-blue-500/10"
                  : "bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              INGEST DATA SOURCE
            </button>
          ) : (
            <button
              onClick={handleReset}
              disabled={ingesting}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs tracking-wider border border-white/10 bg-slate-900 hover:bg-slate-850 text-slate-300 cursor-pointer active:scale-98 transition-all duration-300 ${
                ingesting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${ingesting ? "animate-spin" : ""}`} />
              RESET INGESTION
            </button>
          )}
        </div>
      </div>

      {/* Animation & Logger Panel (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden h-full">
        <div>
          <h3 className="text-sm font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            02. MULTI-THREAD PIPELINE FLOW
          </h3>
          
          {/* Flow visualizer */}
          <div className="h-28 w-full border border-white/5 bg-slate-900/10 rounded-xl relative flex items-center justify-between px-6 overflow-hidden">
            {/* Source Node */}
            <div className="z-10 flex flex-col items-center gap-1">
              <div className={`p-3 rounded-full border shadow-inner ${
                step !== "idle" ? "border-blue-500 bg-blue-950/50 text-blue-400 animate-pulse" : "border-white/10 bg-slate-900/60 text-slate-500"
              }`}>
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-slate-400">INPUT PORT</span>
            </div>

            {/* Animation Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            {/* Ingress Destination Node */}
            <div className="z-10 flex flex-col items-center gap-1">
              <div className={`p-3 rounded-full border shadow-inner transition-colors duration-500 ${
                step === "complete" 
                  ? "border-emerald-500 bg-emerald-950/50 text-emerald-400" 
                  : step === "streaming"
                  ? "border-purple-500 bg-purple-950/50 text-purple-400 animate-spin"
                  : "border-white/10 bg-slate-900/60 text-slate-500"
              }`}>
                <Database className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-slate-400">PG TRANSACTION</span>
            </div>
          </div>
        </div>

        {/* Real-time Streaming Logs */}
        <div className="mt-4 flex-grow flex flex-col min-h-36">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5 px-1">
            <span>PIPELINE AGENT SYSTEM LOGS</span>
            {step === "streaming" && (
              <span className="text-purple-400 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                THREADS BULK-WRITING ({progress}%)
              </span>
            )}
            {step === "complete" && (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3" />
                INGESTED
              </span>
            )}
          </div>
          
          <div 
            ref={logContainerRef}
            className="flex-grow p-4 rounded-xl border border-white/5 bg-[#040811] font-mono text-[10px] text-slate-400 leading-relaxed overflow-y-auto space-y-1.5 h-36"
          >
            {logs.length === 0 ? (
              <div className="text-slate-600 flex items-center justify-center h-full">
                [SYSTEM IDLE] Ожидание запуска пайплайна загрузки данных...
              </div>
            ) : (
              logs.map((log, index) => {
                let textClass = "text-slate-400";
                if (log.includes("[SUCCESS]") || log.includes("finalized")) textClass = "text-emerald-400 font-medium";
                if (log.includes("[ERROR]") || log.includes("CRITICAL")) textClass = "text-red-400 font-semibold";
                if (log.includes("[DATABASE]") || log.includes("rows")) textClass = "text-blue-400";
                
                return (
                  <div key={index} className={`border-l-2 border-transparent pl-2 ${textClass}`}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
