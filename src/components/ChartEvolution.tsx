import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, BarChart2, PieChart, LineChart, Loader2 } from "lucide-react";

interface ChartEvolutionProps {
  loading: boolean;
  chartType: "bar" | "line" | "area" | "pie";
  chartData: Array<Record<string, string | number>>;
}

export default function ChartEvolution({ loading, chartType, chartData }: ChartEvolutionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fallback to empty if no data is provided
  const data = chartData || [];
  
  // Extract keys and numeric values
  const numericKey = data.length > 0 ? Object.keys(data[0]).find(k => typeof data[0][k] === "number") || "value" : "value";
  const labelKey = data.length > 0 ? Object.keys(data[0]).find(k => typeof data[0][k] === "string") || "name" : "name";

  const maxVal = data.length > 0 ? Math.max(...data.map(item => Number(item[numericKey] || 0))) * 1.15 : 100;

  // Render Skeleton Placeholders for Metamorphosis
  if (loading) {
    return (
      <div className="flex flex-col justify-between h-full p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden min-h-72">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5 w-1/3">
            <div className="h-4 w-full rounded shimmer-bg" />
            <div className="h-3 w-2/3 rounded shimmer-bg opacity-50" />
          </div>
          <div className="h-7 w-20 rounded-lg shimmer-bg" />
        </div>

        {/* Shimmering Skeleton Graph Grid */}
        <div className="flex-grow flex items-end gap-3 h-48 px-2 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-white/20 w-full h-px" />
            <div className="border-b border-dashed border-white/20 w-full h-px" />
            <div className="border-b border-dashed border-white/20 w-full h-px" />
            <div className="border-b border-dashed border-white/20 w-full h-px" />
          </div>
          
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-grow flex flex-col items-center gap-2 h-full justify-end">
              <div 
                className="w-full rounded shimmer-bg" 
                style={{ 
                  height: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.15}s`
                }} 
              />
              <div className="h-2 w-10 rounded shimmer-bg opacity-40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl border border-white/5 bg-slate-950/40 relative overflow-hidden min-h-72" id="chart-evolution-container">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10" />

      {/* Title block */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-mono font-medium text-slate-400 tracking-wider flex items-center gap-2">
            {chartType === "bar" && <BarChart2 className="w-3.5 h-3.5 text-blue-400" />}
            {chartType === "line" && <LineChart className="w-3.5 h-3.5 text-purple-400" />}
            {chartType === "area" && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {chartType === "pie" && <PieChart className="w-3.5 h-3.5 text-pink-400" />}
            03. TEXT-TO-CHART EVOLUTION
          </h4>
          <span className="text-[10px] font-mono text-slate-500">
            Dynamic rendering based on semantic analysis of: <span className="text-slate-400 font-semibold">{numericKey}</span>
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 bg-slate-900/60 border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-mono text-slate-300">
          <span className={`w-1.5 h-1.5 rounded-full ${
            chartType === "bar" ? "bg-blue-400" : chartType === "line" ? "bg-purple-400" : chartType === "area" ? "bg-emerald-400" : "bg-pink-400"
          }`} />
          <span>PostgreSQL Active</span>
        </div>
      </div>

      {/* Main Graphical Display Panel */}
      <div className="flex-grow flex items-end justify-center h-48 relative min-h-48 mt-2">
        {/* Grid lines background */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-b border-dashed border-white/40 w-full h-px" />
          <div className="border-b border-dashed border-white/40 w-full h-px" />
          <div className="border-b border-dashed border-white/40 w-full h-px" />
          <div className="border-b border-dashed border-white/40 w-full h-px" />
        </div>

        {/* ---------------------------------------------------------
            BAR CHART TYPE
           --------------------------------------------------------- */}
        {chartType === "bar" && (
          <div className="w-full h-full flex items-end gap-3 px-2">
            {data.map((item, idx) => {
              const val = Number(item[numericKey] || 0);
              const pct = maxVal > 0 ? (val / maxVal) * 90 : 0;
              return (
                <div 
                  key={idx} 
                  className="flex-grow flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-1 z-25 bg-slate-900 border border-blue-500/20 px-2 py-1.5 rounded-lg text-center shadow-lg font-mono"
                      >
                        <span className="text-[9px] text-slate-500 block uppercase">{String(item[labelKey])}</span>
                        <span className="text-xs font-semibold text-blue-400">{val.toLocaleString()}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cylindrical glowing neon Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 15, delay: idx * 0.05 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-600/20 to-blue-500 border border-blue-500/30 group-hover:border-blue-400 group-hover:to-blue-400 transition-all shadow-inner relative overflow-hidden"
                  >
                    {/* Glowing highlight trace */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-60" />
                  </motion.div>

                  <span className="text-[9px] font-mono text-slate-500 mt-2 rotate-12 origin-top-left translate-x-1.5 max-w-16 truncate">
                    {String(item[labelKey])}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------------------------------------------------
            LINE CHART TYPE
           --------------------------------------------------------- */}
        {chartType === "line" && (
          <div className="w-full h-full flex flex-col justify-end">
            <svg className="w-full h-40 overflow-visible" viewBox="0 0 400 150">
              {/* Build dynamic path points */}
              {(() => {
                const count = data.length;
                if (count === 0) return null;
                const points = data.map((item, idx) => {
                  const x = (idx / (count - 1)) * 380 + 10;
                  const val = Number(item[numericKey] || 0);
                  const y = 140 - (maxVal > 0 ? (val / maxVal) * 110 : 0);
                  return { x, y, item, val };
                });

                const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

                return (
                  <>
                    {/* Glowing underlay line */}
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      d={pathD}
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.25)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Master line vector */}
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      d={pathD}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Hover hotspot anchor points */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="12" 
                          fill="transparent" 
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="4" 
                          fill="#c084fc" 
                          stroke="#1e1b4b" 
                          strokeWidth="2" 
                          className="pointer-events-none"
                        />
                      </g>
                    ))}

                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </>
                );
              })()}
            </svg>

            {/* Labels x-axis */}
            <div className="w-full flex justify-between px-2 text-[9px] font-mono text-slate-500 mt-2">
              {data.map((item, idx) => (
                <span key={idx} className="truncate max-w-12">{String(item[labelKey])}</span>
              ))}
            </div>

            {/* Hover tooltip for line */}
            <AnimatePresence>
              {hoveredIndex !== null && data[hoveredIndex] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-2 left-4 z-20 bg-slate-900 border border-purple-500/20 px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2"
                >
                  <span className="text-slate-500 uppercase">{String(data[hoveredIndex][labelKey])}:</span>
                  <span className="text-purple-400 font-semibold">{Number(data[hoveredIndex][numericKey]).toLocaleString()}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ---------------------------------------------------------
            AREA CHART TYPE
           --------------------------------------------------------- */}
        {chartType === "area" && (
          <div className="w-full h-full flex flex-col justify-end">
            <svg className="w-full h-40 overflow-visible" viewBox="0 0 400 150">
              {(() => {
                const count = data.length;
                if (count === 0) return null;
                const points = data.map((item, idx) => {
                  const x = (idx / (count - 1)) * 380 + 10;
                  const val = Number(item[numericKey] || 0);
                  const y = 140 - (maxVal > 0 ? (val / maxVal) * 110 : 0);
                  return { x, y, item, val };
                });

                const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

                return (
                  <>
                    {/* Area fill */}
                    <motion.path 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                      d={areaD}
                      fill="url(#areaGradient)"
                    />

                    {/* Glowing edge line */}
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      d={pathD}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />

                    {/* Hotspot triggers */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="14" 
                          fill="transparent" 
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="4" 
                          fill="#34d399" 
                          stroke="#022c22" 
                          strokeWidth="2" 
                          className="pointer-events-none"
                        />
                      </g>
                    ))}

                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </>
                );
              })()}
            </svg>

            {/* Labels */}
            <div className="w-full flex justify-between px-2 text-[9px] font-mono text-slate-500 mt-2">
              {data.map((item, idx) => (
                <span key={idx} className="truncate max-w-12">{String(item[labelKey])}</span>
              ))}
            </div>

            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredIndex !== null && data[hoveredIndex] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-2 left-4 z-20 bg-slate-900 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2"
                >
                  <span className="text-slate-500 uppercase">{String(data[hoveredIndex][labelKey])}:</span>
                  <span className="text-emerald-400 font-semibold">{Number(data[hoveredIndex][numericKey]).toLocaleString()}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ---------------------------------------------------------
            PIE / DONUT CHART TYPE
           --------------------------------------------------------- */}
        {chartType === "pie" && (
          <div className="w-full h-full flex items-center justify-around">
            <svg className="w-40 h-40 overflow-visible" viewBox="0 0 100 100">
              {(() => {
                const total = data.reduce((sum, item) => sum + Number(item[numericKey] || 0), 0);
                let currentAngle = 0;
                
                const colors = ["#f472b6", "#ec4899", "#db2777", "#be185d"];

                return data.map((item, idx) => {
                  const val = Number(item[numericKey] || 0);
                  const percent = total > 0 ? val / total : 0;
                  const strokeVal = percent * 100;
                  const strokeOffset = 100 - currentAngle + 25; // Align to top
                  
                  currentAngle += strokeVal;
                  
                  return (
                    <motion.circle 
                      key={idx}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="transparent"
                      stroke={colors[idx % colors.length]}
                      strokeWidth="10"
                      strokeDasharray={`${strokeVal} ${100 - strokeVal}`}
                      strokeDashoffset={strokeOffset}
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: `${strokeVal} ${100 - strokeVal}` }}
                      transition={{ duration: 1.0, delay: idx * 0.1, ease: "easeInOut" }}
                      className="cursor-pointer hover:stroke-[12] transition-all"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                });
              })()}
              {/* Inner hole */}
              <circle cx="50" cy="50" r="26" fill="#030712" />
            </svg>

            {/* Side legends for Pie segments */}
            <div className="flex flex-col gap-2 font-mono text-[10px] pr-2">
              {data.map((item, idx) => {
                const colors = ["bg-pink-400", "bg-pink-500", "bg-pink-600", "bg-pink-700"];
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 p-1.5 rounded transition-colors ${
                      hoveredIndex === idx ? "bg-slate-900 border border-white/5" : "border border-transparent"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                    <div>
                      <span className="text-slate-300 block font-medium">{String(item[labelKey])}</span>
                      <span className="text-[9px] text-slate-500">{Number(item[numericKey]).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Stats block bottom */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-slate-500">
          <span>COMPILED METRICS: {data.length} segments</span>
          <span className="text-slate-400">FPS STABLE: 60 FPS</span>
        </div>
      )}
    </div>
  );
}
