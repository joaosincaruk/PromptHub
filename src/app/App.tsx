import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Tag,
  Search,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  Eye,
  Brain,
  Filter,
  BarChart2,
  Users,
  Layers,
  Wrench,
  Zap,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────────────────────────
const TOOLS = ["ChatGPT", "Claude", "Gemini", "Copilot", "Other"] as const;
const OBJECTIVES = [
  "Creating ads",
  "Generating code",
  "Summarizing texts",
  "Producing articles",
  "Creating scripts",
  "Analyzing documents",
] as const;
const LEVELS = ["Basic", "Intermediate", "Advanced"] as const;

type Tool = (typeof TOOLS)[number];
type Objective = (typeof OBJECTIVES)[number];
type Level = (typeof LEVELS)[number];
type View = "dashboard" | "prompts" | "categories" | "search";

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Prompt {
  id: string;
  title: string;
  categoryId: string;
  objective: Objective;
  tool: Tool;
  level: Level;
  content: string;
  author: string;
  createdAt: string;
  notes: string;
}

// ── Seed Data ──────────────────────────────────────────────────────────────────
const SEED_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Marketing", description: "Prompts for content creation, ads, SEO, and brand communication.", createdAt: "2024-01-10" },
  { id: "cat-2", name: "Sales", description: "Prompts for outreach, objection handling, and pipeline acceleration.", createdAt: "2024-01-10" },
  { id: "cat-3", name: "Customer Service", description: "Prompts for support scripts, FAQ generation, and complaint resolution.", createdAt: "2024-01-11" },
  { id: "cat-4", name: "Human Resources", description: "Prompts for hiring, performance reviews, and onboarding documentation.", createdAt: "2024-01-11" },
  { id: "cat-5", name: "Development", description: "Prompts for code generation, debugging, documentation, and architecture.", createdAt: "2024-01-12" },
  { id: "cat-6", name: "Design", description: "Prompts for UX research, brand identity, and creative briefs.", createdAt: "2024-01-12" },
  { id: "cat-7", name: "Legal", description: "Prompts for contract analysis, policy drafting, and compliance reviews.", createdAt: "2024-01-13" },
  { id: "cat-8", name: "Finance", description: "Prompts for report analysis, budget planning, and financial modeling.", createdAt: "2024-01-13" },
];

