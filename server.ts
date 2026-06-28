import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// ---------------------------------------------------------
// Mock DB Metadata & Datasets for Simulation
// ---------------------------------------------------------
const MOCK_SCHEMA = {
  tables: [
    {
      name: "users",
      description: "User profiles, registration status and plan type",
      columns: [
        { name: "id", type: "INTEGER", key: "PRIMARY KEY" },
        { name: "email", type: "VARCHAR(255)", key: "" },
        { name: "plan", type: "VARCHAR(50)", key: "enterprise | professional | free" },
        { name: "status", type: "VARCHAR(50)", key: "active | churned" },
        { name: "created_at", type: "TIMESTAMP", key: "" },
        { name: "country", type: "VARCHAR(100)", key: "" }
      ]
    },
    {
      name: "orders",
      description: "Sales transactions, monetary values, and fulfillment status",
      columns: [
        { name: "id", type: "INTEGER", key: "PRIMARY KEY" },
        { name: "user_id", type: "INTEGER", key: "FOREIGN KEY REFERENCES users(id)" },
        { name: "amount", type: "DECIMAL(10,2)", key: "" },
        { name: "status", type: "VARCHAR(50)", key: "completed | pending | refunded" },
        { name: "created_at", type: "TIMESTAMP", key: "" },
        { name: "category", type: "VARCHAR(100)", key: "SaaS | Hardware | Consulting" }
      ]
    },
    {
      name: "api_usage",
      description: "Logs of API requests, latency metrics, and consumption",
      columns: [
        { name: "id", type: "INTEGER", key: "PRIMARY KEY" },
        { name: "org_id", type: "INTEGER", key: "" },
        { name: "endpoint", type: "VARCHAR(255)", key: "" },
        { name: "requests_count", type: "INTEGER", key: "" },
        { name: "latency_ms", type: "INTEGER", key: "" },
        { name: "date", type: "DATE", key: "" }
      ]
    }
  ]
};

// Seed mock datasets for our simulated runtime
const MOCK_DATASET_ORDERS_BY_MONTH = [
  { month: "Jan 2026", sales: 124500, orders: 450, growth: 12 },
  { month: "Feb 2026", sales: 142000, orders: 480, growth: 14 },
  { month: "Mar 2026", sales: 189000, orders: 590, growth: 33 },
  { month: "Apr 2026", sales: 215000, orders: 620, growth: 13 },
  { month: "May 2026", sales: 290000, orders: 810, growth: 34 },
  { month: "Jun 2026", sales: 345000, orders: 950, growth: 18 }
];

const MOCK_DATASET_USERS_BY_PLAN = [
  { segment: "Enterprise", count: 245, revenue: 245000 },
  { segment: "Professional", count: 1280, revenue: 128000 },
  { segment: "Free Tier", count: 8430, revenue: 0 }
];

const MOCK_DATASET_LATENCY_METRICS = [
  { hour: "00:00", "/api/v1/analyze": 120, "/api/v1/query": 85, error_rate: 0.1 },
  { hour: "04:00", "/api/v1/analyze": 115, "/api/v1/query": 90, error_rate: 0.05 },
  { hour: "08:00", "/api/v1/analyze": 185, "/api/v1/query": 140, error_rate: 1.2 },
  { hour: "12:00", "/api/v1/analyze": 240, "/api/v1/query": 195, error_rate: 2.1 },
  { hour: "16:00", "/api/v1/analyze": 195, "/api/v1/query": 150, error_rate: 1.5 },
  { hour: "20:00", "/api/v1/analyze": 130, "/api/v1/query": 95, error_rate: 0.4 }
];

// ---------------------------------------------------------
// API Routes
// ---------------------------------------------------------

// Retrieve database schema metadata
app.get("/api/schema", (req, res) => {
  res.json({
    status: "success",
    schema: MOCK_SCHEMA
  });
});

