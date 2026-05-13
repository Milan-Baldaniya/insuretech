"use client";

import { memo, useEffect, useRef, useState } from "react";

const STAGES = [
  { text: "Understanding your question", icon: "💭", duration: 2500 },
  { text: "Searching knowledge base",    icon: "🔍", duration: 3500 },
  { text: "Analyzing relevant documents", icon: "📄", duration: 4000 },
  { text: "Preparing your answer",        icon: "✍️", duration: 0 },
];

function ThinkingIndicator() {
  const [stage, setStage] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    let elapsed = 0;
    for (let i = 1; i < STAGES.length; i++) {
      const prevDuration = STAGES[i - 1].duration;
      if (prevDuration === 0) break;
      elapsed += prevDuration;
      timersRef.current.push(setTimeout(() => setStage(i), elapsed));
    }
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const current = STAGES[stage];
  const progress = ((stage + 1) / STAGES.length) * 100;

  return (
    <div className="mx-auto w-full max-w-4xl animate-[fadeInUp_0.5s_ease-out]">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes morphOrb {
          0%, 100% {
            border-radius: 42% 58% 60% 40% / 50% 45% 55% 50%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 55% 45% 40% 60% / 60% 50% 50% 40%;
            transform: rotate(90deg) scale(1.08);
          }
          50% {
            border-radius: 45% 55% 55% 45% / 40% 60% 40% 60%;
            transform: rotate(180deg) scale(0.95);
          }
          75% {
            border-radius: 60% 40% 50% 50% / 55% 40% 60% 45%;
            transform: rotate(270deg) scale(1.05);
          }
        }
        @keyframes orbGlow {
          0%, 100% { box-shadow: 0 0 18px 4px rgba(0,123,229,0.25), inset 0 0 12px rgba(255,255,255,0.15); }
          50%       { box-shadow: 0 0 28px 8px rgba(0,123,229,0.35), inset 0 0 16px rgba(255,255,255,0.25); }
        }
        @keyframes orbColorShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.6); opacity: 0; }
        }
        @keyframes textSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes trackGlow {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="flex items-start gap-4">
        {/* Morphing Gradient Orb */}
        <div className="relative flex-shrink-0 mt-0.5" style={{ width: 38, height: 38 }}>
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary), #6366f1)",
              animation: "ringPulse 2.4s ease-out infinite",
            }}
          />
          {/* Main orb */}
          <div
            className="absolute inset-[3px]"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary), #818cf8, #06b6d4, var(--accent-primary))",
              backgroundSize: "300% 300%",
              animation: "morphOrb 6s ease-in-out infinite, orbGlow 3s ease-in-out infinite, orbColorShift 4s ease-in-out infinite",
            }}
          />
          {/* Inner highlight */}
          <div
            className="absolute inset-[7px] rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35), transparent 60%)",
            }}
          />
        </div>

        {/* Text + Progress */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Stage text */}
          <div
            key={stage}
            className="flex items-center gap-2"
            style={{ animation: "textSlideIn 0.4s ease-out" }}
          >
            <span className="text-base leading-none">{current.icon}</span>
            <span className="text-[13.5px] font-medium text-[var(--text-primary)]">
              {current.text}
            </span>
            {/* Bouncing dots */}
            <span className="inline-flex items-center gap-[3px] ml-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-[4px] w-[4px] rounded-full bg-[var(--accent-primary)]"
                  style={{
                    animation: "dotBounce 1.4s ease-in-out infinite",
                    animationDelay: `${i * 160}ms`,
                  }}
                />
              ))}
            </span>
          </div>

          {/* Unique Progress Bar */}
          <div className="mt-3 relative h-[5px] rounded-full overflow-hidden bg-[var(--border-subtle)]/40"
               style={{ background: "rgba(0,0,0,0.06)" }}>
            {/* Shimmer track */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 50%, transparent)",
                backgroundSize: "200% 100%",
                animation: "trackGlow 2s linear infinite",
              }}
            />
            {/* Active fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--accent-primary), #818cf8, #06b6d4)",
                backgroundSize: "200% 100%",
                animation: "orbColorShift 3s ease-in-out infinite",
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 12px rgba(0,123,229,0.4), 0 0 4px rgba(99,102,241,0.3)",
              }}
            />
            {/* Leading glow dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-[11px] w-[11px] rounded-full"
              style={{
                left: `calc(${progress}% - 5.5px)`,
                background: "radial-gradient(circle, #fff 30%, var(--accent-primary) 70%)",
                boxShadow: "0 0 10px 2px rgba(0,123,229,0.5)",
                transition: "left 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* Stage counter */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] font-medium text-[var(--text-muted)] tracking-wide uppercase">
              Step {stage + 1} of {STAGES.length}
            </span>
            <span className="text-[11px] font-semibold text-[var(--accent-primary)] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ThinkingIndicator);