const SEED_PROMPTS: Prompt[] = [
  {
    id: "p-001", title: "Facebook Ad Copy for SaaS Product", categoryId: "cat-1",
    objective: "Creating ads", tool: "ChatGPT", level: "Intermediate",
    content: `You are an expert digital marketer specializing in SaaS advertising. Write 3 variations of Facebook ad copy for [PRODUCT NAME] that delivers [CORE VALUE PROPOSITION].

For each variation include:
- Hook: first line that stops the scroll (max 40 chars)
- Body copy: 2-3 sentences highlighting pain points and solution
- CTA: clear call to action

Target audience: [TARGET AUDIENCE DESCRIPTION]
Tone: Professional yet conversational
Character limit per ad: 125 characters for primary text

Output each variation clearly labeled as Variation A, B, and C.`,
    author: "Ana Lima", createdAt: "2024-02-15",
    notes: "Replace all bracketed placeholders before use. A/B test all 3 variations for 7 days minimum.",
  },
  {
    id: "p-002", title: "Cold Email Outreach Sequence (4-Email)", categoryId: "cat-2",
    objective: "Producing articles", tool: "Claude", level: "Basic",
    content: `Write a 4-email cold outreach sequence for a B2B sales campaign selling [PRODUCT/SERVICE] to [TARGET ROLE] at [COMPANY TYPE].

Email 1 (Day 1): Problem-aware introduction — no pitch, establish credibility
Email 2 (Day 3): Relevant case study or social proof from a similar company
Email 3 (Day 7): Direct value proposition with a single clear CTA
Email 4 (Day 12): Break-up email with a final low-friction offer

Rules:
- Keep each email under 150 words
- Use natural, human language — avoid buzzwords
- Subject lines must be under 50 characters
- Personalization tokens: {{first_name}}, {{company_name}}, {{industry}}`,
    author: "Carlos Mendes", createdAt: "2024-02-18",
    notes: "Best performing sequence for SaaS and consulting firms. Review with legal before sending at scale.",
  },
  {
    id: "p-003", title: "Customer Complaint Resolution Script", categoryId: "cat-3",
    objective: "Creating scripts", tool: "ChatGPT", level: "Basic",
    content: `You are a senior customer success agent. Write a response script for handling the following customer complaint:

[PASTE COMPLAINT HERE]

The response must:
1. Acknowledge the frustration without admitting legal fault
2. Empathize genuinely with the customer's experience
3. Clearly explain what happened (if known)
4. Provide a concrete resolution with a specific timeline
5. Offer a goodwill gesture appropriate to severity

Tone: Warm, professional, solution-focused
Format: Email response
Length: 150–200 words`,
    author: "Fernanda Costa", createdAt: "2024-02-20",
    notes: "Reviewed by legal team Q1 2024. Approved for customer-facing use across all channels.",
  },
  {
    id: "p-004", title: "Job Description Generator", categoryId: "cat-4",
    objective: "Producing articles", tool: "ChatGPT", level: "Basic",
    content: `Create a compelling job description for a [JOB TITLE] role at [COMPANY NAME], a [COMPANY TYPE/STAGE] company.

Include these sections:
- Role summary (2–3 sentences)
- Key responsibilities (5–7 bullet points, action-verb led)
- Required qualifications (hard requirements only — no padding)
- Preferred qualifications (nice-to-haves, clearly marked)
- What we offer: benefits, perks, and growth opportunities
- Diversity & inclusion closing statement

Rules:
- Avoid gendered language throughout
- Do not use "X+ years of experience" without a clear justification
- Target length: 400–600 words`,
    author: "Rodrigo Alves", createdAt: "2024-02-22",
    notes: "Compliance team must review before publishing to external job boards.",
  },
  {
    id: "p-005", title: "React Component Code Generator", categoryId: "cat-5",
    objective: "Generating code", tool: "Claude", level: "Advanced",
    content: `You are a senior React engineer. Generate a fully typed TypeScript React component for the following specification:

Component name: [COMPONENT_NAME]
Purpose: [DESCRIPTION]
Props: [LIST PROPS WITH TYPES AND DESCRIPTIONS]
State and behavior: [INTERACTIONS, TRANSITIONS, EDGE CASES]
Styling approach: Tailwind CSS
Accessibility target: WCAG 2.1 AA

Requirements:
- Functional component using hooks only
- Complete TypeScript interfaces for all props
- JSDoc comments on all public props
- Handle loading, error, and empty states explicitly
- Named export AND default export

Include a usage example at the bottom in a comment block.`,
    author: "Paulo Rodrigues", createdAt: "2024-03-01",
    notes: "Works best with Claude 3.5 Sonnet for complex multi-state components.",
  },
  {
    id: "p-006", title: "SQL Query Performance Optimizer", categoryId: "cat-5",
    objective: "Generating code", tool: "ChatGPT", level: "Advanced",
    content: `You are a database performance expert. Analyze and optimize the following SQL query:

[PASTE QUERY HERE]

Database engine: [PostgreSQL / MySQL / SQL Server / BigQuery]
Table sizes: [APPROXIMATE ROW COUNTS FOR EACH TABLE]
Current avg execution time: [TIME IN MS]

Provide in order:
1. Plain-English analysis of bottlenecks
2. Optimized query with inline comments
3. Recommended index definitions with CREATE INDEX statements
4. Estimated performance improvement range
5. Schema changes that would further improve performance`,
    author: "Paulo Rodrigues", createdAt: "2024-03-05",
    notes: "Always test index changes on staging with EXPLAIN ANALYZE before applying to production.",
  },
  {
    id: "p-007", title: "Brand Identity Brief Creator", categoryId: "cat-6",
    objective: "Producing articles", tool: "Gemini", level: "Intermediate",
    content: `You are a brand strategist at a top-tier creative agency. Create a comprehensive brand identity brief for [BRAND NAME], a [INDUSTRY] company targeting [TARGET AUDIENCE SEGMENT].

Deliver the following sections:
1. Brand personality: 5 defining adjectives with explanations
2. Brand voice & tone: dos and don'ts with channel examples
3. Color palette rationale: primary, secondary, accent with hex codes
4. Typography recommendations with usage rules
5. Visual style direction: photography, illustration, iconography
6. Competitor differentiation

Format as a professional brand document for design team handoff.`,
    author: "Isabela Nunes", createdAt: "2024-03-08",
    notes: "Gemini 1.5 Pro gives the most thorough outputs. Attach competitor screenshots for better differentiation.",
  },
  {
    id: "p-008", title: "Contract Clause Risk Analyzer", categoryId: "cat-7",
    objective: "Analyzing documents", tool: "Claude", level: "Advanced",
    content: `You are an experienced corporate attorney. Conduct a structured legal risk assessment of the following contract clause:

[PASTE CLAUSE TEXT HERE]

Context:
- Contract type: [NDA / SERVICE AGREEMENT / EMPLOYMENT / MSA]
- Our party: [CLIENT / VENDOR / EMPLOYER / EMPLOYEE]
- Jurisdiction: [COUNTRY / STATE]

For this clause, provide:
1. Plain-English summary of what the clause means
2. Risk assessment: Low / Medium / High with rationale
3. Missing protections to negotiate for
4. Suggested alternative language (redlined version)
5. Red flags requiring senior legal review

Note: Output is for internal review only, not formal legal advice.`,
    author: "Mariana Souza", createdAt: "2024-03-10",
    notes: "Always have qualified counsel review AI outputs before acting on any legal recommendation.",
  },
  {
    id: "p-009", title: "Budget Variance Report Summarizer", categoryId: "cat-8",
    objective: "Summarizing texts", tool: "Gemini", level: "Intermediate",
    content: `You are a CFO's executive assistant. Analyze the following budget variance data and produce a board-ready summary:

[PASTE VARIANCE TABLE OR EXPORTED DATA HERE]

Period: [MONTH / QUARTER] [YEAR]
Department: [DEPARTMENT OR COST CENTER]

Deliver:
- 3-sentence executive summary (no jargon)
- Top 3 favorable variances: amount, percentage, root cause
- Top 3 unfavorable variances: amount, percentage, root cause
- Recommended corrective actions
- Forward-looking risk flags for next period

Format: Professional memo style. Numbers rounded to nearest thousand.`,
    author: "Gustavo Ferreira", createdAt: "2024-03-12",
    notes: "Validated with Finance team Q1 2024. Accuracy rate >90% vs manual review.",
  },
  {
    id: "p-010", title: "Instagram Caption Generator (5 Variations)", categoryId: "cat-1",
    objective: "Creating ads", tool: "ChatGPT", level: "Basic",
    content: `Write 5 Instagram captions for [BRAND NAME] promoting [PRODUCT / SERVICE / CAMPAIGN].

Brand voice: [DESCRIBE TONE]
Target audience: [AUDIENCE SEGMENT]
Campaign goal: [AWARENESS / ENGAGEMENT / CONVERSION]
Post visual: [DESCRIBE THE IMAGE OR VIDEO]

For each caption:
- Hook visible before "more" (~125 chars)
- Clear CTA appropriate to goal
- 8–12 relevant hashtags (broad, niche, branded)
- Vary: one short, two medium, two long-form

Avoid: "Excited to announce," "Thrilled to share," "Game-changer."`,
    author: "Ana Lima", createdAt: "2024-03-14",
    notes: "Cross-reference with brand hashtag library before scheduling.",
  },
  {
    id: "p-011", title: "Sales Objection Handling Script", categoryId: "cat-2",
    objective: "Creating scripts", tool: "Claude", level: "Intermediate",
    content: `You are an expert sales coach with a consultative selling methodology. Write a complete objection handling script for:

Objection received: [PASTE THE EXACT OBJECTION]
Product/Service: [NAME AND BRIEF DESCRIPTION]
Price point: [PRICE + BILLING MODEL]
Deal stage: [DISCOVERY / DEMO / PROPOSAL / CLOSING]

For this objection produce:
1. Acknowledge + validate (never dismiss or argue)
2. Clarifying question to uncover the true concern
3. Reframe using value-based language (ROI, risk reduction)
4. Social proof from a similar customer
5. Soft close to move forward

Also provide: 2 alternative approaches if first script fails.`,
    author: "Carlos Mendes", createdAt: "2024-03-15",
    notes: "Top 10 objections documented in Sales Playbook v3. Update after each QBR.",
  },
  {
    id: "p-012", title: "Product FAQ Page Generator", categoryId: "cat-3",
    objective: "Producing articles", tool: "ChatGPT", level: "Basic",
    content: `You are a product documentation specialist. Generate a comprehensive FAQ page for [PRODUCT NAME].

Context:
- Product description: [BRIEF DESCRIPTION]
- Primary users: [USER PERSONA]
- Top support issues: [LIST 3–5 KNOWN PAIN POINTS]

Create 15–20 FAQ entries covering:
- Getting started and onboarding (3–4 entries)
- Core features and how-tos (4–5 entries)
- Billing and account management (3 entries)
- Troubleshooting common errors (3–4 entries)
- Integrations and compatibility (2 entries)
- Data privacy and security (2 entries)

Format: **Q:** [Question] / A: [2–3 sentence answer]`,
    author: "Fernanda Costa", createdAt: "2024-03-18",
    notes: "Template approved by Support Lead. Audit and update quarterly.",
  },
  {
    id: "p-013", title: "Annual Performance Review Writer", categoryId: "cat-4",
    objective: "Producing articles", tool: "Claude", level: "Intermediate",
    content: `You are an experienced HR business partner. Write a structured annual performance review:

Employee: [FULL NAME], [JOB TITLE]
Department: [DEPARTMENT]
Review period: [START DATE] – [END DATE]
Performance rating: [1–5 scale]

Inputs:
- Achievements: [LIST 3–5 WITH BUSINESS IMPACT]
- Development areas: [LIST 2–3 SPECIFIC AREAS]
- Manager's notes: [FREE TEXT]

Output sections:
1. Executive summary (2 sentences)
2. Achievement analysis with quantified business impact
3. Development areas with actionable improvement plans
4. SMART goals for next review period (3–4 goals)
5. Rating justification

Tone: Constructive, fair, evidence-based.`,
    author: "Rodrigo Alves", createdAt: "2024-03-20",
    notes: "Requires HR Director review before delivery to employee.",
  },
  {
    id: "p-014", title: "API Documentation Generator (OpenAPI 3.0)", categoryId: "cat-5",
    objective: "Generating code", tool: "Copilot", level: "Advanced",
    content: `Generate complete OpenAPI 3.0 YAML documentation for the following API endpoint:

Endpoint: [HTTP METHOD] [PATH]
Description: [WHAT IT DOES AND WHY IT EXISTS]
Authentication: [Bearer token / API key / OAuth 2.0]
Request body schema: [PASTE JSON SCHEMA OR EXAMPLE]
Expected response codes: 200, 400, 401, 403, 404, 422, 500

Requirements:
- Full OpenAPI 3.0 schema for request and all response bodies
- Inline descriptions for every field
- Error response formats for each non-2xx code
- Code examples in: curl, JavaScript (fetch), Python (requests)
- Security scheme reference

Output as valid YAML inside a code block.`,
    author: "Paulo Rodrigues", createdAt: "2024-03-22",
    notes: "Use with GitHub Copilot Chat in VS Code @workspace context. Validate YAML with Spectral.",
  },
  {
    id: "p-015", title: "Landing Page Full Copy Framework", categoryId: "cat-1",
    objective: "Creating ads", tool: "ChatGPT", level: "Intermediate",
    content: `You are a conversion copywriter. Write complete landing page copy for [PRODUCT NAME].

Inputs:
- Target audience: [PERSONA]
- Primary value proposition: [CORE PROMISE]
- Main pain point solved: [SPECIFIC PROBLEM]
- Key differentiator: [WHY DIFFERENT FROM COMPETITION]
- Primary conversion goal: [DEMO / FREE TRIAL / PURCHASE]

Write all 8 sections:
1. Hero: Headline + subheadline + CTA button text
2. Problem statement: 3 pain points with empathetic framing
3. Solution bridge: 2–3 sentences
4. Feature/benefit breakdown: 3–4 features as customer outcomes
5. Social proof: testimonial pull-quotes + logo bar copy
6. Pricing teaser + secondary CTA
7. FAQ: 5 objection-handling Q&As
8. Final CTA section with urgency

Readability target: Flesch-Kincaid score above 60.`,
    author: "Ana Lima", createdAt: "2024-03-25",
    notes: "Run through Hemingway Editor before handing to design team.",
  },
  {
    id: "p-016", title: "Competitive Analysis Executive Briefing", categoryId: "cat-2",
    objective: "Analyzing documents", tool: "Gemini", level: "Advanced",
    content: `You are a senior strategy analyst. Conduct a structured competitive analysis:

Our product: [PRODUCT NAME + DESCRIPTION]
Competitors: [LIST 3–5 COMPETITOR NAMES]
Market segment: [SEGMENT AND GEOGRAPHY]

Paste raw collected data (pricing pages, G2 reviews, press releases):
[PASTE DATA HERE]

Deliverables:
1. Feature comparison matrix (table format)
2. Pricing strategy analysis: positioning and packaging patterns
3. Positioning map: identify white space (2x2 with labeled axes)
4. SWOT analysis for the top 2 competitors
5. Our recommended positioning (3 strategic options with tradeoffs)
6. Three tactical recommendations for next 90 days

Format as a board-ready executive briefing.`,
    author: "Carlos Mendes", createdAt: "2024-03-28",
    notes: "Refresh quarterly. Pair with Crayon or Klue data exports for richer inputs.",
  },
  {
    id: "p-017", title: "UX Research Interview Script", categoryId: "cat-6",
    objective: "Creating scripts", tool: "Claude", level: "Intermediate",
    content: `You are a senior UX researcher. Create a structured moderated user interview script:

Research topic: [TOPIC OR PROBLEM AREA]
Participant segment: [WHO WE ARE INTERVIEWING]
Session length: [30 / 45 / 60] minutes
Research goals:
  1. [GOAL 1]
  2. [GOAL 2]
  3. [GOAL 3]

Script sections:
- Introduction + consent (5 min)
- Warm-up questions (5 min)
- Core research themes (organized by goal, 5–7 questions each with probes)
- Concept/prototype testing tasks (if applicable)
- Debrief + closing (5 min)

Include facilitator notes in [brackets]. Flag any leading questions.`,
    author: "Isabela Nunes", createdAt: "2024-04-01",
    notes: "Approved by Research Ethics committee April 2024. Obtain signed consent before recording.",
  },
  {
    id: "p-018", title: "NDA Plain-Language Summary", categoryId: "cat-7",
    objective: "Summarizing texts", tool: "Claude", level: "Basic",
    content: `You are a legal communications specialist. Translate the following NDA into plain English:

[PASTE FULL NDA TEXT HERE]

For each section provide:
1. Section title and quoted text (abbreviated if over 100 words)
2. What it actually means — 2–3 plain sentences
3. What you CAN do under this section
4. What you CANNOT do under this section
5. Any time limits or expiry dates
6. Yellow flags: unusual but not necessarily problematic
7. Red flags: terms requiring attorney review before signing

End with a 5-bullet executive summary of key obligations.

Disclaimer: Educational review only, not formal legal advice.`,
    author: "Mariana Souza", createdAt: "2024-04-03",
    notes: "Always recommend qualified legal counsel for formal review.",
  },
  {
    id: "p-019", title: "Financial Statement Deep-Dive Analyzer", categoryId: "cat-8",
    objective: "Analyzing documents", tool: "ChatGPT", level: "Advanced",
    content: `You are a chartered financial analyst (CFA). Analyze the following financial statements:

[PASTE INCOME STATEMENT, BALANCE SHEET, AND CASH FLOW STATEMENT]

Context:
- Reporting period: [FISCAL YEAR OR QUARTER]
- Company type: [PUBLIC / PRIVATE / STARTUP / PE-BACKED]
- Purpose: [INVESTMENT DUE DILIGENCE / BOARD REPORTING]

Analysis framework:
1. Revenue trends: growth rate, mix shifts, revenue quality
2. Profitability ratios: gross, EBITDA, net margin vs benchmarks
3. Liquidity: current ratio, quick ratio, days cash on hand
4. Leverage: debt-to-equity, interest coverage, net debt/EBITDA
5. Cash conversion cycle: DSO, DPO, DIO
6. YoY variance analysis with root cause (top 5 line items)
7. Accounting anomalies or red flags
8. Overall health rating: Strong / Adequate / Stressed / Critical`,
    author: "Gustavo Ferreira", createdAt: "2024-04-05",
    notes: "Pair with an Excel model for quantitative validation. Requires CFO sign-off before external distribution.",
  },
  {
    id: "p-020", title: "SEO Blog Article Outline Generator", categoryId: "cat-1",
    objective: "Producing articles", tool: "Gemini", level: "Basic",
    content: `You are a content strategist and SEO specialist. Create a comprehensive blog article outline:

Topic: [ARTICLE TOPIC]
Primary keyword: [KEYWORD] (search volume: [VOLUME], KD: [SCORE])
Secondary keywords: [2–3 RELATED TERMS]
Target reader: [READER PERSONA]
Content goal: [EDUCATE / RANK / CONVERT / THOUGHT LEADERSHIP]
Target word count: [1000 / 1500 / 2000 / 3000+]

Deliver:
1. 3 title options (SEO-optimized: keyword + power word + number)
2. Meta description for best title (≤155 characters)
3. Full outline: H2s and H3s with 3–5 key points per section
4. Recommended CTA placement and copy
5. Internal and external link opportunities
6. Content upgrade suggestion (lead magnet idea)`,
    author: "Ana Lima", createdAt: "2024-04-08",
    notes: "Run keyword research in Ahrefs before finalizing. Validate search intent manually.",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function genId() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Shared Styles ──────────────────────────────────────────────────────────────
const CARD = "bg-[#0d0d1a] border border-purple-500/10 rounded-xl";
const INPUT = "w-full bg-[#0a0a14] border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all";
const SELECT = "bg-[#0a0a14] border border-purple-500/20 rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all";
const BTN_PRIMARY = "flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] active:scale-[0.98]";
const BTN_GHOST = "flex items-center gap-2 border border-purple-500/20 hover:border-purple-500/40 text-gray-400 hover:text-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-purple-500/5";
const BTN_DANGER = "flex items-center gap-2 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-rose-500/5";

// ── Badges ─────────────────────────────────────────────────────────────────────
function LevelBadge({ level }: { level: Level }) {
  const styles: Record<Level, string> = {
    Basic: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    Intermediate: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    Advanced: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[level]}`}>
      {level}
    </span>
  );
}

function ToolBadge({ tool }: { tool: string }) {
  const styles: Record<string, string> = {
    ChatGPT: "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",
    Claude: "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
    Gemini: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    Copilot: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20",
    Other: "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[tool] ?? styles.Other}`}>
      {tool}
    </span>
  );
}

