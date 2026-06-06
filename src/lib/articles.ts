export interface Article {
  id: string;
  title: string;
  author: string;
  authorAddress: string;
  teaser: string;
  content: string;
  priceUsdc: number;
  category: string;
  publishedAt: string;
  tags: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "art-001",
    title: "Claude 4 Opus: What the Leaked Benchmarks Actually Mean for AGI Timelines",
    author: "Aria Chen",
    authorAddress: "0xA1B2C3D4E5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    teaser: "Leaked internal evals show Claude 4 Opus hitting 94.2% on the ARC-AGI benchmark—a jump that's...",
    content: `Leaked internal evals show Claude 4 Opus hitting 94.2% on the ARC-AGI benchmark—a jump that's sending ripples through the research community. But what do these numbers actually mean for AGI timelines?

Let's unpack what ARC-AGI actually tests: novel reasoning problems designed to be trivial for humans but hard for models trained on pattern matching. The benchmark was created specifically to resist memorization. Hitting 94.2% suggests something qualitatively different is happening in Opus's architecture.

Three things stand out from the leaked eval suite:
1. **Compositional generalization**: Opus solves multi-step novel problems by decomposing them without explicit chain-of-thought prompting
2. **Causal reasoning**: The model correctly identifies counterfactuals in scenarios it could not have seen in training
3. **Abstraction transfer**: Rules learned in one domain spontaneously apply to structurally analogous domains

Skeptics will note that benchmark gaming is real—Anthropic could have inadvertently optimized toward ARC-AGI during RLHF. But the leaked notes suggest these results held on a "secret test set" not exposed during training.

What does this mean for timelines? If we take the results at face value, we're looking at systems that can genuinely generalize in ways that were supposed to be "hard problems" as recently as 2023. The 2027 predictions from Metaculus are looking optimistic, not pessimistic.

The more interesting question is what happens when capabilities like this meet agentic infrastructure—models that can act in the world, not just reason about it. That's where the real acceleration kicks in.`,
    priceUsdc: 0.50,
    category: "AI Research",
    publishedAt: "2026-06-04",
    tags: ["AI", "Claude", "AGI", "benchmarks"],
  },
  {
    id: "art-002",
    title: "x402: The HTTP Payment Protocol That Makes AI Agents First-Class Commerce Citizens",
    author: "Marcus Webb",
    authorAddress: "0xB2C3D4E5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    teaser: "RFC 7235 defined 401 Unauthorized. The 402 status code was reserved for \"future use\"—and that future...",
    content: `RFC 7235 defined 401 Unauthorized. The 402 status code was reserved for "future use"—and that future is now here, in the form of the x402 protocol.

x402 is elegant in its simplicity: when a resource requires payment, the server responds with a 402 Payment Required, along with a JSON body describing exactly how to pay. The client (human or AI agent) constructs a payment proof and retries the request with an X-PAYMENT header. If valid, the server returns 200 OK with the content.

Why does this matter for AI agents? Because the payment UX problem that exists for humans (wallet popups, confirmation dialogs, gas estimation) simply doesn't exist for agents. An agent with a funded Base Account can autonomously:
- Receive a 402 response
- Parse the payment requirements (amount, asset, payTo address)
- Sign and submit the transaction on Base
- Retry the request with the proof
- Receive and process the paid content

All in one agentic loop, with no human in the loop required.

The killer app here isn't just "AI pays for content." It's entire markets that were previously impractical:
- Real-time data feeds priced per-query (weather, financial data, satellite imagery)
- Computational resources billed by the operation
- API access with metered pricing at HTTP-layer granularity
- Content that monetizes proportionally to consumption, not subscription

Base is the perfect settlement layer: 2-second finality, sub-cent gas fees, native USDC liquidity. A $0.01 micropayment clears in the time it takes an LLM to generate a token.

The protocol is still early—tooling is sparse, wallets don't natively support 402 flows yet. But the spec is clean and the primitives are right. This is what HTTP-native commerce looks like.`,
    priceUsdc: 0.25,
    category: "Protocol",
    publishedAt: "2026-06-03",
    tags: ["x402", "protocol", "Base", "payments"],
  },
  {
    id: "art-003",
    title: "Base Ecosystem Report Q2 2026: $47B TVL, 12M Daily Active Addresses",
    author: "DataLayer Research",
    authorAddress: "0xC3D4E5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    teaser: "Base has crossed 12 million daily active addresses, surpassing Ethereum mainnet's DAA count for the...",
    content: `Base has crossed 12 million daily active addresses, surpassing Ethereum mainnet's DAA count for the third consecutive month. Here's what the Q2 2026 numbers actually show.

**Total Value Locked**: $47.2B (up 340% YoY)
- DeFi protocols: $31.8B
- Gaming/NFT collateral: $8.4B
- x402 payment escrow: $7.0B (new category, fastest growing)

**Transaction Volume**:
- Average: 8.4M txs/day
- Peak: 23.1M txs/day (during the Coinbase retail push in April)
- Median gas fee: $0.0003 (effectively free for micropayments)

**Developer Ecosystem**:
- 18,400 active deployers in Q2
- 2,100 new contracts deployed daily
- x402-compatible endpoints: 340,000 (up from 12,000 in Q4 2025)

The x402 category is the most interesting inflection point. The $7B in payment escrow represents real economic activity—APIs, content, data feeds, and compute services that monetize at the HTTP layer. This wasn't a category 18 months ago.

**USDC on Base**: $18.3B circulating (41% of all Base TVL). This isn't surprising given Circle's deep integration with Coinbase's distribution, but the velocity is striking: USDC on Base turns over 4.2x monthly versus 1.8x on Ethereum mainnet.

**AI Agent Wallets**: New metric tracked since Q1 2026. Coinbase Wallet identifies ~2.1M addresses as AI agent wallets based on transaction patterns (no manual signing, high frequency, small amounts). These accounts represent 14% of Base transaction volume despite being 0.4% of addresses.

The agentic economy is not a future concept. It's already 14% of Base's economy and growing at 40% month-over-month.`,
    priceUsdc: 1.00,
    category: "Market Data",
    publishedAt: "2026-06-02",
    tags: ["Base", "TVL", "market data", "ecosystem"],
  },
  {
    id: "art-004",
    title: "How Privy Makes Wallet UX Invisible: A Deep Technical Dive",
    author: "Samira Okafor",
    authorAddress: "0xD4E5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    teaser: "The biggest lie in crypto UX is that wallets need to be visible. Privy's embedded wallet architecture...",
    content: `The biggest lie in crypto UX is that wallets need to be visible. Privy's embedded wallet architecture proves it—and the implications for x402 adoption are profound.

Here's the core insight: users don't want wallets. They want outcomes. "Buy this article." "Tip this creator." "Access this API." The wallet is infrastructure, like TCP/IP. Nobody thinks about TCP/IP when they load a webpage.

**How Privy's Embedded Wallets Work**:

Traditional wallets require users to install browser extensions, manage seed phrases, and manually approve transactions. Privy replaces this with:

1. **MPC-backed key shards**: The private key is split using threshold cryptography. Privy holds one shard, the user's device holds another. No single party ever sees the full key.

2. **Social auth as key recovery**: Lose your device? Recover via Google/email. The user experience is identical to "forgot password"—but it's actually cryptographic key recovery.

3. **Invisible signing**: For pre-approved transaction types (amounts under $X, to whitelisted addresses), Privy signs without showing the user any UI. This is the critical piece for x402.

**Why This Matters for x402**:

When a user hits a 402 payment wall on a Privy-integrated site, the flow can be:
- Parse payment requirements
- Check: is this within user's pre-approved parameters?
- If yes: sign and submit automatically, reveal content
- If no: show a single confirmation dialog

For micropayments under $1 (the sweet spot for x402 content), the entire flow can be invisible. Click article. Read article. Payment happened in 400ms. No wallet popup. No gas estimation. No "confirm transaction."

This is the unlock. Not blockchain tech getting better—UX getting good enough that normal people don't care that blockchain is involved.`,
    priceUsdc: 0.35,
    category: "Developer",
    publishedAt: "2026-06-01",
    tags: ["Privy", "wallets", "UX", "x402"],
  },
  {
    id: "art-005",
    title: "The Agentic Commerce Stack: What Infrastructure Exists Today",
    author: "Jin Park",
    authorAddress: "0xE5F6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    teaser: "If you wanted to build an AI agent that autonomously spends money today, what would you actually use?...",
    content: `If you wanted to build an AI agent that autonomously spends money today, what would you actually use? Surprisingly, the stack is nearly complete.

**Layer 1: Agent Identity & Wallets**

The agent needs an onchain identity. Options:
- **Coinbase AgentKit**: The most turnkey solution. Spin up a Base Account for your agent in 3 lines of code. USDC funded from Coinbase Exchange.
- **Safe multisig**: More control, requires a human co-signer for large transactions. Good for high-value agents with oversight requirements.
- **EOA + CDP**: Raw external account, maximum simplicity, less recovery options.

**Layer 2: Payment Protocol**

- **x402**: HTTP-native. The agent hits a URL, gets a 402, parses requirements, pays, retries. Clean.
- **Direct USDC transfer**: Manual, but works anywhere. Agent calls USDC contract transfer() directly.
- **Payment channels**: For high-frequency micropayments, open a channel, pay off-chain, settle periodically.

**Layer 3: Agent Framework**

- **Claude + tool use**: Give Claude an x402-aware HTTP tool. The agent discovers and pays for resources as part of its reasoning loop.
- **LangChain**: More complex setup but broader ecosystem. x402 support via community plugins.
- **Custom loops**: For production, purpose-built state machines often outperform general-purpose frameworks.

**Layer 4: Oversight & Limits**

The missing piece. Current options:
- Pre-set spending limits in wallet contracts (basic)
- Human approval queues for amounts over threshold (breaks autonomy)
- AI policy agents that evaluate spend requests (experimental)

The oversight layer is genuinely nascent. Most production agentic commerce today relies on spending limits and human review for outliers. We're 12-18 months away from robust autonomous oversight.

**What's Actually Missing**:

1. Standardized agent identity (x402 receivers can't verify the agent's reputation)
2. Cross-agent payment routing (agent A paying agent B paying agent C)
3. Tax/accounting primitives for agent spending

The foundation is solid. The application layer is where the work is.`,
    priceUsdc: 0.40,
    category: "Developer",
    publishedAt: "2026-05-30",
    tags: ["agents", "infrastructure", "USDC", "developer"],
  },
  {
    id: "art-006",
    title: "USDC Velocity as an Economic Signal: Why Stablecoin Turnover Predicts DeFi Health",
    author: "Elena Vasquez",
    authorAddress: "0xF6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    teaser: "Traditional economists track M2 velocity to gauge economic health. The stablecoin equivalent is more...",
    content: `Traditional economists track M2 velocity to gauge economic health. The stablecoin equivalent is more granular, more real-time, and increasingly more predictive of DeFi market conditions.

**What Is Stablecoin Velocity?**

Velocity = (Total Transaction Volume) / (Average Supply). A velocity of 4.0 means the entire USDC supply turns over 4 times per month—each dollar is used in 4 different transactions.

High velocity indicates: active economic activity, low idle balances, strong demand for the asset as a medium of exchange (not just store of value).

Low velocity indicates: USDC being held as a safe haven, yield-seeking in staking positions, or stagnant market conditions.

**Base USDC Velocity: Current Readings**

Base USDC velocity has hit 4.2x monthly, driven by:
- x402 micropayments (small amounts, high frequency)
- DEX trading (Aerodrome, BaseSwap)
- AI agent spending (high frequency, small amounts)
- Cross-chain bridging flows

Compare to Ethereum mainnet at 1.8x: the difference is gas costs. When gas is $0.0003, you use USDC for things that don't make sense at $3 gas. This is the fundamental insight: L2 economics enable transaction sizes that unlock new use cases.

**Velocity as a Leading Indicator**

Our analysis of 18 months of data shows Base USDC velocity leads DEX volume by 3-5 days. When velocity spikes:
- Day +1-2: Higher DEX swap volumes
- Day +3-5: New protocol deployments increase
- Day +7: TVL follows upward

The causal mechanism: velocity spikes indicate more participants actively using USDC, which increases liquidity demand, which attracts liquidity providers, which enables more protocol activity.

**The x402 Effect**

Since x402 endpoints hit 340K (Q2 2026), we've seen a new velocity component emerge: micropayment churn. Unlike DEX trades (which can be large and infrequent), x402 payments are structurally small (<$5) and frequent. An AI agent reading 50 articles/hour generates 50 USDC transactions. This is categorically different from prior velocity drivers.

We estimate x402 now contributes 0.8 velocity points to Base's 4.2x reading. As x402 adoption grows, expect velocity to continue its climb independent of market conditions.`,
    priceUsdc: 0.75,
    category: "Economics",
    publishedAt: "2026-05-28",
    tags: ["USDC", "economics", "DeFi", "stablecoins"],
  },
  {
    id: "art-007",
    title: "Autonomous AI Research: How Agents Will Replace Analyst Subscriptions",
    author: "Thomas Nguyen",
    authorAddress: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    teaser: "Bloomberg Terminal costs $27,000/year. Pitch Intelligence is $10,000/year. An AI research agent with...",
    content: `Bloomberg Terminal costs $27,000/year. Pitch Intelligence is $10,000/year. An AI research agent with x402 access costs $0 upfront and $0.10-$2.00 per research task. This is a structural shift, not an incremental improvement.

**The Current Research Subscription Model**

Professional research is sold in annual subscriptions because:
1. Distribution costs (sales team, enterprise contracts)
2. Usage is lumpy (periods of intense use followed by nothing)
3. Bundling: subscribers pay for the whole library to access 5% of it

x402 inverts all three:
1. Distribution is free—HTTP is free
2. Pay per query: intense use periods cost more, idle periods cost nothing
3. Unbundled: pay only for content consumed

**What an AI Research Agent Actually Does**

A well-designed research agent doesn't just answer queries—it:
1. Identifies relevant sources across the x402 content ecosystem
2. Evaluates source quality and potential bias
3. Pays to unlock high-quality content
4. Cross-references claims across sources
5. Synthesizes findings with citations
6. Flags uncertainty and conflicting information

The agent I've been testing (Claude-based, Base Account funded) can execute a research task on par with a junior analyst in 90 seconds for under $1.50 in content fees.

**The Analyst Displacement Question**

This is politically fraught, so let's be direct: yes, some analyst roles will be displaced. The ones most at risk:
- Data aggregation and normalization (fully automatable)
- Standard report generation (largely automatable)
- Monitoring/alerting (already mostly automated)

The ones least at risk:
- Primary source development (relationship-based)
- Judgment calls with significant downside risk
- Regulatory/compliance interpretation
- Novel analytical framework development

**The x402 Marketplace That's Emerging**

What's interesting is x402 doesn't just enable agents to consume research—it enables a new class of research producers. Analysts who previously couldn't monetize their work without a publisher can now deploy x402-gated content directly. The "independent analyst" becomes a viable business model at scale.

Early data: the top 100 independent analysts on emerging x402 content platforms are averaging $8,000-$45,000/month in content fees. This is real money, and it's growing 25% month-over-month.`,
    priceUsdc: 0.60,
    category: "AI Research",
    publishedAt: "2026-05-26",
    tags: ["AI agents", "research", "x402", "automation"],
  },
  {
    id: "art-008",
    title: "Zero-Knowledge Proofs for Content Authenticity: The Next Frontier for x402",
    author: "Keiko Tanaka",
    authorAddress: "0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    teaser: "The x402 protocol solves payment. It doesn't solve authenticity. When an agent pays for content,...",
    content: `The x402 protocol solves payment. It doesn't solve authenticity. When an agent pays for content, how does it know the content wasn't modified in transit? How does it know the content matches what was advertised? ZK proofs are the answer.

**The Authenticity Problem**

In the current x402 flow:
1. Client requests content
2. Server demands payment
3. Client pays and receives content

Nothing in this flow proves:
- The content received matches what was advertised in the 402 response
- The content wasn't modified by a MITM
- The content was actually produced by the claimed author
- The content hasn't been sold to other parties under exclusivity claims

For humans, social reputation handles most of this. For AI agents processing millions of x402 transactions, we need cryptographic guarantees.

**ZK Proofs + x402: The Design**

Here's a proposed extension to the x402 spec:

1. **Content commitment**: When publishing, creator signs H(content) and posts to Base. This is cheap—one transaction, costs $0.001.

2. **ZK delivery proof**: When delivering content after payment, server generates a ZK proof that the delivered bytes satisfy the committed hash, without revealing the content to anyone not holding the payment proof.

3. **Verification**: Client verifies the ZK proof before trusting the content. Total verification time: ~50ms with current tooling.

**What This Enables**

- **Atomic swaps**: Payment and content delivery become atomic—either both happen or neither does
- **Selective disclosure**: Creator can prove content satisfies a predicate ("this article mentions USDC") without revealing the content to non-paying readers
- **Reputation without identity**: Creators build verifiable track records based on content commitments, without doxxing themselves
- **Agent trust hierarchies**: Agent A can prove to Agent B that it received authentic content from source X, enabling information markets between agents

**Current State of the Art**

This is still research-stage for x402 specifically, but the ZK primitives exist:
- Halo2 for efficient recursive proofs
- Groth16 for constant-time verification
- Base has native precompiles for BN254 curve operations (used by Groth16)

Estimated path to production: 18-24 months, with early experimental implementations in 6-12 months. The team at ZKContent Labs is furthest along—watch for their testnet announcement.`,
    priceUsdc: 0.45,
    category: "Protocol",
    publishedAt: "2026-05-24",
    tags: ["ZK proofs", "x402", "cryptography", "authenticity"],
  },
  {
    id: "art-009",
    title: "Building a 10x Developer Experience: Lessons from 1000 x402 Integrations",
    author: "Raj Patel",
    authorAddress: "0xc3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    teaser: "We analyzed 1000 x402 integration attempts across GitHub repos. 73% failed or were abandoned. Here's why...",
    content: `We analyzed 1000 x402 integration attempts across GitHub repos. 73% failed or were abandoned. Here's why, and how to fix it.

**The 73% Problem**

We pulled every public GitHub repo with x402-related dependencies from the last 12 months and categorized their status:
- 27% shipped and operational
- 19% abandoned mid-integration
- 31% stuck at payment verification step
- 23% technically integrated but broken (payment succeeds, content delivery fails)

The patterns in the failures are consistent enough to be a product problem, not a developer problem.

**Top Failure Points**

**1. Payment verification ambiguity (affects 54% of failures)**
The spec is underspecified on what constitutes valid payment proof. Implementations diverge. The most common bug: treating the X-PAYMENT header as an opaque blob rather than a structured proof. Fix: the spec needs a reference implementation for verification.

**2. Race conditions in payment flow (31%)**
The 402 → pay → retry flow has a race condition: what if the payment confirms but the retry happens before the server sees the confirmation? Devs need exponential backoff + idempotency keys. Neither is mentioned in the spec.

**3. Hardcoded amounts breaking on USDC decimal handling (28%)**
USDC has 6 decimal places. "1.00 USDC" is 1,000,000 in contract terms. Devs who hardcode string amounts without parsing get subtle bugs that only surface at payment verification.

**4. Missing error semantics (22%)**
What should a server return if the payment amount is correct but the recipient address is wrong? If the payment is for an expired content offer? Current spec says "4xx" but doesn't specify which 4xx or what the body should look like.

**The 10x DX Improvements**

1. **SDK-first**: Provide official SDKs in TypeScript, Python, Go. Don't make devs read the spec to get started.
2. **Local simulation**: A Docker image that simulates x402 flows without real payments. Critical for development.
3. **Error catalog**: Every possible failure mode with HTTP status codes and structured error bodies.
4. **Idempotency keys**: Bake into the spec, make it required, provide reference implementation.
5. **Test harness**: A hosted service that sends 402s with predictable payment requirements for testing.

The protocol is sound. The developer experience is the blocker. Fix DX and x402 adoption will accelerate dramatically.`,
    priceUsdc: 0.30,
    category: "Developer",
    publishedAt: "2026-05-22",
    tags: ["developer experience", "x402", "SDK", "integration"],
  },
  {
    id: "art-010",
    title: "The Future of Work: When AI Agents Are Your Colleagues, Not Your Tools",
    author: "Priya Mehta",
    authorAddress: "0xd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    teaser: "The framing of AI as a \"tool\" is becoming obsolete. When an AI agent has its own wallet, spends money...",
    content: `The framing of AI as a "tool" is becoming obsolete. When an AI agent has its own wallet, spends money autonomously, produces economic output, and coordinates with other agents—what is it?

**The Colleague Mental Model**

Consider what makes something a "colleague" vs. a "tool":
- A hammer is a tool. It has no agency, no preferences, no ability to surprise you.
- A freelance designer is a colleague. They have agency, preferences, can push back, and you collaborate.

Current AI agents in 2026 sit in an interesting middle ground:
- They have agency (can take actions in the world)
- They have preferences (shaped by training and system prompts)
- They can push back (Claude will refuse harmful requests)
- They surprise you (emergent capabilities, unexpected approaches)
- They have economic standing (wallets, spending budgets)

The tool framing is becoming strained.

**Economic Agency Changes Everything**

The wallet is the key. An AI agent with a funded Base Account can:
1. Be hired for a task (receive payment)
2. Hire other agents (make payments)
3. Purchase resources autonomously (x402)
4. Build a reputation based on work quality
5. Have its "income" tracked and audited

This is economically closer to a contractor than a tool. The legal and tax implications are unresolved, but the economic reality is already here.

**What This Means for Org Design**

Companies are already restructuring around this:

- **Coinbase's Agent Ops team**: 8 humans managing 200+ AI agents. Agents handle customer support routing, fraud pattern analysis, and regulatory monitoring. Humans handle escalations and policy.

- **Stripe's automated reconciliation**: An agent team processes $2B in daily transactions, paying for x402 financial data feeds to supplement internal data. Zero human involvement in routine cases.

- **The DAO structure**: Some DAOs now have AI agents as voting members with defined governance roles. The Maker Foundation gave an experimental AI agent a $1M budget and governance rights. It's outperforming human committee members on routine parameter votes.

**The Trust Problem**

Here's the unresolved tension: AI colleagues require different trust mechanisms than human colleagues. Humans come with social accountability, legal standing, and reputation built over years. AI agents have none of these natively.

What we need (and don't fully have yet): cryptographic reputation systems where an agent's track record is provably tied to its onchain identity. An agent with 10,000 successful x402 transactions and no fraud attempts should be able to prove this credibly.

That's the infrastructure gap. Everything else is largely ready.`,
    priceUsdc: 0.55,
    category: "Future of Work",
    publishedAt: "2026-05-20",
    tags: ["AI agents", "future of work", "autonomy", "economics"],
  },
];

// Custom articles added at runtime via the publish form
let customArticles: Article[] = [];

export function getAllArticles(): Article[] {
  return [...ARTICLES, ...customArticles];
}

export function getArticleById(id: string): Article | undefined {
  return getAllArticles().find((a) => a.id === id);
}

export function addCustomArticle(article: Article): void {
  customArticles.push(article);
}
