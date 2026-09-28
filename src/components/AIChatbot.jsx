
import React, { useEffect, useRef, useState } from "react";

/**
 * PRAVAH AI Chatbot
 * Uses the backend PRAVAH AI endpoint:
 * POST /api/gemini/chat
 */

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Namaste! I am PRAVAH AI, your intelligent Dam Safety and Flood Disaster Assistant. Ask me about dam safety, flood preparedness, evacuation planning, or reservoir monitoring.",
};

// =====================================================
// QUICK SEARCHES
// =====================================================

const QUICK_SEARCHES = [
  {
    label: "Flood safety",
    prompt: "Explain general flood safety precautions.",
  },
  {
    label: "Dam risk",
    prompt: "What information is needed for dam flood risk analysis?",
  },
  {
    label: "Water levels",
    prompt:
      "Explain reservoir water level, inflow, outflow, storage, and spillway status.",
  },
  {
    label: "Dam break",
    prompt:
      "What should people do during a dam-break emergency?",
  },
  {
    label: "Evacuation",
    prompt:
      "How should people prepare for flood evacuation and move to a safe area?",
  },
  {
    label: "Safe shelters",
    prompt:
      "What should I check when choosing a safe flood shelter?",
  },
  {
    label: "Heavy rainfall",
    prompt:
      "How can heavy rainfall affect reservoir levels and downstream flood risk?",
  },
  {
    label: "Emergency kit",
    prompt:
      "What essential items should be kept in a flood emergency kit?",
  },
];