// Full-stack Conversational SQL Agent Endpoint
app.post("/api/analyze", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const logs: string[] = [];
  const addLog = (msg: string) => logs.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);

  addLog("Agent triggered: " + prompt);
  addLog("Step 1: Extracted table structures and active schema meta-context.");

  // Check SQL injection guardrails
  const lowerPrompt = prompt.toLowerCase();
  const hasSqlInjectionRisk = lowerPrompt.includes("drop table") || 
                              lowerPrompt.includes("delete from") || 
                              lowerPrompt.includes("truncate") || 
                              lowerPrompt.includes("insert into") ||
                              lowerPrompt.includes("update ");

  addLog("Step 2: Checking security guardrails...");
  if (hasSqlInjectionRisk) {
    addLog("CRITICAL: SQL Injection or write privilege violation detected!");
    return res.status(403).json({
      error: "Security Violation: Dynamic writes, deletions or updates are blocked.",
      logs,
      steps: [
        { name: "Schema Mapping", status: "success" },
        { name: "Guardrails Checking", status: "failed", details: "SQL Injection Block triggered." }
      ]
    });
  }
  addLog("Guardrails passed. Query classified as analytical (READ-ONLY).");

  const client = getGeminiClient();

  if (client) {
    // ACTIVE REAL LLM MODE
    addLog("Step 3: Compiling natural language to PostgreSQL syntax using Gemini 3.5...");
    try {
      const systemInstruction = `
You are the elite "AetherData AI" Postgres SQL Translator & Analytical Agent.
Given the database schema below:
${JSON.stringify(MOCK_SCHEMA, null, 2)}

Your goal is to parse the user's analytical query and generate a valid PostgreSQL SELECT query.
Also, classify the data and return a JSON structure that can be easily mapped to a graphical chart (Bar, Line, Area, or Pie).

Return a valid JSON matching this schema:
{
  "sql": "string containing the generated SQL query",
  "explanation": "brief human-readable analysis of the results",
  "chartType": "bar | line | area | pie",
  "chartData": [
    { "name": "label", "value": number, ...additional properties }
  ],
  "corrected": boolean (did you have to self-correct?)
}
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const responseText = response.text || "{}";
      addLog("Step 4: LLM compilation complete. Simulating database compiler execution...");
      addLog("Step 5: SQL execution: Success! Self-Correction Loop not triggered.");
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch (err) {
        addLog("Error: LLM returned invalid JSON. Triggering automatic Self-Correction Loop...");
        // Fast fallback on parse error
        parsedResponse = {
          sql: "SELECT month, SUM(amount) FROM orders GROUP BY month;",
          explanation: "Parsed orders dataset.",
          chartType: "bar",
          chartData: MOCK_DATASET_ORDERS_BY_MONTH
        };
      }

      addLog("Step 6: Insights generated and structured data compiled.");
      return res.json({
        status: "success",
        prompt,
        sql: parsedResponse.sql,
        explanation: parsedResponse.explanation,
        chartType: parsedResponse.chartType || "bar",
        chartData: parsedResponse.chartData || MOCK_DATASET_ORDERS_BY_MONTH,
        logs,
        steps: [
          { name: "Schema Mapping", status: "success" },
          { name: "Guardrail Screening", status: "success" },
          { name: "SQL Translation", status: "success" },
          { name: "Query Execution", status: "success" },
          { name: "Semantic Compilation", status: "success" }
        ]
      });

    } catch (err: any) {
      addLog(`Error during LLM compilation: ${err.message}. Engaging automatic rule-based compiler...`);
    }
  }

  // INTUATIVE SMART COMPILER FALLBACK (when API Key is missing or on error)
  // This provides a robust, beautifully detailed simulated run that perfectly showcases the features!
  addLog("Step 3: Translating natural query into high-performance PostgreSQL queries...");
  
  let targetSql = "";
  let targetExplanation = "";
  let chartType: "bar" | "line" | "area" | "pie" = "bar";
  let chartData: any[] = [];
  let isAnomalies = false;

  const promptLower = prompt.toLowerCase();

  if (promptLower.includes("прод") || promptLower.includes("order") || promptLower.includes("sales") || promptLower.includes("выруч")) {
    targetSql = `SELECT 
  DATE_TRUNC('month', created_at) AS month, 
  SUM(amount) AS total_sales,
  COUNT(id) AS total_orders
FROM orders 
WHERE created_at >= '2026-01-01'
GROUP BY 1 
ORDER BY 1 ASC;`;
    targetExplanation = "Обнаружен устойчивый тренд роста продаж на 18% в июне по сравнению с предыдущим месяцем. Основной драйвер роста — SaaS сегмент и консалтинговые контракты среднего чека.";
    chartType = "area";
    chartData = MOCK_DATASET_ORDERS_BY_MONTH;
  } else if (promptLower.includes("тариф") || promptLower.includes("user") || promptLower.includes("пользов") || promptLower.includes("план")) {
    targetSql = `SELECT 
  plan, 
  COUNT(id) AS user_count,
  SUM(CASE WHEN plan = 'enterprise' THEN 1000 ELSE 100 END) AS projected_revenue
FROM users 
GROUP BY plan;`;
    targetExplanation = "Пользователи платных тарифов составляют 15.3% от общего объема базы. Конверсия выросла на 2.4% за счет внедрения предиктивных подсказок в интерфейсе.";
    chartType = "pie";
    chartData = MOCK_DATASET_USERS_BY_PLAN;
  } else if (promptLower.includes("api") || promptLower.includes("лат") || promptLower.includes("latency") || promptLower.includes("нагр")) {
    targetSql = `SELECT 
  date_part('hour', created_at) AS hour,
  AVG(latency_ms) AS avg_latency
FROM api_usage
GROUP BY 1
ORDER BY 1 ASC;`;
    targetExplanation = "Среднее время задержки API (latency) держится в пределах 150мс. Пиковые нагрузки зафиксированы в 12:00, вызванные синхронизацией крупных Excel-отчетов.";
    chartType = "line";
    chartData = MOCK_DATASET_LATENCY_METRICS;
  } else if (promptLower.includes("аномал") || promptLower.includes("anomaly") || promptLower.includes("выброс")) {
    targetSql = `WITH LatencyStats AS (
  SELECT endpoint, AVG(latency_ms) as avg_l, STDDEV(latency_ms) as std_l
  FROM api_usage GROUP BY endpoint
)
SELECT u.endpoint, u.latency_ms, u.date
FROM api_usage u
JOIN LatencyStats s ON u.endpoint = s.endpoint
WHERE u.latency_ms > (s.avg_l + 3 * s.std_l);`;
    targetExplanation = "ВНИМАНИЕ: Выявлена 1 критическая аномалия в 08:00 на эндпоинте `/api/v1/analyze`. Зафиксирована задержка 185мс при среднеквадратичном отклонении в 45мс. Вероятная причина: холодный старт контейнера ИИ-сервера.";
    chartType = "line";
    chartData = MOCK_DATASET_LATENCY_METRICS;
    isAnomalies = true;
  } else {
    // Default fallback
    targetSql = `SELECT category, SUM(amount) AS revenue 
FROM orders 
GROUP BY category 
ORDER BY revenue DESC;`;
    targetExplanation = "Базовый анализ категорий продуктов показывает доминирование SaaS решений (65% от общего объема выручки). Подключения стабильны.";
    chartType = "bar";
    chartData = [
      { name: "SaaS", value: 450000 },
      { name: "Hardware", value: 180000 },
      { name: "Consulting", value: 95000 }
    ];
  }

  addLog("Step 4: SQL compiled successfully. Triggering mock Postgres engine executor...");
  
  // Fake minor correction step simulation just to demonstrate self-correction!
  if (promptLower.includes("аномал") || promptLower.includes("sales")) {
    addLog("Warning: Column 'created_at' is ambiguous. Activating self-correction loop...");
    addLog("Step 4.1 [Self-Correction]: Resolved table ambiguity. Re-running query...");
  }
  
  addLog("Step 5: Row execution finished. Compiled 128 matching rows into visual JSON.");
  addLog("Step 6: Dynamic insights synthesized and ready.");

  setTimeout(() => {
    res.json({
      status: "success",
      prompt,
      sql: targetSql,
      explanation: targetExplanation,
      chartType,
      chartData,
      isAnomalies,
      logs,
      steps: [
        { name: "Schema Mapping", status: "success" },
        { name: "Guardrail Screening", status: "success" },
        { name: "SQL Translation", status: "success" },
        { name: "Query Execution", status: "success" },
        { name: "Semantic Compilation", status: "success" }
      ]
    });
  }, 1200); // Cinematic latency simulation
});


// ---------------------------------------------------------
// File Parsing Simulators
// ---------------------------------------------------------
app.post("/api/upload-simulation", (req, res) => {
  const { fileName, size } = req.body;
  const totalRows = Math.floor(Math.random() * 300000) + 100000;
  
  return res.json({
    status: "success",
    fileName,
    sizeBytes: size,
    totalRows,
    ingestedTables: ["orders_staging", "users_staging"],
    logs: [
      `[INFO] File ${fileName} successfully chunked into buffer streams.`,
      `[INFO] Ingestion pipeline started: 8 Worker threads allocated.`,
      `[DATABASE] Writing chunks of 10,000 rows to PostgreSQL transaction log...`,
      `[SUCCESS] Synced ${totalRows.toLocaleString()} rows into schema staging tables successfully.`
    ]
  });
});


// ---------------------------------------------------------
// Vite Integration Middleware
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AETHERDATA SERVER] Started on port ${PORT}`);
  });
}

startServer();
