"use client";

import { FormEvent, memo, useEffect, useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 220)}px`;
    }
  }, [value]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-[var(--border-subtle)] bg-white/60 px-4 py-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="surface-card-soft flex items-end gap-3 rounded-[28px] p-3">
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about policy eligibility, regulations, waiting periods, or plan types..."
              rows={1}
              className="min-h-[56px] w-full resize-none bg-transparent px-2 py-3 text-[15px] leading-7 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
            <button
              type="submit"
              disabled={!value.trim() || isLoading}
              className="primary-button h-12 w-12 cursor-pointer rounded-full p-0 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9l20-7Z" />
              </svg>
            </button>
          </div>
        </form>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[var(--text-secondary)]">
          <p>Press Enter to send. Use Shift + Enter for a new line.</p>
          <p>Verify important compliance or underwriting details before acting.</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatInput);
