"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "AI Research",
  "Protocol",
  "Market Data",
  "Developer",
  "Economics",
  "Future of Work",
  "Other",
];

export default function PublishPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    priceUsdc: "0.25",
    category: "AI Research",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          priceUsdc: parseFloat(form.priceUsdc),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Publish failed");
      setStatus("success");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const priceNum = parseFloat(form.priceUsdc) || 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back</span>
          </Link>
          <div className="w-px h-4 bg-zinc-700 mx-1" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center text-xs">⬡</div>
            <span className="text-sm font-semibold">Publish to x402 Paywall</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Publish Premium Content</h1>
          <p className="text-zinc-400 text-sm">
            Set a USDC price. Readers (and AI agents) pay via x402 to unlock your content on Base.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <div className="text-3xl mb-2">✓</div>
            <div className="text-emerald-400 font-semibold">Published!</div>
            <div className="text-zinc-400 text-sm mt-1">Redirecting to feed...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="The Future of Onchain Commerce..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500 placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="Your name or pseudonym"
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500 placeholder-zinc-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                  Price (USDC)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                  <input
                    type="number"
                    min="0.01"
                    max="5.00"
                    step="0.01"
                    required
                    value={form.priceUsdc}
                    onChange={(e) => setForm((f) => ({ ...f, priceUsdc: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <p className="mt-1 text-zinc-600 text-xs">
                  Min $0.01, max $5.00 USDC. Lower prices get more AI agent reads.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-medium mb-1.5">
                Content *
              </label>
              <textarea
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your premium content here. The first ~120 characters will be shown as a teaser to non-paying readers..."
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-violet-500 placeholder-zinc-600 resize-none"
              />
              <p className="mt-1 text-zinc-600 text-xs">
                {form.content.length} chars · Teaser: first ~120 chars
              </p>
            </div>

            {/* Preview */}
            {form.title && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="text-zinc-500 text-xs font-medium mb-3">Preview</div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {form.category}
                  </span>
                  <span className="text-amber-400 font-mono text-sm font-bold shrink-0">
                    ${priceNum.toFixed(2)} USDC
                  </span>
                </div>
                <h3 className="text-zinc-100 font-semibold text-sm mb-1">
                  {form.title || "Your Title"}
                </h3>
                <p className="text-zinc-500 text-xs mb-2">{form.author || "Author"}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {form.content.slice(0, 120)}{form.content.length > 120 ? "..." : ""}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {status === "submitting" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>Publish for ${priceNum.toFixed(2)} USDC</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
