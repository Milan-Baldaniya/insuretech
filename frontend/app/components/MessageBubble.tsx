"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SourceCitation {
  chunk_id?: string | null;
  document_id?: string | null;
  document_title: string;
  page_start?: number | null;
  page_end?: number | null;
  section_title?: string | null;
  page_number: number | null;
  chunk_preview: string;
  relevance_score: number | null;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
  timestamp: Date;
  attachedDocumentName?: string;
}

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
});

function formatTime(date: Date) {
  try {
    return timeFormatter.format(date);
  } catch {
    return "";
  }
}

function formatPage(src: SourceCitation) {
  if (src.page_start != null && src.page_end != null) {
    return src.page_start === src.page_end
      ? `page ${src.page_start}`
      : `pages ${src.page_start}-${src.page_end}`;
  }
  if (src.page_start != null) return `page ${src.page_start}`;
  if (src.page_number != null) return `page ${src.page_number}`;
  return "";
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  if (isUser) {
    const hasDoc = !!msg.attachedDocumentName;
    const ext = hasDoc
      ? msg.attachedDocumentName!.split(".").pop()?.toLowerCase() ?? ""
      : "";
    const isPdf = ext === "pdf";

    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] md:max-w-[72%] flex flex-col gap-2.5 items-end">

          {/* ── Premium Document Card ── */}
          {hasDoc && (
            <div
              className="flex items-center gap-3.5 rounded-2xl border shadow-md overflow-hidden"
              style={{
                background: isPdf
                  ? "linear-gradient(145deg, #fff8f8 0%, #fff0f0 60%, #ffe4e4 100%)"
                  : "linear-gradient(145deg, #f0f4ff 0%, #e8effe 60%, #dde6ff 100%)",
                borderColor: isPdf ? "#f5c6c6" : "#b8caff",
                width: "220px",
                boxShadow: isPdf
                  ? "0 4px 16px rgba(220,38,38,0.10), 0 1px 4px rgba(0,0,0,0.06)"
                  : "0 4px 16px rgba(59,110,246,0.10), 0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Brand icon block */}
              <div
                className="flex h-full items-center justify-center px-4 py-4 shrink-0"
                style={{
                  background: isPdf
                    ? "linear-gradient(160deg, #e02020 0%, #c00000 100%)"
                    : "linear-gradient(160deg, #2b579a 0%, #185abd 100%)",
                }}
              >
                {isPdf ? (
                  /* Adobe Acrobat PDF logo */
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="6" fill="none"/>
                    {/* White "PDF" style icon */}
                    <path d="M8 6h22l10 10v26a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" fill="white" fillOpacity="0.15"/>
                    <path d="M30 6l10 10H30V6z" fill="white" fillOpacity="0.3"/>
                    <text x="7" y="35" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="0.5">PDF</text>
                    <path d="M8 6h22l10 10" stroke="white" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
                  </svg>
                ) : (
                  /* Microsoft Word W logo */
                  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="6" fill="none"/>
                    {/* Word "W" lettermark */}
                    <text x="3" y="36" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="36" fill="white" letterSpacing="-2">W</text>
                  </svg>
                )}
              </div>

              {/* File details */}
              <div className="min-w-0 flex-1 py-3 pr-4">
                <p
                  className="truncate text-[13px] font-semibold leading-tight"
                  style={{ color: isPdf ? "#991b1b" : "#1e3a8a" }}
                  title={msg.attachedDocumentName}
                >
                  {msg.attachedDocumentName}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      background: isPdf ? "#dc262222" : "#2b579a22",
                      color: isPdf ? "#dc2626" : "#2b579a",
                    }}
                  >
                    {isPdf ? "PDF" : "DOCX"}
                  </span>
                  <span className="text-[11px]" style={{ color: isPdf ? "#dc262266" : "#2b579a66" }}>
                    · Attached for analysis
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User text bubble */}
          {msg.content && (
            <div className="rounded-[24px] bg-[var(--accent-primary)] px-5 py-3.5 text-white shadow-sm">
              <p className="text-[15px] leading-7 whitespace-pre-wrap">{msg.content}</p>
              <p className="mt-2 text-right text-[11px] text-white/60">
                {formatTime(msg.timestamp)}
              </p>
            </div>
          )}

          {/* Timestamp when no text message */}
          {!msg.content && hasDoc && (
            <p className="text-right text-[11px] text-[var(--text-muted)] pr-1">
              {formatTime(msg.timestamp)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Assistant — flat, no box, like ChatGPT/Claude

  // Phase 4 & 5: Detect need for Human Handoff or Grievance Escalation
  const needsHandoff = msg.content.toLowerCase().includes("human agent") || msg.content.toLowerCase().includes("certified advisor");
  const needsEscalation = msg.content.toLowerCase().includes("ombudsman") || msg.content.toLowerCase().includes("bima bharosa") || msg.content.toLowerCase().includes("consumer forum");

  return (
    <div className="animate-fade-in">
      <div className="mx-auto w-full max-w-4xl">
        {/* FinBot label + time */}
        <div className="mb-2 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-primary)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Z" />
              <path d="M2 17c0-2.8 2.2-5 5-5h10c2.8 0 5 2.2 5 5v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">FinBot</span>
          <span className="text-[11px] text-[var(--text-muted)]">{formatTime(msg.timestamp)}</span>
        </div>

        {/* Response content — flat, no border, no box */}
        <div className="markdown-body pl-9 text-[15px] leading-[1.8] text-[var(--text-primary)] md:text-[15.5px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.content}
          </ReactMarkdown>
        </div>

        {/* Source citations */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 pl-9">
            {msg.sources.map((src, i) => (
              <div
                key={`${src.chunk_id ?? src.document_title}-${i}`}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                title={src.chunk_preview}
              >
                <span className="truncate font-semibold text-[var(--text-primary)]">
                  {src.document_title}
                </span>
                {formatPage(src) && (
                  <span className="text-[var(--accent-primary)]">{formatPage(src)}</span>
                )}
                {src.section_title && (
                  <span className="truncate text-[var(--text-secondary)]">
                    {src.section_title}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Action Triggers for Compliance (Phase 4 & 5) */}
        {(needsHandoff || needsEscalation) && (
          <div className="mt-5 pl-9">
            <div className="flex flex-wrap gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card-soft)] p-4">
              <div className="flex w-full items-center gap-2 mb-1">
                <span className="text-[16px]">⚠️</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">Recommended Action Needed</span>
              </div>
              {needsHandoff && (
                <button className="flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Talk to a Certified Advisor
                </button>
              )}
              {needsEscalation && (
                <button className="flex items-center gap-2 rounded-xl border border-[var(--accent-primary)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--accent-primary)] transition hover:bg-[var(--accent-primary)]/5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  File Grievance (Bima Bharosa)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phase 5 AI Transparency Label */}
        <div className="mt-3 pl-9">
          <p className="text-[10px] text-[var(--text-muted)] italic">
            * This is AI-generated advice and does not constitute a certified financial recommendation. 
            Please complete a formal suitability assessment with a registered agent before purchase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(MessageBubble);
