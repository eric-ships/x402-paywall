"use client";

import { useState } from "react";
import { Article } from "@/lib/articles";
import { X402FlowStep } from "@/lib/x402";
import X402Flow from "./X402Flow";

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

interface ArticleCardProps {
  article: Article;
  onPayment: (event: PaymentEvent) => void;
}

type State =
  | "locked"
  | "requesting"
  | "flow"
  | "reading"
  | "error";

const categoryColors: Record<string, string> = {
  "AI Research": "bg-violet-500/10 text-violet-300 border-violet-500/20",
  Protocol: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  "Market Data": "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  Developer: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  Economics: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  "Future of Work": "bg-orange-500/10 text-orange-300 border-orange-500/20",
};

export default function ArticleCard({ article, onPayment }: ArticleCardProps) {
  const [state, setState] = useState<State>("locked");
  const [flowSteps, setFlowSteps] = useState<X402FlowStep[]>([]);
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  const catClass =
    categoryColors[article.category] ??
    "bg-zinc-500/10 text-zinc-300 border-zinc-500/20";

  async function handleUnlock() {
    setState("requesting");
    setError("");
    try {
      // First request: should return 402
      const res1 = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, paid: false }),
      });

      if (res1.status !== 402) {
        throw new Error("Expected 402 response");
      }

      // Show the x402 flow modal
      // Second request: pay and get content
      const res2 = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: article.id, paid: true }),
      });

      const data = await res2.json();
      if (!res2.ok) throw new Error(data.error ?? "Payment failed");

      setFlowSteps(data.flowTrace);
      setContent(data.content);
      onPayment(data.paymentEvent);
      setState("flow");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${catClass}`}
          >
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-amber-400 font-mono text-sm font-bold shrink-0">
            <span className="text-xs">$</span>
            {article.priceUsdc.toFixed(2)}
            <span className="text-xs text-zinc-500 font-normal ml-0.5">
              USDC
            </span>
          </div>
        </div>

        <h3 className="text-zinc-100 font-semibold text-base leading-snug mb-2">
          {article.title}
        </h3>

        <p className="text-zinc-500 text-sm">
          {article.author} · {article.publishedAt}
        </p>
      </div>

      {/* Content area */}
      <div className="px-5 pb-5">
        {state === "locked" && (
          <>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              {article.teaser}
            </p>
            <button
              onClick={handleUnlock}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-violet-600 border border-zinc-700 hover:border-violet-500 text-zinc-200 hover:text-white rounded-lg text-sm font-medium transition-all group"
            >
              <svg
                className="w-4 h-4 text-zinc-500 group-hover:text-violet-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Unlock for {article.priceUsdc.toFixed(2)} USDC
            </button>
          </>
        )}

        {state === "requesting" && (
          <div className="flex items-center gap-3 py-4 text-zinc-400">
            <svg
              className="w-5 h-5 animate-spin text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm">Initiating x402 payment flow...</span>
          </div>
        )}

        {state === "flow" && (
          <div className="mt-2">
            <X402Flow
              steps={flowSteps}
              onComplete={() => setState("reading")}
            />
          </div>
        )}

        {state === "reading" && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                Unlocked
              </span>
            </div>
            <div
              className={`text-zinc-300 text-sm leading-relaxed space-y-3 overflow-hidden transition-all duration-300 ${expanded ? "" : "max-h-48"}`}
            >
              {content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {content.length > 400 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-2 text-violet-400 hover:text-violet-300 text-sm"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {state === "error" && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
            <button
              onClick={() => setState("locked")}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
