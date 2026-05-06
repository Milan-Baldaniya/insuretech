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
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] md:max-w-[72%]">
          <div className="rounded-[24px] bg-[var(--accent-primary)] px-5 py-3.5 text-white shadow-sm">
            <p className="text-[15px] leading-7">{msg.content}</p>
            <p className="mt-2 text-right text-[11px] text-white/60">
              {formatTime(msg.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Assistant — flat, no box, like ChatGPT/Claude
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
      </div>
    </div>
  );
}

export default memo(MessageBubble);
