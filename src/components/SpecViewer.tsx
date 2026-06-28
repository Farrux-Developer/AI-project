import { useState } from "react";
import { BookOpen, Code, Palette, Zap, Cpu, Database, Calendar, Terminal } from "lucide-react";

export default function SpecViewer() {
  const [activeTab, setActiveTab] = useState<"design" | "animations" | "backend" | "database" | "milestones">("design");

  const tabs = [
    { id: "design", label: "01. Дизайн & Стили", icon: Palette },
    { id: "animations", label: "02. Анимации", icon: Zap },
    { id: "backend", label: "03. ИИ-Пайплайны", icon: Cpu },
    { id: "database", label: "04. Схема БД", icon: Database },
    { id: "milestones", label: "05. Спринт План", icon: Calendar },
  ];

  return (
    <div className="border border-white/5 bg-slate-950/40 rounded-2xl p-6 relative h-full flex flex-col justify-between" id="spec-viewer-container">
      {/* Absolute background details */}
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-600 select-none">
        AETHER_PRD_V1.1_SECURE
      </div>

      <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
        <BookOpen className="w-5 h-5 text-blue-500" />
        <div>
          <h2 className="text-sm font-mono tracking-widest text-slate-200 uppercase">
            ТЕХНИЧЕСКАЯ СПЕЦИФИКАЦИЯ (PRD) & АРХИТЕКТУРА
          </h2>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            AetherData AI — Enterprise-grade Intelligent Analytical Platform
          </p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "bg-slate-900/40 border border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Document Content Display */}
      <div className="flex-grow min-h-[400px] text-slate-300 overflow-y-auto max-h-[500px] pr-2 space-y-5 leading-relaxed text-xs">
        {/* ---------------------------------------------------------
            TAB 1: DESIGN SYSTEM
           --------------------------------------------------------- */}
        {activeTab === "design" && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-white flex items-center gap-2">
              <span className="text-blue-500">1.</span> КОНЦЕПЦИЯ ДИЗАЙНА (HIGH-END TECH AESTHETIC)
            </h3>
            <p className="text-slate-400">
              Визуальный язык AetherData AI базируется на философии <strong>"Hyper-realistic Cyberpunk / Premium SaaS"</strong>. Интерфейс полностью уходит от плоского (Flat) минимализма в сторону глубокого интерактивного пространства с физическими свойствами материалов.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 font-mono text-[10px]">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30">
                <span className="text-blue-400 font-bold block mb-1">ЦВЕТОВАЯ ПАЛИТРА:</span>
                <ul className="space-y-1 text-slate-400">
                  <li>• Фон: Глубокий графитовый / иссиня-черный (#030712)</li>
                  <li>• Grid Lines: Тончайшие линии цвета свинца (#1e293b)</li>
                  <li>• Neon Blue: Кибер-синий (#3b82f6) для системной аналитики</li>
                  <li>• Neon Emerald: Изумрудный (#10b981) для подтверждения транзакций</li>
                  <li>• Neon Purple: Фиолетовый (#8b5cf6) для ИИ агента</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30">
                <span className="text-emerald-400 font-bold block mb-1">ЭФФЕКТЫ МАТЕРИАЛОВ:</span>
                <ul className="space-y-1 text-slate-400">
                  <li>• Glassmorphism: Backdrop-blur (12px-24px) на панелях</li>
                  <li>• Glowing Borders: Границы с полупрозрачными свечениями</li>
                  <li>• Cyber Grid Background: Наложение векторов разметки</li>
                  <li>• Depth Shadows: Тройные составные размытые тени</li>
                </ul>
              </div>
            </div>

            <h4 className="font-mono text-white text-xs mt-3">АДАПТИВНАЯ КАСУТОМИЗИРУЕМАЯ СЕТКА DASHBOARD (DRAG-AND-DROP):</h4>
            <p className="text-slate-400">
              Дашборд реализуется на основе динамической системы сеток (CSS Grid / React Grid Layout). Контейнеры виджетов оборачиваются в интерактивные обертки с поддержкой HTML5 Drag-and-Drop и тач-жестов. Размеры элементов рассчитываются адаптивно по колонкам (от 1 до 12), предотвращая перекрытие графиков при смене позиций.
            </p>

            <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-950/5 font-mono text-[10px] space-y-1">
              <span className="text-blue-400 font-bold block">Пример конфигурации Tailwind CSS:</span>
              <pre className="text-slate-500 overflow-x-auto p-2 bg-black/40 rounded">
{`/* Grid Container */
.cyber-grid-layout {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.5rem;
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------
            TAB 2: MEGA-ANIMATIONS & INTERACTIVE
           --------------------------------------------------------- */}
        {activeTab === "animations" && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-white flex items-center gap-2">
              <span className="text-blue-500">2.</span> МЕГА-АНИМАЦИИ & МИКРО-ВЗАИМОДЕЙСТВИЯ (60 FPS)
            </h3>
            <p className="text-slate-400">
              Анимации платформы служат не украшением, а функциональным отражением системных состояний, задействуя физику упругости (Spring physics).
            </p>

            <div className="space-y-4 mt-2">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20">
                <h4 className="font-mono text-xs text-purple-400 mb-1">1. "THE CORE" (3D-ЯДРО ИИ):</h4>
                <p className="text-slate-400">
                  Центральный шейдерный объект на холсте HTML5 Canvas / R3F. Пульсирует по синусоидальной траектории, деформируется при нагрузке и меняет цветовую гамму в реальном времени в соответствии со статусом ИИ (Готов, Обработка, Ошибка).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20">
                <h4 className="font-mono text-xs text-blue-400 mb-1">2. "DATA PIPELINE FLOW" (ПОТОК ЧАСТИЦ):</h4>
                <p className="text-slate-400">
                  При перетаскивании Excel/CSV файлов запускается динамический рендеринг летящих частиц (Vector Fields). Каждая частица представляет собой батч строк, летящих по изогнутым кривым Безье из левой зоны загрузки в СУБД ноды справа.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20">
                <h4 className="font-mono text-xs text-emerald-400 mb-1">3. "SKELETAL METAMORPHOSIS":</h4>
                <p className="text-slate-400">
                  Абсолютное бесшовное превращение (Morphing). Вместо стандартного мигания, серые мерцающие скелетоны графиков плавно удлиняются вверх и перетекают в цветные SVG пути/столбцы диаграмм при поступлении ответа из сети.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/20">
                <h4 className="font-mono text-xs text-pink-400 mb-1">4. "TEXT-TO-CHART EVOLUTION":</h4>
                <p className="text-slate-400">
                  Анимация разворачивания графиков при генерации ответов. Компоненты диаграмм "вырастают" снизу вверх с использованием упругих физических расчетов Framer Motion:
                </p>
                <pre className="text-[10px] text-slate-500 bg-black/40 p-2 rounded mt-2 overflow-x-auto font-mono">
{`// Framer Motion Spring Config
const chartSpring = {
  type: "spring",
  stiffness: 80,
  damping: 15,
  mass: 1
};`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------
            TAB 3: BACKEND & AI PIPELINE
           --------------------------------------------------------- */}
        {activeTab === "backend" && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-white flex items-center gap-2">
              <span className="text-blue-500">3.</span> СЛОЖНАЯ БЭКЕНД-ЛОГИКА И AI PIPELINE
            </h3>
            <p className="text-slate-400">
              Архитектура обработки запросов на естественном языке с преобразованием в валидный PostgreSQL SQL диалект строится по агентскому принципу.
            </p>

            <div className="p-4 rounded-xl border border-purple-500/10 bg-purple-950/5 space-y-3">
              <h4 className="font-mono text-xs text-purple-400">АРХИТЕКТУРА ИИ АГЕНТА (TEXT-TO-SQL LOOP):</h4>
              <div className="space-y-2 text-slate-400">
                <p><strong>Шаг 1: Снятие схемы (Metadata Extract).</strong> Извлечение активных DDL таблиц, типов колонок и связей внешних ключей PostgreSQL.</p>
                <p><strong>Шаг 2: SQL Injection Guardrails.</strong> Промпт проходит пре-фильтрацию регулярными выражениями и классификацией LLM на предмет наличия деструктивных команд (DROP, TRUNCATE, UPDATE без WHERE).</p>
                <p><strong>Шаг 3: SQL Generation.</strong> Формирование SQL-запроса через нейросеть Gemini 3.5 / Claude 3.5 Sonnet.</p>
                <p><strong>Шаг 4: Self-Correction Loop.</strong> Бэкенд выполняет сгенерированный SQL в транзакции EXPLAIN (без фактической записи). Если БД выдает ошибку синтаксиса, бэкенд формирует повторный запрос к LLM, передавая текст ошибки.</p>
              </div>
            </div>

            <h4 className="font-mono text-white text-xs mt-3">СЕМАНТИЧЕСКОЕ КЭШИРОВАНИЕ (REDIS SEMANTIC CACHE):</h4>
            <p className="text-slate-400">
              Для экономии токенов и ускорения загрузки, запросы пользователей векторизуются через `gemini-embedding-2-preview` и сохраняются в Redis (или pgvector). При новом запросе рассчитывается косинусное расстояние: если схожесть &gt; 96%, система мгновенно отдает кэшированный JSON-ответ без обращения к LLM.
            </p>

            <h4 className="font-mono text-white text-xs mt-3 font-semibold">ВЫСОКОНАГРУЖЕННЫЙ CSV/EXCEL ПАРСИНГ (BULLMQ WORKERS):</h4>
            <p className="text-slate-400">
              Файлы до 500 тыс. строк не загружаются в память целиком. Бэкенд реализует парсинг стримами чанками (chunks) по 10,000 строк. Очереди контролируются через BullMQ (Redis-backed), фоновые воркеры (Worker Threads) импортируют пачки строк в СУБД PostgreSQL через `Prisma.createMany` в рамках транзакций.
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------
            TAB 4: DATABASE SCHEMA
           --------------------------------------------------------- */}
        {activeTab === "database" && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-white flex items-center gap-2">
              <span className="text-blue-500">4.</span> ПРОЕКТИРОВАНИЕ РЕЛЯЦИОННОЙ БАЗЫ ДАННЫХ
            </h3>
            <p className="text-slate-400">
              Архитектура структуры таблиц СУБД PostgreSQL, оптимизированная для ведения истории аналитики и контекстного понимания ИИ-агентом.
            </p>

            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30">
              <span className="text-blue-400 font-bold block mb-2 font-mono text-[10px]">PRISMA SCHEMA DESIGN:</span>
              <pre className="text-[10px] text-slate-500 bg-black/60 p-3 rounded overflow-x-auto font-mono leading-relaxed max-h-72">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id          String   @id @default(uuid())
  name        String
  createdAt   DateTime @default(now())
  users       User[]
  dataSources DataSource[]
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  passwordHash   String
  role           String       @default("member")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  queries        QueryHistory[]
}

model DataSource {
  id             String       @id @default(uuid())
  name           String
  type           String       // "postgresql" | "clickhouse" | "csv"
  connectionUrl  String       // Encrypted string
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}

model QueryHistory {
  id             String       @id @default(uuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  naturalPrompt  String
  generatedSql   String
  executionTimeMs Int
  status         String       // "success" | "failed" | "blocked"
  createdAt      DateTime     @default(now())

  @@index([userId, createdAt(sort: Desc)])
}`}
              </pre>
            </div>

            <h4 className="font-mono text-white text-xs mt-3">ИНДЕКСЫ И КЛЮЧЕВЫЕ ОПТИМИЗАЦИИ:</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>1. Composite Index на `QueryHistory(userId, createdAt DESC)` — обеспечивает моментальный вывод истории запросов пользователя без полного сканирования таблицы.</li>
              <li>2. Полнотекстовый индекс (GIN) на поле `naturalPrompt` — для быстрого поиска и фильтрации старых запросов по ключевым словам.</li>
              <li>3. Шифрование на уровне приложения (AES-256-GCM) для `connectionUrl` в DataSource для безопасности учетных записей баз данных клиентов.</li>
            </ul>
          </div>
        )}

        {/* ---------------------------------------------------------
            TAB 5: MILESTONES & ROADMAP
           --------------------------------------------------------- */}
        {activeTab === "milestones" && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-white flex items-center gap-2">
              <span className="text-blue-500">5.</span> ПОШАГОВЫЙ ПЛАН РАЗРАБОТКИ (ROADMAP)
            </h3>
            <p className="text-slate-400">
              Пошаговый план реализации платформы со сроком выполнения 4 Спринта (1 месяц непрерывной разработки).
            </p>

            <div className="space-y-4 font-mono text-xs text-slate-400 mt-2">
              <div className="p-3.5 border-l-2 border-blue-500 bg-blue-950/5 rounded-r-xl">
                <span className="text-blue-400 font-bold block">СПРИНТ 1: ИНФРАСТРУКТУРА, БД И ПАРСИНГ ФАЙЛОВ</span>
                <p className="text-[11px] mt-1 text-slate-500">
                  Развертывание инстансов СУБД Postgres и Redis. Настройка Prisma ORM. Реализация авторизации JWT. Создание многопоточного стриминг-пайплайна для парсинга Excel/CSV файлов.
                </p>
              </div>

              <div className="p-3.5 border-l-2 border-purple-500 bg-purple-950/5 rounded-r-xl">
                <span className="text-purple-400 font-bold block">СПРИНТ 2: ИНТЕГРАЦИЯ LLM И АГЕНТСКИЙ ТЕКСТ-TO-SQL ЛУП</span>
                <p className="text-[11px] mt-1 text-slate-500">
                  Интеграция Gemini 3.5 / Claude API. Разработка цепочки валидации промптов на безопасность. Внедрение Self-Correction Loop для автоматического исправления SQL синтаксиса при ошибках компиляции. Семантический кэш в Redis.
                </p>
              </div>

              <div className="p-3.5 border-l-2 border-emerald-500 bg-emerald-950/5 rounded-r-xl">
                <span className="text-emerald-400 font-bold block">СПРИНТ 3: ФРОНТЕНД, ИНТЕРАКТИВНОЕ ЯДРО & МЕГА-АНИМАЦИИ</span>
                <p className="text-[11px] mt-1 text-slate-500">
                  Сборка интерфейса на Next.js App Router. Реализация 3D ядра Core с помощью WebGL/Three.js. Разработка Canvas анимации потока летящих частиц (Pipeline Flow). Верстка SVG-графиков с упругой анимацией увядания и Skeletal Metamorphosis.
                </p>
              </div>

              <div className="p-3.5 border-l-2 border-pink-500 bg-pink-950/5 rounded-r-xl">
                <span className="text-pink-400 font-bold block">СПРИНТ 4: ПРЕДИКТИВНЫЕ ИИ-АГЕНТЫ, ОПТИМИЗАЦИЯ И ДЕПЛОЙ</span>
                <p className="text-[11px] mt-1 text-slate-500">
                  Внедрение модуля ИИ-выявления аномалий и выбросов в данных. Профилирование FPS (удержание стабильных 60 FPS при интенсивном рендеринге). Деплой в Docker контейнеры на AWS ECS / Vercel. Тестирование под нагрузкой.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action panel bottom */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>AETHERDATA DESIGN SYSTEM v1.0</span>
        <span className="text-slate-400">ARCHITECTURE STACK: VERIFIED</span>
      </div>
    </div>
  );
}