// ── Login ──────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (user: string) => void }) {
  const [email, setEmail] = useState("admin@prompthub.io");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 6) {
      onLogin(email.split("@")[0]);
    } else {
      setError("Invalid credentials. Use admin@prompthub.io / password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "#07070f",
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 70%), linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 48px 48px, 48px 48px",
      }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 0 32px rgba(168,85,247,0.6), 0 0 64px rgba(168,85,247,0.2)",
            }}
          >
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <span
              className="text-3xl font-bold tracking-tight block leading-none"
              style={{
                background: "linear-gradient(90deg, #fff 0%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PromptHub
            </span>
            <span className="text-xs text-purple-400/70 uppercase tracking-widest">AI Knowledge Library</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(13,13,26,0.9)",
            border: "1px solid rgba(168,85,247,0.2)",
            boxShadow: "0 0 60px rgba(168,85,247,0.08), inset 0 1px 0 rgba(168,85,247,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h1 className="text-xl font-semibold text-gray-100 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all mt-2"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 0 24px rgba(168,85,247,0.4), 0 0 48px rgba(168,85,247,0.15)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Sign in to PromptHub
              </span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-purple-500/10">
            <p className="text-xs text-center text-gray-600">
              Demo: <span className="font-mono text-purple-400/80">admin@prompthub.io</span> / <span className="font-mono text-purple-400/80">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "prompts" as View, label: "Prompts", icon: BookOpen },
  { id: "categories" as View, label: "Categories", icon: Tag },
  { id: "search" as View, label: "Search", icon: Search },
];

