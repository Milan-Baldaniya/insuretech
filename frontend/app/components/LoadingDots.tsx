"use client";

import { memo, useEffect, useRef, useState } from "react";

const STAGES = [
  { text: "Understanding your question", duration: 2500 },
  { text: "Searching knowledge base",    duration: 3500 },
  { text: "Analyzing relevant documents", duration: 4000 },
  { text: "Preparing your answer",        duration: 0 },
];

function ThinkingIndicator() {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    let elapsed = 0;
    for (let i = 1; i < STAGES.length; i++) {
      const prevDuration = STAGES[i - 1].duration;
      if (prevDuration === 0) break;
      elapsed += prevDuration;
      timersRef.current.push(setTimeout(() => setStage(i), elapsed));
    }

    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const progress = ((stage + 1) / STAGES.length) * 100;

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3"
      }`}
    >
      <div className="mx-auto w-full max-w-4xl">
        <div
          className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.9) 100%)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)",
          }}
        >
          {/* Top shimmer accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
            <div
              className="h-full w-[200%] animate-[shimmer_2s_ease-in-out_infinite]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent-primary), rgba(99,145,255,0.6), var(--accent-primary), transparent)",
              }}
            />
          </div>

          <div className="px-5 py-4 flex items-center gap-4">
            {/* Animated orb */}
            <div className="relative flex-shrink-0 w-10 h-10">
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full animate-[orbPulse_2.4s_ease-in-out_infinite]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(var(--accent-primary-rgb, 0,123,229), 0.15) 0%, transparent 70%)",
                }}
              />
              {/* Middle ring */}
              <div
                className="absolute inset-[6px] rounded-full animate-[orbSpin_3s_linear_infinite]"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "var(--accent-primary)",
                  borderRightColor: "rgba(var(--accent-primary-rgb, 0,123,229), 0.3)",
                }}
              />
              {/* Inner core */}
              <div
                className="absolute inset-[12px] rounded-full animate-[orbPulse_1.8s_ease-in-out_infinite_0.3s]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-primary), rgba(99,145,255,0.9))",
                  boxShadow: "0 0 12px rgba(var(--accent-primary-rgb, 0,123,229), 0.4)",
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Stage text with crossfade */}
              <div className="relative h-5 overflow-hidden">
                {STAGES.map((s, i) => (
                  <span
                    key={i}
                    className="absolute left-0 top-0 whitespace-nowrap text-[13.5px] font-medium transition-all duration-500 ease-out"
                    style={{
                      color: "var(--text-primary)",
                      opacity: i === stage ? 1 : 0,
                      transform: `translateY(${
                        i === stage ? "0" : i < stage ? "-100%" : "100%"
                      })`,
                    }}
                  >
                    {s.text}
                  </span>
                ))}
              </div>

              {/* Progress track */}
              <div className="mt-2.5 flex items-center gap-3">
                <div
                  className="flex-1 h-[3px] rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border-subtle)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: `${progress}%`,
                      background:
                        "linear-gradient(90deg, var(--accent-primary), rgba(99,145,255,0.85))",
                    }}
                  >
                    {/* Gloss shimmer on the bar */}
                    <div
                      className="absolute inset-0 animate-[barShimmer_1.5s_ease-in-out_infinite]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-[11px] font-semibold tabular-nums tracking-wide transition-all duration-500"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stage + 1}/{STAGES.length}
                </span>
              </div>
            </div>

            {/* Trailing animated dots */}
            <div className="flex-shrink-0 flex items-center gap-[5px] pl-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block rounded-full animate-[dotBounce_1.4s_ease-in-out_infinite]"
                  style={{
                    width: 5,
                    height: 5,
                    backgroundColor: "var(--accent-primary)",
                    opacity: 0.7,
                    animationDelay: `${i * 160}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes orbPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
        @keyframes orbSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes dotBounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          40% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
        @keyframes barShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default memo(ThinkingIndicator);
