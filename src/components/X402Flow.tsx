"use client";

import { useState, useEffect } from "react";
import { X402FlowStep } from "@/lib/x402";

interface X402FlowProps {
  steps: X402FlowStep[];
  onComplete: () => void;
}

const statusColor = (status: number | null) => {
  if (!status) return "text-zinc-400";
  if (status === 200) return "text-emerald-400";
  if (status === 402) return "text-amber-400";
  return "text-red-400";
};

const directionIcon = (direction: X402FlowStep["direction"]) => {
  if (direction === "request") return "→";
  if (direction === "response") return "←";
  return "⚙";
};

const directionColor = (direction: X402FlowStep["direction"]) => {
  if (direction === "request") return "text-sky-400";
  if (direction === "response") return "text-violet-400";
  return "text-amber-400";
};

export default function X402Flow({ steps, onComplete }: X402FlowProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const delay = visibleSteps === 0 ? 200 : 600;
      const t = setTimeout(() => {
        setVisibleSteps((v) => v + 1);
      }, delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setComplete(true);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [visibleSteps, steps.length]);

  const currentStep = steps[visibleSteps - 1];
  const stepNumber =
    visibleSteps > 0 ? steps[visibleSteps - 1]?.step ?? 0 : 0;

  return (
    <div className="font-mono text-xs bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
        <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
        <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
        <span className="ml-2 text-zinc-400 text-xs">x402 Protocol Trace</span>
        <span className="ml-auto text-zinc-600 text-xs">base-mainnet</span>
      </div>

      {/* Steps */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {steps.slice(0, visibleSteps).map((step, i) => (
          <div
            key={i}
            className="animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            {/* Step divider */}
            {i === 0 ||
              (steps[i - 1]?.step !== step.step && (
                <div className="flex items-center gap-2 mb-2 mt-3">
                  <div className="flex-1 h-px bg-zinc-800"></div>
                  <span className="text-zinc-500 text-xs">
                    Step {step.step}
                  </span>
                  <div className="flex-1 h-px bg-zinc-800"></div>
                </div>
              ))}

            <div
              className={`flex items-start gap-2 ${directionColor(step.direction)}`}
            >
              <span className="mt-0.5 w-4 shrink-0">
                {directionIcon(step.direction)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {step.status && (
                    <span
                      className={`font-bold ${statusColor(step.status)}`}
                    >
                      {step.status}
                    </span>
                  )}
                  <span className="text-zinc-200 truncate">{step.label}</span>
                </div>

                {/* Headers */}
                {step.headers != null ? (
                  <div className="mt-1 pl-2 border-l border-zinc-800">
                    {Object.entries(step.headers).map(([k, v]) => (
                      <div key={k} className="text-zinc-500 truncate">
                        <span className="text-zinc-400">{k}:</span>{" "}
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Body */}
                {step.body !== undefined ? (
                  <div className="mt-1 pl-2 border-l border-zinc-700">
                    <pre className="text-zinc-300 text-xs overflow-x-auto whitespace-pre-wrap break-all max-h-32">
                      {JSON.stringify(step.body, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {!complete && visibleSteps < steps.length && (
          <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
            <span>▸</span>
            <span>Processing...</span>
          </div>
        )}

        {/* Complete */}
        {complete && (
          <div className="mt-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span>✓</span>
              <span>Payment verified. Content unlocked.</span>
            </div>
            <button
              onClick={onComplete}
              className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Read Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
