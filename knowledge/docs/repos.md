markdown_content = """# GitHub Repository Collection

This file contains a curated list of software repositories and agentic frameworks for AI development, quantitative trading, and local infrastructure management.

## 1. AI Development & Agentic Frameworks


* **PAOS (Personal Agent Operating System)**
    * **Description:** A self-hosted multi-agent orchestration system that unifies various AI agents (e.g., Claude Code, Gemini, Ollama) via shared memory and a messaging bus. It utilizes a "plan-then-execute" pipeline and a governance framework.
    * **Repo:** (Reference: *7kim/AI_Workflow* in personal context)

* **FreeLLMAPI**
    * **Description:** An OpenAI-compatible proxy aggregating free-tier access from multiple AI providers into a single endpoint. Includes automatic failover, rate-limit tracking, and encrypted API key storage.
    * **Repo:** [https://github.com/FreeLLMAPI/FreeLLMAPI](https://github.com/FreeLLMAPI/FreeLLMAPI)

## 3. Algorithmic Trading & Finance

* **TradingAgents (Tauric Research)**
    * **Description:** A multi-agent framework mimicking a professional trading firm. Uses specialized agents (Research Manager, Trader, Portfolio Manager) for market analysis and execution, supporting persistent decision logging.
    * **Repo:** [https://github.com/tauricresearch/tradingagents](https://github.com/tauricresearch/tradingagents)

* **Freqtrade**
    * **Description:** A free and open-source crypto trading bot written in Python. Features include backtesting, plotting, strategy optimization via machine learning, and Telegram/WebUI management.
    * **Repo:** [https://github.com/freqtrade/freqtrade](https://github.com/freqtrade/freqtrade)

* **Investing Algorithm Framework (IAF)**
    * **Description:** A Python framework for creating, backtesting, and comparing trading strategies side-by-side.
    * **Repo:** [https://github.com/coding-kitties/investing-algorithm-framework](https://github.com/coding-kitties/investing-algorithm-framework)

---

## 🧭 Systematic Prompting & Agentic Patterns

### 1. The "Rigorous Mentor" Prompt
- **Purpose:** Override Claude's default "agreeable" behavior.
- **Prompt:** *"Act as a rigorous, honest mentor. Do not default to agreement. Identify weaknesses, blind spots, and flawed assumptions. Challenge ideas when needed. Be direct and clear, not harsh. Prioritize helping me improve over being agreeable. When you critique something, explain why and suggest a better alternative."*

### 3. Anatomy of a Claude Prompt
- **Role:** Define persona (e.g., "Senior GTM Strategist").
- **Task:** Clear objective (e.g., "Build a 90-day launch plan").
- **Context:** Core facts (Product, Team, Resources, Risks).
- **Reasoning:** Logic for how to approach the output.
- **Stop Conditions:** Specific triggers for completion.
- **Output:** Final format (e.g., weekly sprint plan).

---

## 🛠️ Startup & Technical Resources

### 1. Lean Startup Stack (~$20/mo)
- **Coding:** Claude ($20/mo)
- **Backend:** Supabase (Free)
- **Deploy:** Vercel (Free)
- **Payments:** Stripe (2.9%)
- **Auth:** Clerk (Free)
- **Vector DB:** Pinecone (Free)
- **Analytics:** PostHog (Free)
- **Error Tracking:** Sentry (Free)
- **Other:** GitHub (VC), Resend (Emails), Cloudflare (DNS).

---