import { useState, useEffect } from "react";
import { 
  Terminal, 
  Send, 
  Sparkles, 
  Database, 
  Layers, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  Lock, 
  Code2, 
  FileText, 
  AlertOctagon, 
  Activity, 
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResponse, UploadSimResponse } from "./types";

// Import Custom Showcase Components
import AiCore from "./components/AiCore";
import DataPipeline from "./components/DataPipeline";
import ChartEvolution from "./components/ChartEvolution";
import SchemaExplorer from "./components/SchemaExplorer";
import SpecViewer from "./components/SpecViewer";

const SUGGESTED_PROMPTS = [
  { text: "Покажи продажи за прошлый месяц по регионам", icon: TrendingUp },
  { text: "Распределение пользователей по тарифам и планам", icon: Layers },
  { text: "Каково среднее время ответа (latency) API сегодня?", icon: Activity },
  { text: "Выяви аномалии и критические выбросы в нагрузке", icon: AlertOctagon }
];

export default function App() {
  const [activeView, setActiveView] = useState<"playground" | "pipeline" | "schema" | "spec">("playground");
  const [prompt, setPrompt] = useState("");
  const [coreStatus, setCoreStatus] = useState<"idle" | "processing" | "generating" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [ingestedRows, setIngestedRows] = useState<number | null>(null);

  // Dynamic status states for system statistics
  const [redisStats, setRedisStats] = useState({ hits: 485, efficiency: "94.2%" });
  const [postgresState, setPostgresState] = useState("ONLINE");

  // Run a default query on mount to populate the dashboard with high-end charts
  useEffect(() => {
    handleQuerySubmit("Покажи продажи за прошлый месяц по регионам");
  }, []);

  const handleQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setResponse(null);
    setErrorText(null);
    setCoreStatus("processing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText })
      });

      const data = await res.json();

      if (!res.ok || data.status === "failed") {
        setCoreStatus("error");
        setErrorText(data.error || "Failed to process query");
        setResponse(data); // still pass response to show logs
      } else {
        // Step 1: Simulated delay for processing -> insights generation
        setTimeout(() => {
          setCoreStatus("generating");
          
          // Step 2: Simulated delay for insights -> showing final charts
          setTimeout(() => {
            setCoreStatus("idle");
            setResponse(data);
            setLoading(false);
          }, 800);
        }, 1000);
      }
    } catch (err) {
      setCoreStatus("error");
      setErrorText("Database pipeline is offline or returned an internal compilation error.");
      setLoading(false);
    }
  };

  const handleIngestNotification = (data: UploadSimResponse) => {
    setIngestedRows(data.totalRows);
    setPostgresState("SYNCING");
    setTimeout(() => {
      setPostgresState("ONLINE");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-cyber-grid relative pb-12 text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Decorative Top Ambient Light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[150px] bg-gradient-to-b from-blue-600/10 to-transparent rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[120px] bg-gradient-to-b from-purple-600/10 to-transparent rounded-full filter blur-[90px] pointer-events-none" />

      {/* ---------------------------------------------------------
          HEADER BAR
         --------------------------------------------------------- */}
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-0.5 shadow-lg shadow-blue-500/10 flex items-center justify-center relative overflow-hidden group">
              {/* Spinning core highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-20 group-hover:opacity-40 animate-pulse" />
              <Cpu className="w-4.5 h-4.5 text-white z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-widest text-white">AETHERDATA</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest bg-blue-950/40 border border-blue-500/20 text-blue-400">AI AGENT</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 block uppercase">ENTERPRISE CORE PLAYGROUND</span>
            </div>
          </div>

          {/* Core System Live Indicators */}
          <div className="hidden md:flex items-center gap-6 font-mono text-[10px]">
            <div className="flex items-center gap-2 border-r border-white/5 pr-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">POSTGRES: <span className="text-emerald-400 font-semibold">{postgresState}</span></span>
            </div>

            <div className="flex items-center gap-2 border-r border-white/5 pr-4">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">REDIS EFFICIENCY: <span className="text-blue-400 font-semibold">{redisStats.efficiency}</span></span>
            </div>

            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-slate-400">ENGINE LATENCY: <span className="text-purple-400 font-semibold">12.5ms</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------
          MAIN NAVIGATION TABS
         --------------------------------------------------------- */}
      <nav className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2 p-1 border border-white/5 bg-slate-950/40 rounded-xl max-w-lg">
          <button
            onClick={() => setActiveView("playground")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeView === "playground" 
                ? "bg-blue-600 text-white shadow" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            01. CORE
          </button>
          <button
            onClick={() => setActiveView("pipeline")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeView === "pipeline" 
                ? "bg-blue-600 text-white shadow" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            02. PIPELINE
          </button>
          <button
            onClick={() => setActiveView("schema")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeView === "schema" 
                ? "bg-blue-600 text-white shadow" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            03. SCHEMA
          </button>
          <button
            onClick={() => setActiveView("spec")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              activeView === "spec" 
                ? "bg-blue-600 text-white shadow" 
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            04. PRD SPEC
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------------
          VIEW ROUTING BLOCK
         --------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-6 mt-6">
        <AnimatePresence mode="wait">
          
          {/* VIEW: MAIN PLAYGROUND / THE CORE */}
          {activeView === "playground" && (
            <motion.div
              key="playground"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* Left Column (3D Core + Quick Prompts - 4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Visualizer widget */}
                <AiCore status={coreStatus} />

                {/* Database Metrics Stats Card */}
                <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                  <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-400" />
                    PIPELINE METRIC NODE
                  </h3>

                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/20">
                      <span className="text-[9px] text-slate-500 block uppercase">Active Syncs</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block">
                        {ingestedRows ? ingestedRows.toLocaleString() : "528,420"}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/20">
                      <span className="text-[9px] text-slate-500 block uppercase">Redis Query Cache</span>
                      <span className="text-sm font-semibold text-blue-400 mt-1 block">94.2% hit</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal font-mono">
                    * Входящие транзакции парсятся чанками по 10,000 строк. ИИ автоматически снимает DDL схемы PostgreSQL для трансляции SQL.
                  </p>
                </div>

                {/* Suggestions quickbar */}
                <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40">
                  <h4 className="text-xs font-mono tracking-widest text-slate-400 mb-3 uppercase">
                    SUGGESTED ANALYTICS PROMPTS
                  </h4>
                  <div className="space-y-2">
                    {SUGGESTED_PROMPTS.map((promptItem, idx) => {
                      const Icon = promptItem.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setPrompt(promptItem.text);
                            handleQuerySubmit(promptItem.text);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-slate-900/20 hover:border-white/10 hover:bg-slate-900/40 text-left text-xs text-slate-300 hover:text-blue-400 transition-all cursor-pointer"
                        >
                          <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="truncate">{promptItem.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column (Playground console, charts & logs - 8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Query Input Bar Console */}
                <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40">
                  <h3 className="text-xs font-mono tracking-widest text-slate-400 mb-3.5 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    CONVERSATIONAL DATA INTEL CONSOLE
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleQuerySubmit(prompt)}
                      placeholder="Запросите ИИ, например: 'Выяви аномалии в задержках API'..."
                      className="flex-grow px-4 py-3 bg-[#050914] border border-white/5 focus:border-blue-500/40 rounded-xl text-xs font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-slate-200"
                    />
                    <button
                      onClick={() => handleQuerySubmit(prompt)}
                      disabled={loading || !prompt.trim()}
                      className="px-5 py-3 rounded-xl font-mono text-xs tracking-wider bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/10"
                    >
                      <Send className="w-3.5 h-3.5" />
                      SUBMIT
                    </button>
                  </div>
                </div>

                {/* Real-time Dynamic Chart Panel */}
                <ChartEvolution 
                  loading={loading} 
                  chartType={response?.chartType || "bar"} 
                  chartData={response?.chartData || []} 
                />

                {/* AI Agent Step-by-step Loop & Logs */}
                <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      AGENT EXECUTION LOG TRACING
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      SECURE DB ACCESS SHIELD
                    </span>
                  </div>

                  {/* Multi-step pipeline tracker */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(response?.steps || [
                      { name: "Schema Mapping", status: "success" },
                      { name: "Guardrail Screening", status: "success" },
                      { name: "SQL Translation", status: "success" },
                      { name: "Query Execution", status: "success" },
                      { name: "Semantic Compilation", status: "success" }
                    ]).map((stepItem, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border font-mono text-[10px] flex flex-col justify-between ${
                          stepItem.status === "failed" 
                            ? "border-red-500/30 bg-red-950/10 text-red-400" 
                            : stepItem.status === "success"
                            ? "border-emerald-500/20 bg-emerald-950/5 text-emerald-400"
                            : "border-white/5 bg-slate-900/10 text-slate-500"
                        }`}
                      >
                        <span className="text-[9px] text-slate-500 uppercase block mb-1">0{idx+1} {stepItem.name}</span>
                        <div className="flex items-center gap-1 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {stepItem.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logs Container Console */}
                  <div className="p-4 rounded-xl border border-white/5 bg-[#040811] font-mono text-[10px] text-slate-400 leading-relaxed overflow-y-auto max-h-36 space-y-1">
                    {response?.logs.map((log, idx) => (
                      <div key={idx} className="border-l-2 border-blue-500/20 pl-2.5">
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* SQL Guardrail & Compiler Console Output */}
                  {response && (
                    <div className="space-y-3">
                      
                      {/* Human-readable insight interpretation */}
                      {response.explanation && (
                        <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-950/5 space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            AETHER INSIGHT INTERPRETATION
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {response.explanation}
                          </p>
                        </div>
                      )}

                      {/* Code Console */}
                      {response.sql && (
                        <div className="p-4 rounded-xl border border-white/5 bg-[#040811]">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2">
                            <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-blue-400" /> GENERATED POSTGRESQL CODE</span>
                            <span>COMPILED FOR PG_16</span>
                          </div>
                          <pre className="text-[10px] text-blue-400 overflow-x-auto p-2 bg-black/40 rounded border border-white/5 font-mono">
                            <code>{response.sql}</code>
                          </pre>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Security violations shield triggered */}
                  {errorText && (
                    <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/10 flex items-start gap-3">
                      <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-mono font-bold text-red-400 uppercase">Shield Block Triggered</h4>
                        <p className="text-[11px] text-red-500/95 leading-normal mt-1 font-mono">
                          {errorText}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </motion.div>
          )}

          {/* VIEW: DATA PIPELINE */}
          {activeView === "pipeline" && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <DataPipeline onIngestComplete={handleIngestNotification} />
            </motion.div>
          )}

          {/* VIEW: SCHEMA EXPLORER */}
          {activeView === "schema" && (
            <motion.div
              key="schema"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SchemaExplorer />
            </motion.div>
          )}

          {/* VIEW: FULL PRD SPECIFICATION */}
          {activeView === "spec" && (
            <motion.div
              key="spec"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SpecViewer />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
