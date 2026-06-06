# x402 Paywall

A content monetization platform where creators publish premium content behind x402 micropayment walls, and both humans and AI agents pay with USDC on Base to unlock it.

Built for the Base x Privy Hackathon (June 2026). Theme: x402 protocol, agentic commerce, stablecoins.

## What it does

**Creator side**: Publish articles and set a USDC price (0.01 to 5.00 USDC). Content is gated via the x402 protocol.

**Reader side**: Browse a feed of locked articles. Click to unlock. A protocol trace modal shows the full x402 flow: 402 Payment Required, payment construction, X-PAYMENT header, 200 OK.

**Research Agent**: Click "Research Agent" to launch a Claude agent that autonomously browses articles, pays for relevant ones via x402, and synthesizes a research report. All payments visible in real-time in the payment feed.

**Live payment feed**: Right sidebar shows every unlock with tx hash, payer/payee addresses, and amounts.

## x402 Protocol Flow

When a reader clicks "Unlock for X USDC":

```
Step 1: GET /api/content/{id}
<- 402 Payment Required
   { "x402Version": 1, "accepts": [{ "scheme": "exact", "network": "base-mainnet",
     "maxAmountRequired": "250000", "asset": "0x833589...USDC", "payTo": "0x..." }] }

Step 2: Constructing payment...
   Signing transferWithAuthorization with Base Account

Step 3: GET /api/content/{id}
   X-PAYMENT: <encoded-payment-proof>
<- 200 OK
   { "content": "...", "paymentReceipt": { "txHash": "0x...", ... } }
```

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set up env
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY (required for the Research Agent)

# 3. Run
npm run dev
```

Open http://localhost:3000.

The Research Agent requires an `ANTHROPIC_API_KEY`. Without it, human article unlocks still work via the simulated x402 flow.

## Tech stack

- Next.js 14, TypeScript, Tailwind CSS, App Router
- Claude claude-haiku-4-5-20251001 via Anthropic API (research agent with tool use)
- Simulated x402 payment flows with realistic protocol traces
- USDC on Base (mainnet addresses, mock signing)
- In-memory article store (no DB needed)

## Project structure

```
src/
  app/
    page.tsx              # Article feed with category filters
    publish/page.tsx      # Creator publish form
    api/
      unlock/route.ts     # x402 payment simulation + content delivery
      agent/route.ts      # Claude research agent (streaming SSE)
      publish/route.ts    # Article publishing endpoint
  components/
    ArticleCard.tsx       # Locked/unlocked card with x402 flow
    X402Flow.tsx          # Animated protocol trace modal
    PaymentFeed.tsx       # Live payment sidebar
    ResearchAgent.tsx     # Agent panel with streaming output
  lib/
    articles.ts           # 10 preloaded articles + custom article store
    x402.ts               # Mock x402 protocol helpers
```

## Pre-loaded articles

10 articles across AI Research, Protocol, Market Data, Developer, Economics, and Future of Work categories. Prices range from $0.25 to $1.00 USDC.

## Research Agent demo

The agent uses Claude's tool use API with three tools:

- `browse_articles`: Lists all available articles
- `unlock_article`: Pays via x402 for an article and receives the full content
- `write_report`: Synthesizes a research report from unlocked content

Payments fire in real-time and appear in the payment feed tagged as "Agent" (purple) vs "Human" (blue).
