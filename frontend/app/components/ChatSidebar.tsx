"use client";

import { memo } from "react";

interface Session {
  session_id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  userEmail: string;
  isLoading: boolean;
  deletingSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sid: string) => void;
  onDeleteSession: (sid: string) => void;
  onLogout: () => void;
  onProfile: () => void;
  onAdminDashboard?: () => void;
  isAdmin?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
});

function formatDate(iso: string) {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}

function ChatSidebar({
  sessions,
  activeSessionId,
  userEmail,
  isLoading,
  deletingSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onLogout,
  onProfile,
  onAdminDashboard,
  isAdmin = false,
}: ChatSidebarProps) {
  return (
    <div className="surface-card flex h-full flex-col overflow-hidden p-4 md:p-5">
      {/* New chat */}
      <button
        type="button"
        onClick={onNewChat}
        disabled={isLoading}
        className="primary-button mb-4 w-full cursor-pointer px-4 py-3 text-sm"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/18">
          +
        </span>
        Start a new chat
      </button>

      {/* Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Conversation history
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {sessions.length} saved session{sessions.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Session list */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {sessions.length === 0 ? (
          <div className="surface-card-soft rounded-[22px] p-4 text-sm leading-6 text-[var(--text-secondary)]">
            Your saved chats will appear here once you start asking questions.
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              const isActive = activeSessionId === session.session_id;
              const isDeleting = deletingSessionId === session.session_id;

              return (
                <div
                  key={session.session_id}
                  className={`w-full rounded-[20px] border px-4 py-3 text-left transition-all ${
                    isActive
                      ? "border-[var(--accent-primary)] bg-[var(--accent-tertiary)] shadow-sm"
                      : "border-[var(--border-subtle)] bg-white/72 hover:border-[var(--border-focus)] hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectSession(session.session_id)}
                      disabled={isLoading || !!deletingSessionId}
                      className="min-w-0 flex-1 cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-60"
                      title={session.title}
                    >
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {session.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
                        <span className="truncate">
                          {isActive ? "Currently open" : "Saved conversation"}
                        </span>
                        <span>{formatDate(session.created_at)}</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSession(session.session_id)}
                      disabled={isLoading || !!deletingSessionId}
                      className="secondary-button h-10 w-10 shrink-0 cursor-pointer p-0 text-[var(--text-secondary)] hover:text-[var(--error)] disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Delete ${session.title}`}
                      title={isDeleting ? "Deleting..." : "Delete session"}
                    >
                      {isDeleting ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 space-y-3">
        <div className="surface-card-soft rounded-[24px] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-primary)] text-sm font-semibold text-white">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                {userEmail}
              </p>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Your saved chats and profile stay linked to this account.
              </p>
            </div>
          </div>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={onAdminDashboard}
            className="secondary-button w-full cursor-pointer px-4 py-3 text-sm"
          >
            Admin dashboard
          </button>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onProfile} className="secondary-button cursor-pointer px-4 py-3 text-sm">
            Profile
          </button>
          <button type="button" onClick={onLogout} className="secondary-button cursor-pointer px-4 py-3 text-sm">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatSidebar);
