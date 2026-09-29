import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { geminiService } from "../services/geminiService";
import {
  speakAlert,
  playChime,
} from "../utils/emergencyUtils";

import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../hooks/useLocation";
import { useTheme } from "../context/ThemeContext";
import { useEmergency } from "../context/EmergencyContext";

const QUICK_PROMPTS = [
  "What is the current flood risk near Tehri Dam?",
  "Explain today's reservoir water levels.",
  "What should people do during a dam break emergency?",
  "Find the nearest safe shelter.",
  "Will heavy rainfall affect my district?",
];

const PAGE_COMMANDS = [
  {
    names: ["dashboard", "home", "command dashboard"],
    path: "/dashboard",
    label: "Command Dashboard",
  },
  {
    names: ["dam monitoring", "monitor dams", "dams"],
    path: "/dam-monitoring",
    label: "Dam Monitoring",
  },
  {
    names: ["live map", "flood map", "gis map", "map"],
    path: "/live-map",
    label: "Live Flood GIS Map",
  },
  {
    names: ["flood prediction", "flood prediction ai", "prediction"],
    path: "/flood-prediction",
    label: "Flood Prediction",
  },
  {
    names: ["risk assessment", "risk analysis", "ai risk"],
    path: "/risk-assessment",
    label: "AI Risk Assessment",
  },
  {
    names: ["weather", "weather forecast", "forecast"],
    path: "/weather",
    label: "Weather Forecast",
  },
  {
    names: ["alerts", "warnings", "alert center"],
    path: "/alerts",
    label: "Alerts & Warnings",
  },
  {
    names: [
      "emergency response",
      "emergency",
      "response center",
    ],
    path: "/emergency-response",
    label: "Emergency Response",
  },
  {
    names: ["safe routes", "routes", "evacuation routes"],
    path: "/safe-routes",
    label: "Safe Routes",
  },
  {
    names: ["shelters", "evacuation shelters", "safe shelter"],
    path: "/shelters",
    label: "Evacuation Shelters",
  },
  {
    names: ["reports", "report"],
    path: "/reports",
    label: "Reports",
  },
  {
    names: ["analytics", "hydrology analytics"],
    path: "/analytics",
    label: "Hydrology Analytics",
  },
  {
    names: ["manage dams", "dam management"],
    path: "/manage-dams",
    label: "Manage Dams",
  },
  {
    names: [
      "manage users",
      "users",
      "user directory",
      "user management",
    ],
    path: "/manage-users",
    label: "User Directory",
  },
  {
    names: ["settings", "preferences"],
    path: "/settings",
    label: "Settings",
  },
  {
    names: ["about", "about pravah"],
    path: "/about",
    label: "About PRAVAH",
  },
  {
    names: ["public portal", "citizen portal", "public"],
    path: "/public",
    label: "Public Portal",
  },
];