function Sidebar({
  currentView,
  setView,
  onLogout,
  user,
}: {
  currentView: View;
  setView: (v: View) => void;
  onLogout: () => void;
  user: string;
}) {
  const initial = user[0]?.toUpperCase() ?? "U";
  const displayName = user.charAt(0).toUpperCase() + user.slice(1);

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col h-full"
      style={{
        background: "#07070f",
        borderRight: "1px solid rgba(168,85,247,0.1)",
      }}
    >
      {/* Brand */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 0 16px rgba(168,85,247,0.5)",
            }}
          >
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p
              className="font-bold text-sm leading-none"
              style={{
                background: "linear-gradient(90deg, #fff, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PromptHub
            </p>
            <p className="text-purple-500/60 text-[10px] mt-0.5 uppercase tracking-wider">AI Library</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[9px] font-bold text-purple-500/30 uppercase tracking-[0.2em] px-3 pb-2">Navigation</p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = currentView === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
              style={
                active
                  ? {
                      background: "rgba(168,85,247,0.12)",
                      color: "#d8b4fe",
                      border: "1px solid rgba(168,85,247,0.25)",
                      boxShadow: "0 0 20px rgba(168,85,247,0.08), inset 0 0 20px rgba(168,85,247,0.05)",
                    }
                  : {
                      color: "#5a5a8a",
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={active ? { color: "#a855f7", filter: "drop-shadow(0 0 6px rgba(168,85,247,0.8))" } : {}}
              />
              <span className={active ? "font-semibold" : ""}>{label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#a855f7", boxShadow: "0 0 8px rgba(168,85,247,1)" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 pt-3" style={{ borderTop: "1px solid rgba(168,85,247,0.1)" }}>
        <div className="flex items-center gap-3 px-2 py-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 10px rgba(168,85,247,0.4)" }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-sm font-medium truncate">{displayName}</p>
            <p className="text-purple-500/50 text-xs">Administrator</p>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-purple-400 transition-colors p-1.5 rounded-lg hover:bg-purple-500/10"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Page Header ────────────────────────────────────────────────────────────────
function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-100">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}



// ── Custom Charts ──────────────────────────────────────────────────────────────
const NEON_COLORS = ["#a855f7", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"];

function CustomBarChart({ data }: { data: { name: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-20 truncate text-right flex-shrink-0">{d.name}</span>
          <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: "rgba(168,85,247,0.06)" }}>
            <div
              className="h-full rounded-md transition-all duration-700"
              style={{
                width: `${(d.count / max) * 100}%`,
                background: NEON_COLORS[i % NEON_COLORS.length],
                boxShadow: `0 0 10px ${NEON_COLORS[i % NEON_COLORS.length]}60`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500 w-4 tabular-nums flex-shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

function CustomDonutChart({ data }: { data: { name: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const cx = 80, cy = 80, r = 62, ir = 38;
  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = total > 0 ? (d.count / total) * Math.PI * 2 : 0;
    const end = angle + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const cos1 = Math.cos(angle), sin1 = Math.sin(angle);
    const cos2 = Math.cos(end), sin2 = Math.sin(end);
    const path = `M${cx + r * cos1} ${cy + r * sin1} A${r} ${r} 0 ${large} 1 ${cx + r * cos2} ${cy + r * sin2} L${cx + ir * cos2} ${cy + ir * sin2} A${ir} ${ir} 0 ${large} 0 ${cx + ir * cos1} ${cy + ir * sin1}Z`;
    angle = end;
    return { ...d, path, color: NEON_COLORS[i % NEON_COLORS.length] };
  });

  return (
    <div className="flex items-center gap-5">
      <svg width="160" height="160" viewBox="0 0 160 160" className="flex-shrink-0">
        {slices.map((s) => (
          <path key={s.name} d={s.path} fill={s.color} opacity={0.9} />
        ))}
        <text x="80" y="75" textAnchor="middle" fill="#e8e8f8" fontSize="20" fontWeight="700" fontFamily="inherit">{total}</text>
        <text x="80" y="91" textAnchor="middle" fill="#5a5a8a" fontSize="10" fontFamily="inherit">prompts</text>
      </svg>
      <div className="space-y-2 flex-1">
        {slices.map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
            <span className="text-xs text-gray-400 flex-1">{s.name}</span>
            <span className="text-xs tabular-nums" style={{ color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function DashboardView({ prompts, categories }: { prompts: Prompt[]; categories: Category[] }) {
  const byCategory = useMemo(
    () =>
      categories
        .map((c) => ({
          name: c.name.length > 10 ? c.name.slice(0, 10) + "…" : c.name,
          count: prompts.filter((p) => p.categoryId === c.id).length,
        }))
        .filter((d) => d.count > 0),
    [prompts, categories]
  );

  const byTool = useMemo(
    () => TOOLS.map((t) => ({ name: t, count: prompts.filter((p) => p.tool === t).length })).filter((d) => d.count > 0),
    [prompts]
  );

  const byLevel = useMemo(
    () => LEVELS.map((l) => ({ name: l, count: prompts.filter((p) => p.level === l).length })),
    [prompts]
  );

  const authors = useMemo(() => new Set(prompts.map((p) => p.author)).size, [prompts]);

  const recent = useMemo(
    () => [...prompts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
    [prompts]
  );

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const levelBar: Record<string, string> = {
    Basic: "from-emerald-600 to-emerald-400",
    Intermediate: "from-amber-600 to-amber-400",
    Advanced: "from-rose-600 to-rose-400",
  };

  const statCards = [
    { label: "Total Prompts", value: prompts.length, icon: BookOpen, glow: "#a855f7", sub: "In your library" },
    { label: "Categories", value: categories.length, icon: Layers, glow: "#06b6d4", sub: "Prompt groups" },
    { label: "Contributors", value: authors, icon: Users, glow: "#10b981", sub: "Unique authors" },
    { label: "AI Tools", value: byTool.length, icon: Wrench, glow: "#f59e0b", sub: "Platforms covered" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Dashboard" subtitle="Your AI prompt knowledge base at a glance" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {statCards.map(({ label, value, icon: Icon, glow, sub }) => (
          <div
            key={label}
            className="rounded-xl p-5 relative overflow-hidden"
            style={{
              background: "#0d0d1a",
              border: "1px solid rgba(168,85,247,0.1)",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = `${glow}40`)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.1)")}
          >
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
              style={{ background: glow, filter: "blur(20px)" }}
            />
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${glow}18`, border: `1px solid ${glow}30` }}
            >
              <Icon className="w-4 h-4" style={{ color: glow }} />
            </div>
            <p className="text-2xl font-bold text-white tabular-nums leading-none mb-1">{value}</p>
            <p className="text-sm font-medium text-gray-300">{label}</p>
            <p className="text-xs text-gray-600 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className={`${CARD} p-5 lg:col-span-3`}>
          <h3 className="text-sm font-semibold text-gray-300 mb-5 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-500" />
            Prompts by Category
          </h3>
          <CustomBarChart data={byCategory} />
        </div>

        <div className={`${CARD} p-5 lg:col-span-2`}>
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Prompts by Tool</h3>
          <CustomDonutChart data={byTool} />
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`${CARD} p-5`}>
          <h3 className="text-sm font-semibold text-gray-300 mb-5">Complexity Distribution</h3>
          <div className="space-y-4">
            {byLevel.map((l) => {
              const pct = prompts.length > 0 ? Math.round((l.count / prompts.length) * 100) : 0;
              return (
                <div key={l.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-400">{l.name}</span>
                    <span className="text-xs text-gray-600 tabular-nums">{l.count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(168,85,247,0.08)" }}>
                    <div
                      className={`h-full bg-gradient-to-r ${levelBar[l.name]} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${CARD} p-5 lg:col-span-2`}>
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Recently Added</h3>
          <div className="divide-y divide-white/[0.03]">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{p.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {catMap[p.categoryId] ?? "—"} · {p.author}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <ToolBadge tool={p.tool} />
                  <LevelBadge level={p.level} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal Wrapper ──────────────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full my-8 rounded-2xl"
        style={{
          maxWidth: 680,
          background: "#0d0d1a",
          border: "1px solid rgba(168,85,247,0.2)",
          boxShadow: "0 0 80px rgba(168,85,247,0.1), 0 40px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
      <h2 className="text-base font-bold text-gray-100">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-purple-400 transition-colors p-1.5 rounded-lg hover:bg-purple-500/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Prompt Form Modal ──────────────────────────────────────────────────────────
function PromptFormModal({
  prompt,
  categories,
  onSave,
  onClose,
}: {
  prompt?: Prompt;
  categories: Category[];
  onSave: (data: Omit<Prompt, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: prompt?.title ?? "",
    categoryId: prompt?.categoryId ?? (categories[0]?.id ?? ""),
    objective: (prompt?.objective ?? OBJECTIVES[0]) as Objective,
    tool: (prompt?.tool ?? TOOLS[0]) as Tool,
    level: (prompt?.level ?? "Basic") as Level,
    content: prompt?.content ?? "",
    author: prompt?.author ?? "",
    notes: prompt?.notes ?? "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) return;
    onSave(form);
  };

  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2";

  return (
    <Modal onClose={onClose}>
      <ModalHeader title={prompt ? "Edit Prompt" : "New Prompt"} onClose={onClose} />
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={INPUT} placeholder="e.g. Facebook Ad Copy Generator for SaaS" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={`${SELECT} w-full`}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Objective *</label>
            <select value={form.objective} onChange={(e) => set("objective", e.target.value)} className={`${SELECT} w-full`}>
              {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Compatible Tool *</label>
            <select value={form.tool} onChange={(e) => set("tool", e.target.value)} className={`${SELECT} w-full`}>
              {TOOLS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Complexity Level *</label>
            <select value={form.level} onChange={(e) => set("level", e.target.value as Level)} className={`${SELECT} w-full`}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Author *</label>
          <input value={form.author} onChange={(e) => set("author", e.target.value)} className={INPUT} placeholder="e.g. Ana Lima" required />
        </div>
        <div>
          <label className={labelClass}>Prompt Content *</label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={9}
            className={`${INPUT} font-mono resize-none leading-relaxed`}
            placeholder="Write your prompt here. Use [PLACEHOLDERS] for variable inputs..."
            required
          />
        </div>
        <div>
          <label className={labelClass}>Usage Notes</label>
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className={`${INPUT} resize-none`} placeholder="Optional tips, limitations, or context..." />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className={BTN_GHOST}>Cancel</button>
          <button type="submit" className={`${BTN_PRIMARY} flex-1 justify-center`} style={{ boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}>
            {prompt ? "Save Changes" : "Create Prompt"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Prompt Detail Modal ────────────────────────────────────────────────────────
function PromptDetailModal({
  prompt, category, onClose, onEdit, onDelete,
}: {
  prompt: Prompt; category?: Category; onClose: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
        <div className="flex-1 min-w-0 pr-4">
          <h2 className="text-base font-bold text-gray-100">{prompt.title}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {category && (
              <span className="text-xs bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 px-2 py-0.5 rounded-md font-medium">
                {category.name}
              </span>
            )}
            <LevelBadge level={prompt.level} />
            <ToolBadge tool={prompt.tool} />
          </div>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-purple-400 transition-colors p-1.5 rounded-lg hover:bg-purple-500/10 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Objective", value: prompt.objective },
            { label: "Author", value: prompt.author },
            { label: "Created", value: formatDate(prompt.createdAt) },
            { label: "Tool", value: prompt.tool },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-3 py-3" style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.1)" }}>
              <p className="text-[9px] font-bold text-purple-500/50 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-xs text-gray-300 font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Prompt Content</p>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs font-semibold transition-all px-3 py-1.5 rounded-lg"
              style={{
                color: copied ? "#10b981" : "#a855f7",
                background: copied ? "rgba(16,185,129,0.1)" : "rgba(168,85,247,0.1)",
                border: `1px solid ${copied ? "rgba(16,185,129,0.25)" : "rgba(168,85,247,0.25)"}`,
              }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy prompt"}
            </button>
          </div>
          <div
            className="rounded-xl p-5 overflow-x-auto"
            style={{
              background: "#030307",
              border: "1px solid rgba(168,85,247,0.15)",
              boxShadow: "inset 0 0 40px rgba(168,85,247,0.03)",
            }}
          >
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "#a78bfa" }}>
              {prompt.content}
            </pre>
          </div>
        </div>

        {prompt.notes && (
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Usage Notes</p>
            <div className="rounded-xl px-4 py-3" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
              <p className="text-sm text-amber-300/80 leading-relaxed">{prompt.notes}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid rgba(168,85,247,0.08)" }}>
          <button onClick={onEdit} className={BTN_PRIMARY}>
            <Edit2 className="w-3.5 h-3.5" /> Edit prompt
          </button>
          <button
            onClick={() => { if (window.confirm("Delete this prompt permanently?")) onDelete(); }}
            className={BTN_DANGER}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Prompts View ───────────────────────────────────────────────────────────────
function PromptsView({
  prompts, categories, onAdd, onEdit, onDelete, onView,
}: {
  prompts: Prompt[]; categories: Category[];
  onAdd: () => void; onEdit: (p: Prompt) => void;
  onDelete: (id: string) => void; onView: (p: Prompt) => void;
}) {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTool, setFilterTool] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [search, setSearch] = useState("");

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (filterCategory && p.categoryId !== filterCategory) return false;
      if (filterTool && p.tool !== filterTool) return false;
      if (filterLevel && p.level !== filterLevel) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.content.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [prompts, filterCategory, filterTool, filterLevel, search]);

  const hasFilters = !!(filterCategory || filterTool || filterLevel || search);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Prompts"
        subtitle={`${prompts.length} prompts in your library`}
        action={
          <button onClick={onAdd} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" /> New Prompt
          </button>
        }
      />

      {/* Filter bar */}
      <div className={`${CARD} p-4 mb-4`}>
        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-500/50" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Filters</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${INPUT} pl-9 w-52`}
              placeholder="Search prompts..."
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={SELECT}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterTool} onChange={(e) => setFilterTool(e.target.value)} className={SELECT}>
            <option value="">All Tools</option>
            {TOOLS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className={SELECT}>
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          {hasFilters && (
            <>
              <button
                onClick={() => { setFilterCategory(""); setFilterTool(""); setFilterLevel(""); setSearch(""); }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Clear all
              </button>
              <span className="ml-auto text-xs text-gray-600 tabular-nums">{filtered.length} of {prompts.length}</span>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`${CARD} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(168,85,247,0.08)", background: "rgba(168,85,247,0.03)" }}>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Prompt</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden lg:table-cell">Tool</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden lg:table-cell">Level</th>
              <th className="text-left px-4 py-3.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest hidden xl:table-cell">Author</th>
              <th className="text-right px-5 py-3.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <Search className="w-8 h-8 text-purple-500/10 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">No prompts found</p>
                  <p className="text-xs text-gray-700 mt-1">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="group transition-colors"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(168,85,247,0.05)" : undefined,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.03)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onView(p)}
                      className="text-left font-medium text-gray-300 hover:text-purple-400 transition-colors block truncate max-w-xs"
                    >
                      {p.title}
                    </button>
                    <p className="text-xs text-gray-600 mt-0.5">{p.objective}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs bg-purple-500/8 text-purple-400/70 ring-1 ring-purple-500/15 px-2.5 py-1 rounded-md font-medium">
                      {catMap[p.categoryId] ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell"><ToolBadge tool={p.tool} /></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><LevelBadge level={p.level} /></td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <span className="text-xs text-gray-600">{p.author}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                      {[
                        { icon: Eye, action: () => onView(p), color: "#a855f7", title: "View" },
                        { icon: Edit2, action: () => onEdit(p), color: "#a855f7", title: "Edit" },
                        {
                          icon: Trash2,
                          action: () => { if (window.confirm("Delete this prompt?")) onDelete(p.id); },
                          color: "#f43f5e",
                          title: "Delete",
                        },
                      ].map(({ icon: Icon, action, title }) => (
                        <button
                          key={title}
                          onClick={action}
                          title={title}
                          className="p-1.5 rounded-lg transition-all text-gray-600 hover:text-gray-200"
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div
            className="px-5 py-3"
            style={{ borderTop: "1px solid rgba(168,85,247,0.07)", background: "rgba(168,85,247,0.02)" }}
          >
            <p className="text-xs text-gray-700 tabular-nums">{filtered.length} of {prompts.length} prompts</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Category Form Modal ────────────────────────────────────────────────────────
function CategoryFormModal({ category, onSave, onClose }: { category?: Category; onSave: (n: string, d: string) => void; onClose: () => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim(), description.trim());
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title={category ? "Edit Category" : "New Category"} onClose={onClose} />
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} placeholder="e.g. Marketing" required autoFocus />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${INPUT} resize-none`}
            placeholder="Brief description of what prompts belong in this category..."
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className={BTN_GHOST}>Cancel</button>
          <button type="submit" className={`${BTN_PRIMARY} flex-1 justify-center`}>
            {category ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Categories View ────────────────────────────────────────────────────────────
function CategoriesView({
  categories, prompts, onAdd, onEdit, onDelete,
}: {
  categories: Category[]; prompts: Prompt[];
  onAdd: () => void; onEdit: (c: Category) => void; onDelete: (id: string) => void;
}) {
  const countMap = useMemo(() => {
    const m: Record<string, number> = {};
    prompts.forEach((p) => { m[p.categoryId] = (m[p.categoryId] ?? 0) + 1; });
    return m;
  }, [prompts]);

  const GLOW_COLORS = ["#a855f7", "#06b6d4", "#8b5cf6", "#10b981", "#f43f5e", "#f59e0b", "#0ea5e9", "#ec4899"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories organizing your prompt library`}
        action={
          <button onClick={onAdd} className={BTN_PRIMARY}>
            <Plus className="w-4 h-4" /> New Category
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const count = countMap[cat.id] ?? 0;
          const glow = GLOW_COLORS[i % GLOW_COLORS.length];
          return (
            <div
              key={cat.id}
              className="rounded-xl p-5 group relative overflow-hidden transition-all duration-200"
              style={{
                background: "#0d0d1a",
                border: "1px solid rgba(168,85,247,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${glow}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${glow}08`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-10 pointer-events-none transition-opacity group-hover:opacity-20"
                style={{ background: glow, filter: "blur(24px)" }}
              />
              <div className="flex items-start justify-between mb-3 relative">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${glow}18`, border: `1px solid ${glow}30` }}
                  >
                    <Tag className="w-4 h-4" style={{ color: glow }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-200">{cat.name}</h3>
                    <p className="text-xs text-gray-600">{formatDate(cat.createdAt)}</p>
                  </div>
                </div>
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{ color: `${glow}50`, textShadow: `0 0 20px ${glow}40` }}
                >
                  {count}
                </span>
              </div>

              {cat.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-4 relative">{cat.description}</p>
              )}

              <div
                className="flex items-center justify-between pt-3 relative"
                style={{ borderTop: "1px solid rgba(168,85,247,0.06)" }}
              >
                <span className="text-xs text-gray-600 font-medium">{count} {count === 1 ? "prompt" : "prompts"}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(cat)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-purple-400 transition-colors"
                    style={{}}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(168,85,247,0.1)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (count > 0) { window.alert(`Cannot delete "${cat.name}" — it contains ${count} prompt(s).`); return; }
                      if (window.confirm(`Delete category "${cat.name}"?`)) onDelete(cat.id);
                    }}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-rose-400 transition-colors"
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.1)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Search View ────────────────────────────────────────────────────────────────
function SearchView({ prompts, categories, onView }: { prompts: Prompt[]; categories: Category[]; onView: (p: Prompt) => void }) {
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterObjective, setFilterObjective] = useState("");
  const [filterTool, setFilterTool] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");

  const authors = useMemo(() => [...new Set(prompts.map((p) => p.author))].sort(), [prompts]);
  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);
  const hasFilters = !!(query || filterCategory || filterObjective || filterTool || filterLevel || filterAuthor);

  const results = useMemo(() => {
    if (!hasFilters) return [];
    return prompts.filter((p) => {
      if (filterCategory && p.categoryId !== filterCategory) return false;
      if (filterObjective && p.objective !== filterObjective) return false;
      if (filterTool && p.tool !== filterTool) return false;
      if (filterLevel && p.level !== filterLevel) return false;
      if (filterAuthor && p.author !== filterAuthor) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.objective.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, filterCategory, filterObjective, filterTool, filterLevel, filterAuthor, prompts, hasFilters]);

  const clearAll = () => {
    setQuery(""); setFilterCategory(""); setFilterObjective("");
    setFilterTool(""); setFilterLevel(""); setFilterAuthor("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Advanced Search" subtitle="Find any prompt by keyword, category, tool, level, or author" />

      <div className={`${CARD} p-5 mb-5`}>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${INPUT} pl-11`}
            placeholder="Search by title, content, objective, or author..."
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${SELECT} w-full`}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filterObjective} onChange={(e) => setFilterObjective(e.target.value)} className={`${SELECT} w-full`}>
            <option value="">All Objectives</option>
            {OBJECTIVES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={filterTool} onChange={(e) => setFilterTool(e.target.value)} className={`${SELECT} w-full`}>
            <option value="">All Tools</option>
            {TOOLS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className={`${SELECT} w-full`}>
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={filterAuthor} onChange={(e) => setFilterAuthor(e.target.value)} className={`${SELECT} w-full`}>
            <option value="">All Authors</option>
            {authors.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {hasFilters && (
          <div className="mt-3.5 pt-3.5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(168,85,247,0.08)" }}>
            <p className="text-xs text-gray-600">
              <span className="font-bold text-purple-400">{results.length}</span> result{results.length !== 1 ? "s" : ""} found
            </p>
            <button onClick={clearAll} className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {!hasFilters ? (
        <div className="text-center py-24">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.1)" }}
          >
            <Search className="w-7 h-7 text-purple-500/30" />
          </div>
          <p className="text-sm font-medium text-gray-600">Start typing or apply a filter to search</p>
          <p className="text-xs text-gray-700 mt-1">{prompts.length} prompts available in your library</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm font-medium text-gray-600">No prompts match your search</p>
          <p className="text-xs text-gray-700 mt-1">Try different keywords or broaden the filters</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {results.map((p) => (
            <div
              key={p.id}
              onClick={() => onView(p)}
              className="rounded-xl p-4 cursor-pointer group transition-all duration-150"
              style={{ background: "#0d0d1a", border: "1px solid rgba(168,85,247,0.1)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(168,85,247,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-200 group-hover:text-purple-400 transition-colors truncate">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {p.objective} · {p.author} · {formatDate(p.createdAt)}
                  </p>
                  <p
                    className="text-xs text-gray-600 mt-2.5 line-clamp-2 font-mono leading-relaxed px-3 py-2 rounded-lg"
                    style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.06)" }}
                  >
                    {p.content.slice(0, 140).replace(/\n/g, " ")}…
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <ToolBadge tool={p.tool} />
                  <LevelBadge level={p.level} />
                  <span className="text-xs bg-purple-500/8 text-purple-400/60 ring-1 ring-purple-500/15 px-2 py-0.5 rounded-md font-medium">
                    {catMap[p.categoryId] ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [prompts, setPrompts] = useState<Prompt[]>(SEED_PROMPTS);

  const [promptForm, setPromptForm] = useState<{ open: boolean; prompt?: Prompt }>({ open: false });
  const [promptDetail, setPromptDetail] = useState<Prompt | null>(null);
  const [categoryForm, setCategoryForm] = useState<{ open: boolean; category?: Category }>({ open: false });

  if (!user) return <LoginPage onLogin={setUser} />;

  const handleSavePrompt = (data: Omit<Prompt, "id" | "createdAt">) => {
    if (promptForm.prompt) {
      setPrompts((ps) => ps.map((p) => (p.id === promptForm.prompt!.id ? { ...promptForm.prompt!, ...data } : p)));
    } else {
      setPrompts((ps) => [...ps, { id: genId(), createdAt: new Date().toISOString().split("T")[0], ...data }]);
    }
    setPromptForm({ open: false });
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((ps) => ps.filter((p) => p.id !== id));
    setPromptDetail(null);
  };

  const handleSaveCategory = (name: string, description: string) => {
    if (categoryForm.category) {
      setCategories((cs) => cs.map((c) => (c.id === categoryForm.category!.id ? { ...c, name, description } : c)));
    } else {
      setCategories((cs) => [...cs, { id: genId(), name, description, createdAt: new Date().toISOString().split("T")[0] }]);
    }
    setCategoryForm({ open: false });
  };

  const openEditPrompt = (p: Prompt) => {
    setPromptDetail(null);
    setPromptForm({ open: true, prompt: p });
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#07070f" }}
    >
      <Sidebar currentView={view} setView={setView} onLogout={() => setUser(null)} user={user} />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          background: "#07070f",
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        {view === "dashboard" && <DashboardView prompts={prompts} categories={categories} />}
        {view === "prompts" && (
          <PromptsView
            prompts={prompts}
            categories={categories}
            onAdd={() => setPromptForm({ open: true })}
            onEdit={openEditPrompt}
            onDelete={handleDeletePrompt}
            onView={setPromptDetail}
          />
        )}
        {view === "categories" && (
          <CategoriesView
            categories={categories}
            prompts={prompts}
            onAdd={() => setCategoryForm({ open: true })}
            onEdit={(c) => setCategoryForm({ open: true, category: c })}
            onDelete={(id) => setCategories((cs) => cs.filter((c) => c.id !== id))}
          />
        )}
        {view === "search" && (
          <SearchView prompts={prompts} categories={categories} onView={setPromptDetail} />
        )}
      </main>

      {promptForm.open && (
        <PromptFormModal
          prompt={promptForm.prompt}
          categories={categories}
          onSave={handleSavePrompt}
          onClose={() => setPromptForm({ open: false })}
        />
      )}

      {promptDetail && (
        <PromptDetailModal
          prompt={promptDetail}
          category={categories.find((c) => c.id === promptDetail.categoryId)}
          onClose={() => setPromptDetail(null)}
          onEdit={() => openEditPrompt(promptDetail)}
          onDelete={() => handleDeletePrompt(promptDetail.id)}
        />
      )}

      {categoryForm.open && (
        <CategoryFormModal
          category={categoryForm.category}
          onSave={handleSaveCategory}
          onClose={() => setCategoryForm({ open: false })}
        />
      )}
    </div>
  );
}
