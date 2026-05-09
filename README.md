# PaperMind 🌿

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![React 19](https://img.shields.io/badge/React-19-149ECA?style=flat&logo=react&logoColor=white)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Groq](https://img.shields.io/badge/Groq-Llama_3.3-FF6B35?style=flat&logoColor=white)](https://groq.com/) [![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](https://opensource.org/licenses/MIT)

**PaperMind** turns any research topic into a structured academic synthesis. Type a topic, fetch real peer-reviewed papers from PubMed and Semantic Scholar, select the ones you want, and get a 3,000–4,500 word report — complete with a visual flowchart, comparison table, and numbered references. All powered by Groq + Llama 3.3. No sign-up, no database, no fluff.

> Research synthesis that actually cites real papers, not hallucinations.

---

## ✨ Highlights

- **📄 Real Papers**: Fetches live results from PubMed (35M+ biomedical abstracts) and Semantic Scholar (200M+ papers)
- **🤖 AI Synthesis**: Groq + Llama 3.3 70B generates a structured academic report from selected abstracts
- **🗺️ Visual Flowchart**: Auto-generated Mermaid.js diagram of the research process
- **📊 Comparison Table**: Side-by-side breakdown of key findings across papers
- **🔗 Cited References**: Numbered references with DOI links and open-access PDF discovery via Unpaywall
- **📋 Copy as Markdown**: One-click export of the full synthesis as formatted markdown
- **🖨️ Print to PDF**: Native browser print — clean A4, all sections included
- **🌙 Dark / Light / System**: Full theme support with no flash on reload
- **🕐 Research History**: Last 10 searches saved locally, one click to reload

---

## 🎯 How It Works

1. Type a research topic in the search bar
2. PaperMind fetches real papers from PubMed and Semantic Scholar
3. Select 3–10 papers to include
4. Hit **Synthesize** — Groq generates the full report in ~10 seconds
5. Read the Report, explore the Flowchart, scan the Table, check the References
6. Copy as Markdown or Print / Save PDF

---

## 🏗️ Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (Pages Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + shadcn/ui |
| **Animation** | Framer Motion 11 (LazyMotion) |
| **State** | Zustand 5 + TanStack Query 5 |
| **LLM** | Groq API — Llama 3.3 70B Versatile |
| **Paper Sources** | PubMed E-utilities · Semantic Scholar Graph API |
| **PDF Discovery** | Unpaywall API |
| **Diagrams** | Mermaid.js v11 |
| **Forms** | React Hook Form + Zod |

</div>

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/akshadjaiswal/PaperMind.git
cd PaperMind/application
npm install
```

### 2. Environment Setup

Create `.env.local` in the `application/` directory:

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Recommended — prevents Semantic Scholar 429 rate limits
# Free key at: https://www.semanticscholar.org/product/api
SEMANTIC_SCHOLAR_API_KEY=your_key_here

# Optional — for Unpaywall PDF discovery
UNPAYWALL_EMAIL=your@email.com
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚠️ Disclaimer

PaperMind synthesizes from real paper abstracts, but AI summaries can contain errors or misinterpretations. Always verify claims against the original papers before using in academic or professional work.

---

## 👨‍💻 Maintainer

**Akshad Jaiswal**
- GitHub: [@akshadjaiswal](https://github.com/akshadjaiswal)
- Email: akshadsantoshjaiswal@gmail.com
- LinkedIn: [Akshad Jaiswal](https://www.linkedin.com/in/akshadsantoshjaiswal/)

---

**Built with ❤️ by Akshad Jaiswal**
