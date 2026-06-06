"use client";

import { useState, useRef, useEffect } from "react";
import { X402FlowStep } from "@/lib/x402";

interface AgentPayment {
  articleId: string;
  articleTitle: string;
  amount: number;
  txHash: string;
  flowTrace: X402FlowStep[];
}

interface PaymentEvent {
  id: string;
  articleId: string;
  articleTitle: string;
  amount: number;
  txHash: string;
  payer: string;
  payee: string;
  timestamp: string;
  source: "human" | "agent";
}

interface ResearchAgentProps {
  onPayment: (event: PaymentEvent) => void;
}

type AgentState = "idle" | "running" | "done" | "error";

const TOPICS = [
  "AI trends and agentic commerce",
  "x402 protocol and developer ecosystem",
  "Base network economics and USDC velocity",
  "Future of AI agents in the workforce",
];

export default function ResearchAgent({ onPayment }: ResearchAgentProps) {
  const [state, setState] = useState<AgentState>("idle");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [thinking, setThinking] = useState<string[]>([]);
  const [report, setReport] = useState<string>("");
  const [payments, setPayments] = useState<AgentPayment[]>([]);
  const [error, setError] = useState<string>("");
  const [totalSpent, setTotalSpent] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thinking, report]);

  async function runAgent() {
    setState("running");
    setThinking([]);
    setReport("");
    setPayments([]);
    setError("");
    setTotalSpent(0);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok || !res.body) {
        const err = await res.text();
        throw new Error(err || "Agent request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "thinking") {
              setThinking((prev) => [...prev, event.text]);
            } else if (event.type === "text") {
              setReport(event.text);
            } else if (event.type === "payment") {
              const payment: AgentPayment = {
                articleId: event.articleId,
                articleTitle: event.articleTitle,
                amount: event.amount,
                txHash: event.txHash,
                flowTrace: event.flowTrace,
              };
              setPayments((prev) => [...prev, payment]);
              setTotalSpent((prev) => prev + event.amount);

              // Emit to global payment feed
              onPayment({
                id: event.txHash.slice(0, 10),
                articleId: event.articleId,
                articleTitle: event.articleTitle,
                amount: event.amount,
                txHash: event.txHash,
                payer: "0xDeAdBeEf1234567890AbCdEf1234567890AbCdEf",
                payee: "0x0000000000000000000000000000000000000000",
                timestamp: new Date().toISOString(),
                source: "agent",
              });
            } else if (event.type === "done") {
              setState("done");
            } else if (event.type === "error") {
              throw new Error(event.message);
            }
          } catch (parseErr) {
            // Skip malformed events
          }
        }
      }

      if (state !== "done") setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent failed");
      setState("error");
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${state === "running" ? "bg-violet-500/20 animate-pulse" : "bg-violet-500/10"}`}
          >
            🤖
          </div>
          <div>
            <h2 className="text-zinc-100 font-semibold text-sm">
              Research Agent
            </h2>
            <p className="text-zinc-500 text-xs">
              Powered by Claude · Pays via x402 on Base
            </p>
          </div>
          {state === "done" && (
            <div className="ml-auto flex items-center gap-2 text-emerald-400 text-xs font-medium">
              <span>✓ Done</span>
              <span className="text-zinc-600">·</span>
              <span className="text-amber-400 font-mono">
                {totalSpent.toFixed(2)} USDC spent
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {state === "idle" && (
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-2">
              Research Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-3 text-zinc-500 text-xs space-y-1">
            <div className="text-zinc-400 font-medium mb-1">
              What the agent will do:
            </div>
            <div>1. Browse all available premium articles</div>
            <div>2. Select relevant ones for the topic</div>
            <div>3. Pay for each via x402 on Base mainnet</div>
            <div>4. Synthesize a research report</div>
          </div>

          <button
            onClick={runAgent}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Run Research Agent</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Running state */}
      {(state === "running" || state === "done") && (
        <div className="p-5 space-y-4">
          {/* Payments made */}
          {payments.length > 0 && (
            <div>
              <div className="text-zinc-400 text-xs font-medium mb-2">
                x402 Payments ({payments.length})
              </div>
              <div className="space-y-2">
                {payments.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs bg-zinc-800/50 rounded-lg px-3 py-2"
                  >
                    <span className="text-emerald-400">✓</span>
                    <span className="text-zinc-300 flex-1 truncate">
                      {p.articleTitle}
                    </span>
                    <span className="text-amber-400 font-mono shrink-0">
                      {p.amount.toFixed(2)} USDC
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thinking stream */}
          {thinking.length > 0 && (
            <div>
              <div className="text-zinc-400 text-xs font-medium mb-2">
                Agent Reasoning
              </div>
              <div className="bg-zinc-800/30 rounded-lg p-3 max-h-48 overflow-y-auto">
                {thinking.map((t, i) => (
                  <p key={i} className="text-zinc-400 text-xs mb-1 leading-relaxed">
                    {t}
                  </p>
                ))}
                {state === "running" && (
                  <span className="inline-block w-1.5 h-3 bg-violet-400 animate-pulse rounded-sm ml-0.5"></span>
                )}
              </div>
            </div>
          )}

          {/* Report */}
          {report && (
            <div>
              <div className="text-zinc-400 text-xs font-medium mb-2">
                Research Report
              </div>
              <div className="bg-zinc-800/30 rounded-lg p-4 text-zinc-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                {report.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="text-zinc-100 text-base font-bold mb-2">
                        {line.slice(2)}
                      </h1>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-zinc-200 text-sm font-semibold mt-3 mb-1">
                        {line.slice(3)}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-zinc-200 text-sm font-medium mt-2 mb-1">
                        {line.slice(4)}
                      </h3>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <li key={i} className="text-zinc-400 text-xs ml-3 mb-0.5">
                        {line.slice(2)}
                      </li>
                    );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-semibold text-zinc-200 text-xs">
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  if (line.trim() === "") return <div key={i} className="h-1"></div>;
                  return (
                    <p key={i} className="text-zinc-400 text-xs mb-1">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={bottomRef} />

          {state === "done" && (
            <button
              onClick={() => setState("idle")}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
            >
              Run Again
            </button>
          )}
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="p-5 space-y-3">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error || "Agent encountered an error. Is ANTHROPIC_API_KEY set?"}
          </div>
          <button
            onClick={() => setState("idle")}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
