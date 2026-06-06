"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllArticles, Article } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import PaymentFeed from "@/components/PaymentFeed";
import ResearchAgent from "@/components/ResearchAgent";

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

const CATEGORIES = ["All", "AI Research", "Protocol", "Market Data", "Developer", "Economics", "Future of Work"];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [paymentEvents, setPaymentEvents] = useState<PaymentEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAgent, setShowAgent] = useState(false);

  useEffect(() => {
    setArticles(getAllArticles());
  }, []);

  const filtered =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  function addPayment(event: PaymentEvent) {
    setPaymentEvents((prev) => [...prev, event]);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-sm">
              ⬡
            </div>
            <span className="font-bold text-zinc-100 text-sm">x402 Paywall</span>
            <span className="hidden sm:inline text-zinc-600 text-xs px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-full">
              Base · USDC · Powered by x402
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/publish"
              className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
            >
              + Publish
            </Link>
            <button
              onClick={() => setShowAgent((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                showAgent
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-zinc-100"
              }`}
            >
              🤖 Research Agent
            </button>
          </div>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="border-b border-zinc-800 bg-gradient-to-r from-violet-950/30 via-zinc-950 to-sky-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium rounded-full">
                Base Hackathon 2026
              </span>
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                x402 Protocol
              </span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-100 leading-tight mb-3">
              Premium content, unlocked by USDC micropayments
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every article is gated by the{" "}
              <span className="text-violet-400 font-medium">x402 protocol</span>. Humans pay to unlock.
              AI agents browse, pay, and synthesize research — all autonomously on{" "}
              <span className="text-sky-400 font-medium">Base</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Agent panel (inline, collapsible) */}
            {showAgent && (
              <div className="mb-6">
                <ResearchAgent onPayment={addPayment} />
              </div>
            )}

            {/* Category filter */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                    selectedCategory === cat
                      ? "bg-zinc-100 border-zinc-100 text-zinc-900"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-zinc-600 text-xs">
                {filtered.length} articles
              </span>
            </div>

            {/* Article grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onPayment={addPayment}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-zinc-600">
                <div className="text-4xl mb-3">📭</div>
                <div className="text-sm">No articles in this category yet</div>
              </div>
            )}
          </div>

          {/* Right sidebar: payment feed */}
          <div className="w-72 shrink-0 hidden xl:block">
            <div className="sticky top-20">
              <PaymentFeed events={paymentEvents} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile payment feed */}
      <div className="xl:hidden border-t border-zinc-800 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <PaymentFeed events={paymentEvents} />
        </div>
      </div>
    </div>
  );
}
