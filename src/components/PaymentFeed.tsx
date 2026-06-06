"use client";

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

interface PaymentFeedProps {
  events: PaymentEvent[];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function PaymentFeed({ events }: PaymentFeedProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <h2 className="text-zinc-200 text-sm font-semibold">Live Payment Feed</h2>
        <span className="ml-auto text-zinc-600 text-xs font-mono">base-mainnet</span>
      </div>

      <div className="divide-y divide-zinc-800/50 max-h-[calc(100vh-200px)] overflow-y-auto">
        {events.length === 0 && (
          <div className="px-4 py-8 text-center text-zinc-600 text-sm">
            <div className="text-2xl mb-2">💳</div>
            <div>Payments will appear here</div>
            <div className="text-xs mt-1 text-zinc-700">Unlock an article to see x402 in action</div>
          </div>
        )}

        {[...events].reverse().map((event) => (
          <div
            key={event.id}
            className="px-4 py-3 animate-in slide-in-from-top-1 fade-in duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                {event.source === "agent" ? (
                  <span className="text-violet-400 text-xs font-medium px-1.5 py-0.5 bg-violet-500/10 rounded border border-violet-500/20">
                    🤖 Agent
                  </span>
                ) : (
                  <span className="text-sky-400 text-xs font-medium px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-500/20">
                    👤 Human
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold shrink-0">
                +{event.amount.toFixed(2)} USDC
              </div>
            </div>

            <p className="text-zinc-300 text-xs mt-1.5 line-clamp-1">
              {event.articleTitle}
            </p>

            <div className="flex items-center gap-2 mt-1.5 text-zinc-600 text-xs font-mono">
              <span>{shortAddr(event.payer)}</span>
              <span>→</span>
              <span>{shortAddr(event.payee)}</span>
            </div>

            <div className="flex items-center justify-between mt-1">
              <span className="text-zinc-700 text-xs font-mono">
                {event.txHash.slice(0, 10)}...
              </span>
              <span className="text-zinc-700 text-xs">
                {formatTime(event.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-800 text-zinc-600 text-xs font-mono flex justify-between">
          <span>{events.length} payments</span>
          <span>
            {events.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} USDC total
          </span>
        </div>
      )}
    </div>
  );
}