function cleanText(text = "") {
  return String(text)
    .replace(/[*_`#~]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(cleanText(text));
  speech.rate = 0.95;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}


export function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function sendMessage(customMessage = null) {
    const messageToSend = String(
      customMessage ?? input
    ).trim();

    if (!messageToSend || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: messageToSend,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          history: messages.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          context: {
            application: "PRAVAH",
            system:
              "AI Dam Break Flood Prediction and Disaster Management System",
            selectedDam: "Hirakud Dam",
            location: "India",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "PRAVAH AI request failed"
        );
      }

      const assistantReply = cleanText(
        data?.reply ||
          data?.message ||
          "No response was received from PRAVAH AI."
      );

      const assistantMessage = {
        role: "assistant",
        content: assistantReply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);

      if (voiceEnabled) {
        speakText(assistantReply);
      }
    } catch (error) {
      console.error("PRAVAH AI Chat Error:", error);

      const errorMessage = {
        role: "assistant",
        content:
          "PRAVAH AI is temporarily unavailable. Please try again shortly.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);

      if (voiceEnabled) {
        speakText(errorMessage.content);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleVoiceToggle() {
    setVoiceEnabled((previousValue) => {
      const nextValue = !previousValue;

      if (!nextValue && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      return nextValue;
    });
  }

  function clearChat() {
    setMessages([INITIAL_MESSAGE]);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <section
        style={styles.chatWindow}
        aria-label="PRAVAH AI chatbot"
      >
        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.aiIcon}>✦</div>

            <div>
              <div style={styles.titleRow}>
                <strong style={styles.title}>
                  PRAVAH AI Companion
                </strong>

                <span style={styles.providerBadge}>
                  PRAVAH AI
                </span>
              </div>

              <div style={styles.subtitle}>
                Dam • Inundation • Evacuation Intelligence
              </div>
            </div>
          </div>

          <div style={styles.headerActions}>
            <button
              type="button"
              onClick={handleVoiceToggle}
              style={{
                ...styles.headerButton,
                backgroundColor: voiceEnabled
                  ? "#087f9b"
                  : "#17263c",
              }}
              title="Toggle voice response"
            >
              🔊
            </button>

            <button
              type="button"
              onClick={onClose}
              style={styles.headerButton}
              title="Close chatbot"
            >
              ✕
            </button>
          </div>
        </header>

        {/* MESSAGES */}
        <main style={styles.messagesArea}>
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                style={{
                  ...styles.messageRow,
                  justifyContent: isUser
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                {!isUser && (
                  <div style={styles.botAvatar}>♙</div>
                )}

                <div
                  style={{
                    ...styles.messageBubble,
                    ...(isUser
                      ? styles.userBubble
                      : styles.botBubble),
                  }}
                >
                  <div style={styles.messageLabel}>
                    {isUser ? "You" : "PRAVAH AI"}
                  </div>

                  <div style={styles.messageText}>
                    {cleanText(message.content)}
                  </div>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakText(message.content)}
                      style={styles.speakButton}
                      title="Read response aloud"
                    >
                      🔊 Read aloud
                    </button>
                  )}
                </div>

                {isUser && (
                  <div style={styles.userAvatar}>◯</div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={styles.messageRow}>
              <div style={styles.botAvatar}>♙</div>

              <div style={styles.messageBubble}>
                <div style={styles.messageLabel}>
                  PRAVAH AI
                </div>

                <div style={styles.typing}>
                  PRAVAH AI is preparing a response...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* QUICK SEARCHES */}
        <div style={styles.quickSection}>
          <div style={styles.quickHeader}>
            <span style={styles.quickTitle}>Quick search</span>
            <span style={styles.quickHint}>Tap to ask</span>
          </div>

          <div style={styles.quickQuestions}>
            {QUICK_SEARCHES.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => sendMessage(item.prompt)}
                disabled={loading}
                style={{
                  ...styles.quickButton,
                  opacity: loading ? 0.55 : 1,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          style={styles.inputForm}
        >
          <button
            type="button"
            onClick={handleVoiceToggle}
            style={styles.inputIconButton}
            title="Toggle voice"
          >
            🎙
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask about flood safety, dam levels, or routes..."
            rows={1}
            disabled={loading}
            style={styles.textarea}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              ...styles.sendButton,
              opacity:
                loading || !input.trim() ? 0.5 : 1,
            }}
            title="Send message"
          >
            ➤
          </button>
        </form>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <button
            type="button"
            onClick={clearChat}
            style={styles.clearButton}
          >
            Clear chat
          </button>

          <span style={styles.footerText}>
            Powered by PRAVAH
          </span>
        </footer>
      </section>
    </div>
  );
}

/*
 * Default export is also provided.
 * This supports both:
 *
 * import { AIChatbot } from "./components/AIChatbot";
 *
 * and:
 *
 * import AIChatbot from "./components/AIChatbot";
 */
export default AIChatbot;

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    pointerEvents: "none",
  },

  chatWindow: {
    position: "absolute",
    right: "24px",
    bottom: "24px",
    width: "min(450px, calc(100vw - 32px))",
    height: "min(650px, calc(100vh - 48px))",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    pointerEvents: "auto",
    border: "1px solid #07516b",
    borderRadius: "20px",
    backgroundColor: "#0b1428",
    color: "#e7f3ff",
    boxShadow:
      "0 20px 70px rgba(0, 0, 0, 0.6)",
    fontFamily:
      "Inter, Segoe UI, Arial, sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "16px",
    background:
      "linear-gradient(135deg, #102b45, #073c51)",
    borderBottom: "1px solid #17445c",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  aiIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #00a7d1",
    borderRadius: "50%",
    color: "#53e6ff",
    fontSize: "22px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "7px",
  },

  title: {
    fontSize: "14px",
    color: "#f0f7ff",
  },

  providerBadge: {
    padding: "3px 6px",
    border: "1px solid #00a9ce",
    borderRadius: "5px",
    color: "#53e6ff",
    fontSize: "10px",
  },

  subtitle: {
    marginTop: "4px",
    color: "#76c8df",
    fontSize: "10px",
  },

  headerActions: {
    display: "flex",
    gap: "6px",
  },

  headerButton: {
    width: "30px",
    height: "30px",
    border: "1px solid #25445a",
    borderRadius: "8px",
    backgroundColor: "#17263c",
    color: "#c9e6f5",
    cursor: "pointer",
  },

  messagesArea: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    padding: "16px 12px",
    backgroundColor: "#0b1428",
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "14px",
  },

  botAvatar: {
    width: "27px",
    height: "27px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: "1px solid #0b98b8",
    borderRadius: "50%",
    color: "#5de3ff",
    fontSize: "14px",
  },

  userAvatar: {
    width: "27px",
    height: "27px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: "#26364d",
    color: "#d9e8f5",
    fontSize: "13px",
  },

  messageBubble: {
    maxWidth: "82%",
    padding: "12px",
    border: "1px solid #26384f",
    borderRadius: "12px",
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },

  botBubble: {
    backgroundColor: "#1a293e",
  },

  userBubble: {
    backgroundColor: "#008fb6",
    borderColor: "#00a8d0",
    color: "#ffffff",
  },

  messageLabel: {
    marginBottom: "5px",
    color: "#9db4c9",
    fontSize: "10px",
    fontWeight: 700,
  },

  messageText: {
    fontSize: "13px",
  },

  speakButton: {
    marginTop: "9px",
    padding: "3px 0",
    border: "none",
    background: "transparent",
    color: "#6bd8ef",
    cursor: "pointer",
    fontSize: "10px",
  },

  typing: {
    color: "#9eb6ca",
    fontSize: "12px",
    fontStyle: "italic",
  },

  quickSection: {
    borderTop: "1px solid #1d3045",
    backgroundColor: "#0d1b30",
    paddingTop: "7px",
  },

  quickHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px 6px",
  },

  quickTitle: {
    color: "#8fd9eb",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },

  quickHint: {
    color: "#56758b",
    fontSize: "9px",
  },

  quickQuestions: {
    display: "flex",
    gap: "7px",
    padding: "0 12px 9px",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
  },

  quickButton: {
    flexShrink: 0,
    padding: "7px 11px",
    border: "1px solid #2c536d",
    borderRadius: "999px",
    backgroundColor: "#17283d",
    color: "#c5dce9",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },

  inputForm: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px",
    borderTop: "1px solid #26384f",
    backgroundColor: "#0c192c",
  },

  inputIconButton: {
    width: "36px",
    height: "36px",
    flexShrink: 0,
    border: "1px solid #2d465c",
    borderRadius: "9px",
    backgroundColor: "#17283d",
    color: "#cce4f3",
    cursor: "pointer",
  },

  textarea: {
    flex: 1,
    minWidth: 0,
    resize: "none",
    padding: "10px",
    border: "1px solid #31506b",
    borderRadius: "9px",
    outline: "none",
    backgroundColor: "#101e34",
    color: "#e7f4ff",
    fontFamily: "inherit",
    fontSize: "12px",
  },

  sendButton: {
    width: "38px",
    height: "38px",
    flexShrink: 0,
    border: "none",
    borderRadius: "9px",
    backgroundColor: "#008fb6",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "18px",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "8px 12px",
    borderTop: "1px solid #1d3045",
    backgroundColor: "#0a1425",
  },

  clearButton: {
    border: "none",
    background: "transparent",
    color: "#69c9e1",
    cursor: "pointer",
    fontSize: "10px",
  },

  footerText: {
    color: "#617f96",
    fontSize: "9px",
  },
};