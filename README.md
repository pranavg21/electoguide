# 🗳️ ElectoGuide Bharat — AI Election Education Assistant

**ElectoGuide Bharat** is an AI-powered, multilingual election education platform that helps Indian citizens understand the Election Commission of India (ECI) processes, voter registration, and EVM voting.

Built with **Next.js 16**, **Vercel AI SDK v6**, **Google Gemini** (Vertex AI + AI Studio), and a **Generative UI** architecture that streams interactive React components directly from the AI.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Agent AI** | Router → Specialist agents (Explainer, Legal, EVM, Timeline, Checklist) |
| 🎨 **Generative UI** | AI streams interactive React components (wizards, simulators, timelines) |
| 🗳️ **EVM Simulator** | Step-by-step interactive Electronic Voting Machine + VVPAT walkthrough |
| 📋 **Form 6 Wizard** | Guided voter eligibility check with DigiLocker simulation |
| 📅 **Election Timeline** | Interactive phase-by-phase election schedule viewer |
| ✅ **Action Checklists** | Interactive voter registration to-do lists with progress tracking |
| 🌐 **Trilingual** | English, Hindi (हिन्दी), and Marathi (मराठी) support |
| 🎤 **Voice I/O** | Speech recognition input + text-to-speech responses |
| 📱 **PWA** | Installable Progressive Web App with offline fallback |
| 🔒 **Security** | Rate limiting, input sanitization, CSP headers, HSTS |
| ♿ **Accessibility** | WCAG 2.1 AA: skip links, focus management, reduced motion, ARIA labels |
| 🌙 **Dark/Light Mode** | Theme toggle with system preference detection |

---

## 🏗️ Architecture

```
src/
├── ai/                    # AI agent configurations
│   ├── agents.ts          # Model instances (Vertex AI / Google AI Studio)
│   ├── system-prompts.ts  # Specialized agent system prompts
│   └── tools.ts           # Generative UI tool definitions (Zod schemas)
├── app/
│   ├── api/chat/route.ts  # Streaming chat API (multi-agent routing)
│   ├── layout.tsx         # Root layout with SEO metadata + PWA
│   ├── page.tsx           # Main chat page
│   ├── error.tsx          # Global error boundary
│   └── not-found.tsx      # Custom 404 page
├── components/
│   ├── chat/              # ChatInterface, MessageBubble
│   ├── generative/        # Streamed UI: Form6Wizard, EVMSimulator, Timeline, etc.
│   └── ui/                # Header, shared UI components
├── hooks/                 # Custom hooks (useTTS, useVoiceInput)
├── lib/                   # Utilities, schemas, i18n, election data
├── types/                 # TypeScript declarations (Web Speech API)
└── __tests__/             # Jest + React Testing Library tests
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Option A: Google AI Studio (simple)
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key

# Option B: Google Vertex AI (production)
GOOGLE_VERTEX_PROJECT=your_project_id
GOOGLE_VERTEX_LOCATION=asia-south1
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

> **Note:** The app works in **demo mode** without any API keys — it uses keyword-based intent classification and static data.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm start
```

---

## 🛡️ Security

- **Rate Limiting**: 30 requests/minute per IP on API routes
- **Input Sanitization**: HTML tag stripping, JS protocol removal
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Message Limits**: 2000 character max per message, 50 message conversation cap
- **Strict Schemas**: All tool outputs validated with Zod `.strict()` mode

---

## 🧪 Testing

- **56 tests** across 6 test suites
- Component tests: Header, ActionChecklist, EVMSimulator, Form6Wizard
- Schema validation: EPIC, Aadhaar, Mobile, Form6, EVM, FactCard, Checklist, Roadmap
- i18n coverage: All 3 languages, chip generation, fallback behavior

---

## 📄 License

This project is for educational and hackathon purposes.

---

*Built with ❤️ for Indian democracy. Every vote matters! 🇮🇳*