export function AIChatbot({ isOpen, onClose }) {
  const navigate = useNavigate();

  const {
    currentLanguage,
    setLanguage,
    languages,
    activeLangObj,
  } = useLanguage();

  const {
    location,
    nearestDam,
    nearestShelter,
  } = useLocation();

  const {
    darkMode,
    setDarkMode,
    toggleHighContrast,
    toggleLargeText,
    highContrast,
    largeText,
  } = useTheme();

  const {
    emergencyModeActive,
    toggleEmergencyMode,
    speechSafetyMode,
    toggleSpeechSafetyMode,
  } = useEmergency();

  const [messages, setMessages] = useState([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Namaste! I am PRAVAH AI. I can answer flood and dam-safety questions and control supported PRAVAH interface features. You can ask me to change the theme, open a page, change accessibility settings, change language, or provide disaster information.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechActive, setSpeechActive] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  /* =====================================================
     VOICE RECOGNITION
     ===================================================== */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang =
      activeLangObj?.speechCode || "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
      playChime();
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      setInput(text);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [activeLangObj]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      const msg = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content:
          "Voice recognition is not supported by this browser.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, msg]);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  /* =====================================================
     LOCAL COMMAND RESPONSE
     ===================================================== */

  const addAssistantMessage = (content) => {
    const message = {
      id: `msg-${Date.now() + Math.random()}`,
      role: "assistant",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, message]);

    if (speechActive) {
      speakAlert(
        content,
        activeLangObj?.speechCode || "en-IN"
      );
    }
  };

  /* =====================================================
     THEME COMMANDS
     ===================================================== */

  const handleThemeCommand = (command) => {
    const text = command.toLowerCase().trim();

    const wantsLight =
      text.includes("light theme") ||
      text.includes("light mode") ||
      text.includes("switch to light") ||
      text.includes("change to light") ||
      text.includes("turn on light") ||
      text === "light";

    const wantsDark =
      text.includes("dark theme") ||
      text.includes("dark mode") ||
      text.includes("switch to dark") ||
      text.includes("change to dark") ||
      text.includes("turn on dark") ||
      text === "dark";

    const wantsToggle =
      text.includes("switch theme") ||
      text.includes("change theme") ||
      text.includes("toggle theme");

    if (wantsLight) {
      setDarkMode(false);
      return "Done. PRAVAH has been switched to Light Theme.";
    }

    if (wantsDark) {
      setDarkMode(true);
      return "Done. PRAVAH has been switched to Dark Theme.";
    }

    if (wantsToggle) {
      const next = !darkMode;
      setDarkMode(next);

      return `Done. PRAVAH is now using ${
        next ? "Dark" : "Light"
      } Theme.`;
    }

    return null;
  };

  /* =====================================================
     ACCESSIBILITY COMMANDS
     ===================================================== */

  const handleAccessibilityCommand = (command) => {
    const text = command.toLowerCase();

    if (
      text.includes("enable high contrast") ||
      text.includes("turn on high contrast")
    ) {
      if (!highContrast) toggleHighContrast();

      return "High Contrast Mode is now enabled.";
    }

    if (
      text.includes("disable high contrast") ||
      text.includes("turn off high contrast")
    ) {
      if (highContrast) toggleHighContrast();

      return "High Contrast Mode is now disabled.";
    }

    if (
      text.includes("enable large text") ||
      text.includes("turn on large text") ||
      text.includes("increase text size")
    ) {
      if (!largeText) toggleLargeText();

      return "Large Text Mode is now enabled.";
    }

    if (
      text.includes("disable large text") ||
      text.includes("turn off large text") ||
      text.includes("normal text size")
    ) {
      if (largeText) toggleLargeText();

      return "Large Text Mode is now disabled.";
    }

    if (
      text.includes("enable voice safety") ||
      text.includes("turn on voice safety") ||
      text.includes("voice safety on")
    ) {
      if (!speechSafetyMode) {
        toggleSpeechSafetyMode();
      }

      return "Voice Safety Mode is now enabled.";
    }

    if (
      text.includes("disable voice safety") ||
      text.includes("turn off voice safety") ||
      text.includes("voice safety off")
    ) {
      if (speechSafetyMode) {
        toggleSpeechSafetyMode();
      }

      return "Voice Safety Mode is now disabled.";
    }

    return null;
  };

  /* =====================================================
     NAVIGATION COMMANDS
     ===================================================== */

  const handleNavigationCommand = (command) => {
    const text = command.toLowerCase();

    for (const page of PAGE_COMMANDS) {
      const matched = page.names.some((name) =>
        text.includes(name)
      );

      if (matched) {
        navigate(page.path);

        return `Opening ${page.label}.`;
      }
    }

    return null;
  };

  /* =====================================================
     LANGUAGE COMMANDS
     ===================================================== */

  const handleLanguageCommand = (command) => {
    const text = command.toLowerCase();

    if (
      !text.includes("language") &&
      !text.includes("hindi") &&
      !text.includes("english") &&
      !text.includes("bengali") &&
      !text.includes("marathi") &&
      !text.includes("tamil") &&
      !text.includes("telugu") &&
      !text.includes("kannada") &&
      !text.includes("malayalam") &&
      !text.includes("gujarati") &&
      !text.includes("punjabi")
    ) {
      return null;
    }

    if (text.includes("english")) {
      const lang = languages.find(
        (item) =>
          item.code === "en" ||
          item.name?.toLowerCase() === "english"
      );

      if (lang) {
        setLanguage(lang.code);
        return "Language changed to English.";
      }
    }

    if (text.includes("hindi")) {
      const lang = languages.find(
        (item) =>
          item.code === "hi" ||
          item.name?.toLowerCase() === "hindi"
      );

      if (lang) {
        setLanguage(lang.code);
        return "भाषा हिंदी में बदल दी गई है।";
      }
    }

    const languageNames = [
      "bengali",
      "marathi",
      "tamil",
      "telugu",
      "kannada",
      "malayalam",
      "gujarati",
      "punjabi",
    ];

    for (const name of languageNames) {
      if (text.includes(name)) {
        const lang = languages.find(
          (item) =>
            item.name?.toLowerCase() === name ||
            item.nativeName
              ?.toLowerCase()
              .includes(name)
        );

        if (lang) {
          setLanguage(lang.code);

          return `Language changed to ${lang.nativeName}.`;
        }
      }
    }

    return "Please specify a supported language.";
  };

  /* =====================================================
     EMERGENCY COMMAND
     ===================================================== */

  const handleEmergencyCommand = (command) => {
    const text = command.toLowerCase();

    const wantsEmergency =
      text.includes("activate emergency") ||
      text.includes("activate emergency mode") ||
      text.includes("turn on emergency") ||
      text.includes("enable emergency mode") ||
      text.includes("code red");

    if (!wantsEmergency) return null;

    if (emergencyModeActive) {
      return "Emergency Mode is already active.";
    }

    return {
      confirmation: true,
      message:
        "Emergency Mode can activate the PRAVAH emergency interface. Do you want me to activate Emergency Mode?",
    };
  };

  /* =====================================================
     EXECUTE CONFIRMED EMERGENCY
     ===================================================== */

  const confirmEmergency = () => {
    if (!emergencyModeActive) {
      toggleEmergencyMode();
    }

    addAssistantMessage(
      "Emergency Mode has been activated. PRAVAH is now displaying the emergency response interface."
    );
  };

  /* =====================================================
     MASTER COMMAND ROUTER
     ===================================================== */

  const executeLocalCommand = (text) => {
    const emergencyResult =
      handleEmergencyCommand(text);

    if (emergencyResult) {
      return emergencyResult;
    }

    const themeResult =
      handleThemeCommand(text);

    if (themeResult) {
      return themeResult;
    }

    const accessibilityResult =
      handleAccessibilityCommand(text);

    if (accessibilityResult) {
      return accessibilityResult;
    }

    const languageResult =
      handleLanguageCommand(text);

    if (languageResult) {
      return languageResult;
    }

    const navigationResult =
      handleNavigationCommand(text);

    if (navigationResult) {
      return navigationResult;
    }

    return null;
  };

  /* =====================================================
     SEND MESSAGE
     ===================================================== */

  const handleSend = async (textToSend) => {
    const text = textToSend || input;

    if (!text.trim() || isLoading) return;

    const cleanText = text.trim();

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: cleanText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    /* Execute PRAVAH commands locally */
    const localResult =
      executeLocalCommand(cleanText);

    if (localResult) {
      if (localResult.confirmation) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            content: localResult.message,
            confirmation: true,
            timestamp: new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          },
        ]);

        return;
      }

      addAssistantMessage(localResult);
      return;
    }

    /* Otherwise use Gemini */
    setIsLoading(true);

    try {
      const context = {
        userLocation: location?.name,
        damName: nearestDam?.name,
        nearestDamWaterLevel:
          nearestDam?.currentWaterLevel,
        nearestShelter: nearestShelter?.name,

        currentTheme: darkMode
          ? "dark"
          : "light",

        currentLanguage:
          activeLangObj?.name ||
          currentLanguage,

        availableActions: [
          "change theme",
          "navigate PRAVAH pages",
          "change language",
          "enable/disable high contrast",
          "enable/disable large text",
          "enable/disable voice safety",
        ],
      };

      const reply =
        await geminiService.sendChatMessage(
          cleanText,
          messages.slice(-6),
          context
        );

      const botMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

      if (speechActive) {
        speakAlert(
          reply,
          activeLangObj?.speechCode || "en-IN"
        );
      }
    } catch (error) {
      console.error(
        "PRAVAH AI Error:",
        error
      );

      addAssistantMessage(
        "PRAVAH AI is temporarily unable to reach the AI service. You can still use commands such as 'open dashboard', 'change to light theme', or 'open live map'."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-[95vw] sm:w-[430px] h-[600px] max-h-[82vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

      {/* ================= HEADER ================= */}

      <div className="px-4 py-3 bg-slate-950 border-b border-slate-700 flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">
                PRAVAH AI Companion
              </span>

              <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                FULL ACCESS
              </span>
            </div>

            <p className="text-[10px] text-blue-300">
              Dam • Flood • Evacuation • PRAVAH Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">

          <button
            onClick={() =>
              setSpeechActive(
                (prev) => !prev
              )
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title={
              speechActive
                ? "Mute Voice"
                : "Enable Voice"
            }
          >
            {speechActive ? (
              <Volume2 className="w-4 h-4 text-blue-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= ACCESS STATUS ================= */}

      <div className="px-3 py-2 bg-blue-950/40 border-b border-blue-900/50 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />

        <span className="text-[10px] text-blue-200">
          PRAVAH controls connected
        </span>

        <span className="ml-auto text-[9px] text-blue-400">
          {darkMode
            ? "Dark"
            : "Light"}{" "}
          •{" "}
          {currentLanguage}
        </span>
      </div>

      {/* ================= MESSAGES ================= */}

      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.role === "user"
                ? "flex-row-reverse"
                : ""
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                message.role === "user"
                  ? "bg-slate-700 text-slate-200"
                  : "bg-blue-950 border border-blue-700 text-blue-300"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>

            <div
              className={`max-w-[84%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] font-semibold text-slate-300">
                  {message.role === "user"
                    ? "You"
                    : "PRAVAH AI"}
                </span>

                <span className="text-[9px] text-slate-500">
                  {message.timestamp}
                </span>
              </div>

              <p>{message.content}</p>

              {/* Emergency confirmation */}
              {message.confirmation && (
                <div className="mt-3 flex gap-2">

                  <button
                    onClick={confirmEmergency}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                  >
                    Activate Emergency
                  </button>

                  <button
                    onClick={() =>
                      addAssistantMessage(
                        "Emergency activation cancelled."
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold"
                  >
                    Cancel
                  </button>

                </div>
              )}

              {message.role === "assistant" && (
                <button
                  onClick={() =>
                    speakAlert(
                      message.content,
                      activeLangObj?.speechCode ||
                        "en-IN"
                    )
                  }
                  className="mt-2 flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300"
                >
                  <Volume2 className="w-3 h-3" />
                  Read aloud
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">

            <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-blue-300" />
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-blue-300">
              <span className="animate-pulse">
                PRAVAH AI is analysing...
              </span>
            </div>

          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950">

        <div className="text-[9px] font-bold text-blue-400 uppercase mb-1.5">
          Quick Actions
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">

          {[
            "Open Dashboard",
            "Open Live Map",
            "Open Alerts",
            "Change to Light Theme",
            "Open Settings",
          ].map((action) => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              className="shrink-0 text-[10px] px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-blue-950 hover:text-blue-300 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              {action}
            </button>
          ))}

        </div>
      </div>

      {/* ================= FLOOD QUESTIONS ================= */}

      <div className="px-3 py-1.5 border-t border-slate-800 bg-slate-950/80 flex gap-1.5 overflow-x-auto">

        {QUICK_PROMPTS.map(
          (prompt, index) => (
            <button
              key={index}
              onClick={() =>
                handleSend(prompt)
              }
              className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-950 hover:text-blue-300 text-slate-300 border border-slate-700 transition-colors"
            >
              {prompt}
            </button>
          )
        )}

      </div>

      {/* ================= INPUT ================= */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >

        <button
          type="button"
          onClick={toggleMic}
          className={`p-2 rounded-lg border transition-colors ${
            isListening
              ? "bg-red-600 text-white border-red-500 animate-pulse"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:text-blue-300"
          }`}
          title={
            isListening
              ? "Stop listening"
              : "Voice input"
          }
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="Ask PRAVAH or give a command..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={
            !input.trim() || isLoading
          }
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>

      </form>
    </div>
  );
}

export default AIChatbot;