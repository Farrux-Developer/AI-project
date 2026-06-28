export interface DBColumn {
  name: string;
  type: string;
  key: string;
}

export interface DBTable {
  name: string;
  description: string;
  columns: DBColumn[];
}

export interface DBSchema {
  tables: DBTable[];
}

export interface AgentStep {
  name: string;
  status: "idle" | "running" | "success" | "failed";
  details?: string;
}

export interface AnalysisResponse {
  status: string;
  prompt: string;
  sql: string;
  explanation: string;
  chartType: "bar" | "line" | "area" | "pie";
  chartData: Array<Record<string, string | number>>;
  logs: string[];
  steps: Array<{ name: string; status: string; details?: string }>;
  isAnomalies?: boolean;
}

export interface UploadSimResponse {
  status: string;
  fileName: string;
  sizeBytes: number;
  totalRows: number;
  ingestedTables: string[];
  logs: string[];
}
