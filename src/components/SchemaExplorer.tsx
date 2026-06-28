import { useState, useEffect } from "react";
import { Database, Key, HelpCircle, Columns, Eye, ChevronRight, Binary } from "lucide-react";
import { DBSchema, DBTable } from "../types";

export default function SchemaExplorer() {
  const [schema, setSchema] = useState<DBSchema | null>(null);
  const [selectedTable, setSelectedTable] = useState<DBTable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch("/api/schema");
        const data = await res.json();
        if (data.status === "success" && data.schema) {
          setSchema(data.schema);
          setSelectedTable(data.schema.tables[0]);
        }
      } catch (err) {
        console.error("Failed to load schema", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchema();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-48 border border-white/5 bg-slate-950/40 rounded-2xl">
        <Database className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        <span className="font-mono text-xs text-slate-500">READING POSTGRES SCHEMA...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full p-1" id="schema-explorer-container">
      {/* Table select column (4 cols) */}
      <div className="md:col-span-4 space-y-2.5">
        <h3 className="text-xs font-mono tracking-wider text-slate-500 mb-3 uppercase flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          ACTIVE DATABASE SCHEMA
        </h3>
        
        {schema?.tables.map((table) => (
          <button
            key={table.name}
            onClick={() => setSelectedTable(table)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden group flex items-center justify-between ${
              selectedTable?.name === table.name
                ? "border-blue-500/40 bg-blue-950/20 shadow-md shadow-blue-500/5"
                : "border-white/5 bg-slate-900/10 hover:border-white/10 hover:bg-slate-900/30"
            }`}
          >
            {/* Ambient left stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-transform duration-300 ${
              selectedTable?.name === table.name ? "bg-blue-500 scale-y-100" : "bg-transparent scale-y-0 group-hover:scale-y-50"
            }`} />

            <div className="pl-1">
              <span className="text-xs font-mono font-semibold text-slate-200 block group-hover:text-blue-400 transition-colors">
                {table.name}
              </span>
              <span className="text-[10px] text-slate-500 block truncate max-w-44">
                {table.description}
              </span>
            </div>
            
            <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
              selectedTable?.name === table.name ? "text-blue-400 translate-x-1" : "group-hover:translate-x-0.5"
            }`} />
          </button>
        ))}
      </div>

      {/* Columns & Agent metadata view (8 cols) */}
      <div className="md:col-span-8 flex flex-col justify-between border border-white/5 bg-slate-950/40 p-5 rounded-2xl h-full relative">
        {selectedTable ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-mono text-slate-200">
                  TABLE: <span className="text-blue-400 font-semibold font-sans">{selectedTable.name}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedTable.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900/60 px-2 py-1 rounded border border-white/5">
                <Columns className="w-3.5 h-3.5" />
                <span>{selectedTable.columns.length} columns</span>
              </div>
            </div>

            {/* Column Schema Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] leading-relaxed">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500">
                    <th className="pb-2 font-medium">COLUMN NAME</th>
                    <th className="pb-2 font-medium">DATATYPE</th>
                    <th className="pb-2 font-medium text-right">KEY / CONSTRAINT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {selectedTable.columns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 group">
                      <td className="py-2.5 font-semibold text-slate-200 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-blue-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {col.name}
                      </td>
                      <td className="py-2.5 text-slate-400">{col.type}</td>
                      <td className="py-2.5 text-right font-medium">
                        {col.key ? (
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] ${
                            col.key.includes("PRIMARY") 
                              ? "bg-amber-950/30 border border-amber-500/20 text-amber-400"
                              : "bg-purple-950/30 border border-purple-500/20 text-purple-400"
                          }`}>
                            <Key className="w-2.5 h-2.5" />
                            {col.key.includes("PRIMARY") ? "PK" : "FK"}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How AI uses this metadata */}
            <div className="mt-4 p-3.5 rounded-xl border border-white/5 bg-[#040811] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400">
                <Binary className="w-3.5 h-3.5 animate-pulse" />
                HOW AI-AGENTS COMPREHEND THIS SCHEMA
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                При формировании промпта ИИ-Агент сканирует метаданные схемы. Связи внешних ключей <span className="text-purple-400">(FK)</span> помогают агенту автоматически компилировать сложные <span className="text-blue-400">JOIN</span>-запросы, определяя отношения типа <span className="text-slate-400">orders.user_id ➔ users.id</span> без дополнительных подсказок пользователя.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-slate-500 text-xs font-mono">
            SELECT A TABLE FROM THE SCHEMA LIST
          </div>
        )}
      </div>
    </div>
  );
}
