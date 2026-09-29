import React, {
  useState,
  useRef,
  useEffect,
} from "react";

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


// =====================================================
// QUICK QUESTIONS
// =====================================================

const QUICK_PROMPTS = [
  "Tell me everything about Hirakud Dam.",
  "What are the current dam risk levels?",
  "Which dams are at critical risk?",
  "What alerts are currently active?",
  "Find the nearest safe shelter.",
];


// =====================================================
// EXPLICIT NAVIGATION COMMANDS
// IMPORTANT:
// These are NOT matched against every normal sentence.
// Navigation only happens when the user explicitly asks
// to open/go/show/navigate to a page.
// =====================================================

const PAGE_COMMANDS = [
  {
    names: [
      "dashboard",
      "home",
      "command dashboard",
    ],
    path: "/dashboard",
    label: "Command Dashboard",
  },

  {
    names: [
      "dam monitoring",
      "monitor dams",
    ],
    path: "/dam-monitoring",
    label: "Dam Monitoring",
  },

  {
    names: [
      "live map",
      "flood map",
      "gis map",
    ],
    path: "/live-map",
    label: "Live Flood GIS Map",
  },

  {
    names: [
      "flood prediction",
      "prediction",
    ],
    path: "/flood-prediction",
    label: "Flood Prediction",
  },

  {
    names: [
      "risk assessment",
      "risk analysis",
    ],
    path: "/risk-assessment",
    label: "AI Risk Assessment",
  },

  {
    names: [
      "weather",
      "weather forecast",
    ],
    path: "/weather",
    label: "Weather Forecast",
  },

  {
    names: [
      "alerts",
      "alert center",
      "warnings",
    ],
    path: "/alerts",
    label: "Alerts & Warnings",
  },

  {
    names: [
      "emergency response",
      "response center",
    ],
    path: "/emergency-response",
    label: "Emergency Response",
  },

  {
    names: [
      "safe routes",
      "evacuation routes",
    ],
    path: "/safe-routes",
    label: "Safe Routes",
  },

  {
    names: [
      "shelters",
      "evacuation shelters",
    ],
    path: "/shelters",
    label: "Evacuation Shelters",
  },

  {
    names: [
      "reports",
      "report center",
    ],
    path: "/reports",
    label: "Reports",
  },

  {
    names: [
      "analytics",
      "hydrology analytics",
    ],
    path: "/analytics",
    label: "Hydrology Analytics",
  },

  {
    names: [
      "manage dams",
      "dam management",
    ],
    path: "/manage-dams",
    label: "Manage Dams",
  },

  {
    names: [
      "manage users",
      "user management",
      "user directory",
    ],
    path: "/manage-users",
    label: "User Directory",
  },

  {
    names: [
      "settings",
      "preferences",
    ],
    path: "/settings",
    label: "Settings",
  },

  {
    names: [
      "about pravah",
      "about page",
    ],
    path: "/about",
    label: "About PRAVAH",
  },

  {
    names: [
      "public portal",
      "citizen portal",
    ],
    path: "/public",
    label: "Public Portal",
  },
];


// =====================================================
// COMPONENT
// =====================================================

export function AIChatbot({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  // ===================================================
  // LANGUAGE
  // ===================================================

  const {
    currentLanguage,
    setLanguage,
    languages,
    activeLangObj,
  } = useLanguage();

  // ===================================================
  // LOCATION
  // ===================================================

  const {
    location,
    nearestDam,
    nearestShelter,
  } = useLocation();

  // ===================================================
  // THEME
  // ===================================================

  const {
    darkMode,
    setDarkMode,
    toggleHighContrast,
    toggleLargeText,
    highContrast,
    largeText,
  } = useTheme();

  // ===================================================
  // EMERGENCY
  // ===================================================

  const {
    emergencyModeActive,
    toggleEmergencyMode,
    speechSafetyMode,
    toggleSpeechSafetyMode,
  } = useEmergency();

  // ===================================================
  // STATE
  // ===================================================

  const [messages, setMessages] =
    useState([
      {
        id: "msg-1",
        role: "assistant",
        content:
          "Namaste! I am PRAVAH AI. Ask me about dams, water levels, flood prediction, alerts, shelters, weather, evacuation or any PRAVAH feature. I can also control the PRAVAH interface.",
        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
      },
    ]);

  const [input, setInput] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [speechActive, setSpeechActive] =
    useState(true);

  const messagesEndRef =
    useRef(null);

  const recognitionRef =
    useRef(null);


  // ===================================================
  // AUTO SCROLL
  // ===================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages,
    isLoading,
  ]);


  // ===================================================
  // VOICE RECOGNITION
  // ===================================================

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous =
      false;

    recognition.interimResults =
      false;

    recognition.lang =
      activeLangObj?.speechCode ||
      "en-IN";

    recognition.onstart =
      () => {
        setIsListening(true);
        playChime();
      };

    recognition.onresult =
      (event) => {
        const text =
          event.results[0][0]
            .transcript;

        setInput(text);
        setIsListening(false);
      };

    recognition.onerror =
      () => {
        setIsListening(false);
      };

    recognition.onend =
      () => {
        setIsListening(false);
      };

    recognitionRef.current =
      recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // cleanup
      }
    };
  }, [activeLangObj]);


  // ===================================================
  // ADD ASSISTANT MESSAGE
  // ===================================================

  const addAssistantMessage = (
    content,
  ) => {
    const message = {
      id:
        `msg-${Date.now()}-${Math.random()}`,
      role: "assistant",
      content,
      timestamp:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
    };

    setMessages((prev) => [
      ...prev,
      message,
    ]);

    if (speechActive) {
      speakAlert(
        content,
        activeLangObj?.speechCode ||
          "en-IN",
      );
    }
  };


  // ===================================================
  // MICROPHONE
  // ===================================================

  const toggleMic = () => {
    if (!recognitionRef.current) {
      addAssistantMessage(
        "Voice recognition is not supported by this browser.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        // already running
      }
    }
  };


  // ===================================================
  // THEME COMMAND
  // ===================================================

  const handleThemeCommand = (
    command,
  ) => {
    const text =
      command
        .toLowerCase()
        .trim();

    const wantsLight =
      text === "light" ||
      text.includes(
        "light theme",
      ) ||
      text.includes(
        "light mode",
      ) ||
      text.includes(
        "switch to light",
      ) ||
      text.includes(
        "change to light",
      ) ||
      text.includes(
        "turn on light",
      );

    const wantsDark =
      text === "dark" ||
      text.includes(
        "dark theme",
      ) ||
      text.includes(
        "dark mode",
      ) ||
      text.includes(
        "switch to dark",
      ) ||
      text.includes(
        "change to dark",
      ) ||
      text.includes(
        "turn on dark",
      );

    const wantsToggle =
      text ===
        "switch theme" ||
      text ===
        "change theme" ||
      text ===
        "toggle theme";

    if (wantsLight) {
      setDarkMode(false);

      return (
        "Done. PRAVAH has been switched to Light Theme."
      );
    }

    if (wantsDark) {
      setDarkMode(true);

      return (
        "Done. PRAVAH has been switched to Dark Theme."
      );
    }

    if (wantsToggle) {
      const next =
        !darkMode;

      setDarkMode(next);

      return `Done. PRAVAH is now using ${
        next
          ? "Dark"
          : "Light"
      } Theme.`;
    }

    return null;
  };


  // ===================================================
  // ACCESSIBILITY
  // ===================================================

  const handleAccessibilityCommand = (
    command,
  ) => {
    const text =
      command.toLowerCase();

    if (
      text.includes(
        "enable high contrast",
      ) ||
      text.includes(
        "turn on high contrast",
      )
    ) {
      if (!highContrast) {
        toggleHighContrast();
      }

      return "High Contrast Mode is now enabled.";
    }

    if (
      text.includes(
        "disable high contrast",
      ) ||
      text.includes(
        "turn off high contrast",
      )
    ) {
      if (highContrast) {
        toggleHighContrast();
      }

      return "High Contrast Mode is now disabled.";
    }

    if (
      text.includes(
        "enable large text",
      ) ||
      text.includes(
        "turn on large text",
      ) ||
      text.includes(
        "increase text size",
      )
    ) {
      if (!largeText) {
        toggleLargeText();
      }

      return "Large Text Mode is now enabled.";
    }

    if (
      text.includes(
        "disable large text",
      ) ||
      text.includes(
        "turn off large text",
      ) ||
      text.includes(
        "normal text size",
      )
    ) {
      if (largeText) {
        toggleLargeText();
      }

      return "Large Text Mode is now disabled.";
    }

    if (
      text.includes(
        "enable voice safety",
      ) ||
      text.includes(
        "turn on voice safety",
      ) ||
      text.includes(
        "voice safety on",
      )
    ) {
      if (!speechSafetyMode) {
        toggleSpeechSafetyMode();
      }

      return "Voice Safety Mode is now enabled.";
    }

    if (
      text.includes(
        "disable voice safety",
      ) ||
      text.includes(
        "turn off voice safety",
      ) ||
      text.includes(
        "voice safety off",
      )
    ) {
      if (speechSafetyMode) {
        toggleSpeechSafetyMode();
      }

      return "Voice Safety Mode is now disabled.";
    }

    return null;
  };


  // ===================================================
  // FIXED NAVIGATION COMMAND HANDLER
  //
  // VERY IMPORTANT:
  //
  // "Tell me about Rihand Dam"
  //
  // MUST NOT match "about".
  //
  // Only explicit navigation requests are allowed.
  // ===================================================

  const handleNavigationCommand = (
    command,
  ) => {
    const text =
      command
        .toLowerCase()
        .trim();

    // -----------------------------------------------
    // If this looks like a QUESTION, NEVER navigate.
    // -----------------------------------------------

    const isQuestion =
      text.includes("?") ||
      /^(what|who|where|when|why|how|which|can|could|will|is|are|tell me|explain|describe|give me|show me information|find|compare)/i.test(
        text,
      );

    if (isQuestion) {
      return null;
    }

    // -----------------------------------------------
    // Navigation must explicitly request an action.
    // -----------------------------------------------

    const navigationIntent =
      /^(open|go to|goto|navigate to|take me to|visit|show|launch|load|display)\b/i.test(
        text,
      );

    if (!navigationIntent) {
      return null;
    }

    for (
      const page of PAGE_COMMANDS
    ) {
      const matched =
        page.names.some(
          (name) =>
            text.includes(
              name,
            ),
        );

      if (matched) {
        navigate(
          page.path,
        );

        return `Opening ${page.label}.`;
      }
    }

    return null;
  };


  // ===================================================
  // LANGUAGE COMMAND
  // ===================================================

  const handleLanguageCommand = (
    command,
  ) => {
    const text =
      command.toLowerCase();

    const mentionsLanguage =
      text.includes(
        "language",
      ) ||
      text.includes(
        "hindi",
      ) ||
      text.includes(
        "english",
      ) ||
      text.includes(
        "bengali",
      ) ||
      text.includes(
        "marathi",
      ) ||
      text.includes(
        "tamil",
      ) ||
      text.includes(
        "telugu",
      ) ||
      text.includes(
        "kannada",
      ) ||
      text.includes(
        "malayalam",
      ) ||
      text.includes(
        "gujarati",
      ) ||
      text.includes(
        "punjabi",
      );

    if (!mentionsLanguage) {
      return null;
    }

    if (
      text.includes(
        "english",
      )
    ) {
      const lang =
        languages.find(
          (item) =>
            item.code ===
              "en" ||
            item.name
              ?.toLowerCase() ===
              "english",
        );

      if (lang) {
        setLanguage(
          lang.code,
        );

        return "Language changed to English.";
      }
    }

    if (
      text.includes(
        "hindi",
      )
    ) {
      const lang =
        languages.find(
          (item) =>
            item.code ===
              "hi" ||
            item.name
              ?.toLowerCase() ===
              "hindi",
        );

      if (lang) {
        setLanguage(
          lang.code,
        );

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

    for (
      const name of
        languageNames
    ) {
      if (
        text.includes(name)
      ) {
        const lang =
          languages.find(
            (item) =>
              item.name
                ?.toLowerCase() ===
                name ||
              item.nativeName
                ?.toLowerCase()
                .includes(name),
          );

        if (lang) {
          setLanguage(
            lang.code,
          );

          return `Language changed to ${lang.nativeName}.`;
        }
      }
    }

    return null;
  };


  // ===================================================
  // EMERGENCY COMMAND
  // ===================================================

  const handleEmergencyCommand = (
    command,
  ) => {
    const text =
      command.toLowerCase();

    const wantsEmergency =
      text.includes(
        "activate emergency",
      ) ||
      text.includes(
        "activate emergency mode",
      ) ||
      text.includes(
        "turn on emergency",
      ) ||
      text.includes(
        "enable emergency mode",
      ) ||
      text === "code red";

    if (!wantsEmergency) {
      return null;
    }

    if (emergencyModeActive) {
      return "Emergency Mode is already active.";
    }

    return {
      confirmation: true,
      message:
        "Emergency Mode can activate the PRAVAH emergency interface. Do you want me to activate Emergency Mode?",
    };
  };


  // ===================================================
  // CONFIRM EMERGENCY
  // ===================================================

  const confirmEmergency = () => {
    if (!emergencyModeActive) {
      toggleEmergencyMode();
    }

    addAssistantMessage(
      "Emergency Mode has been activated. PRAVAH is now displaying the emergency response interface.",
    );
  };


  // ===================================================
  // LOCAL COMMAND ROUTER
  // ===================================================

  const executeLocalCommand = (
    text,
  ) => {
    // -----------------------------------------------
    // 1. Theme
    // -----------------------------------------------

    const themeResult =
      handleThemeCommand(
        text,
      );

    if (themeResult) {
      return themeResult;
    }

    // -----------------------------------------------
    // 2. Accessibility
    // -----------------------------------------------

    const accessibilityResult =
      handleAccessibilityCommand(
        text,
      );

    if (
      accessibilityResult
    ) {
      return accessibilityResult;
    }

    // -----------------------------------------------
    // 3. Emergency
    // -----------------------------------------------

    const emergencyResult =
      handleEmergencyCommand(
        text,
      );

    if (emergencyResult) {
      return emergencyResult;
    }

    // -----------------------------------------------
    // 4. Language
    // -----------------------------------------------

    const languageResult =
      handleLanguageCommand(
        text,
      );

    if (languageResult) {
      return languageResult;
    }

    // -----------------------------------------------
    // 5. Navigation
    //
    // This now ONLY catches explicit navigation.
    // -----------------------------------------------

    const navigationResult =
      handleNavigationCommand(
        text,
      );

    if (
      navigationResult
    ) {
      return navigationResult;
    }

    // -----------------------------------------------
    // 6. EVERYTHING ELSE -> GEMINI
    // -----------------------------------------------

    return null;
  };


  // ===================================================
  // SEND MESSAGE
  // ===================================================

  const handleSend = async (
    textToSend,
  ) => {
    const text =
      textToSend || input;

    if (
      !text.trim() ||
      isLoading
    ) {
      return;
    }

    const cleanText =
      text.trim();

    // -----------------------------------------------
    // USER MESSAGE
    // -----------------------------------------------

    const userMessage = {
      id:
        `msg-${Date.now()}`,
      role: "user",
      content:
        cleanText,
      timestamp:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
    };

    setMessages(
      (prev) => [
        ...prev,
        userMessage,
      ],
    );

    setInput("");

    // -----------------------------------------------
    // LOCAL PRAVAH COMMAND
    // -----------------------------------------------

    const localResult =
      executeLocalCommand(
        cleanText,
      );

    if (localResult) {
      if (
        localResult.confirmation
      ) {
        setMessages(
          (prev) => [
            ...prev,
            {
              id:
                `msg-${Date.now()}-confirm`,
              role: "assistant",
              content:
                localResult.message,
              confirmation:
                true,
              timestamp:
                new Date().toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                ),
            },
          ],
        );

        return;
      }

      addAssistantMessage(
        localResult,
      );

      return;
    }

    // =================================================
    // GEMINI
    // =================================================

    setIsLoading(true);

    try {
      const context = {
        // ---------------------------------------------
        // USER
        // ---------------------------------------------

        userLocation:
          location?.name ||
          null,

        // ---------------------------------------------
        // NEAREST DAM
        // ---------------------------------------------

        nearestDam:
          nearestDam
            ? {
                name:
                  nearestDam.name,
                id:
                  nearestDam.id,
                waterLevel:
                  nearestDam.currentWaterLevel,
                riskLevel:
                  nearestDam.riskLevel,
                storagePercentage:
                  nearestDam.storagePercentage,
              }
            : null,

        // ---------------------------------------------
        // NEAREST SHELTER
        // ---------------------------------------------

        nearestShelter:
          nearestShelter
            ? {
                name:
                  nearestShelter.name,
                capacity:
                  nearestShelter.capacity,
                occupancy:
                  nearestShelter.currentOccupancy,
                status:
                  nearestShelter.status,
              }
            : null,

        // ---------------------------------------------
        // UI STATE
        // ---------------------------------------------

        currentTheme:
          darkMode
            ? "dark"
            : "light",

        currentLanguage:
          activeLangObj?.name ||
          currentLanguage,

        // ---------------------------------------------
        // CAPABILITIES
        // ---------------------------------------------

        availableControls: [
          "change to light theme",
          "change to dark theme",
          "toggle theme",
          "enable high contrast",
          "disable high contrast",
          "enable large text",
          "disable large text",
          "enable voice safety",
          "disable voice safety",
          "activate emergency mode",
          "open dashboard",
          "open dam monitoring",
          "open live map",
          "open flood prediction",
          "open risk assessment",
          "open weather",
          "open alerts",
          "open emergency response",
          "open safe routes",
          "open shelters",
          "open reports",
          "open analytics",
          "open settings",
        ],

        // ---------------------------------------------
        // IMPORTANT
        // ---------------------------------------------

        chatbotInstruction:
          "For information questions, use Gemini and the PRAVAH application data. Do not navigate unless the user explicitly asks to open, go to, navigate to, show, launch, or visit a PRAVAH page.",
      };

      console.log(
        "PRAVAH AI question:",
        cleanText,
      );

      const reply =
        await geminiService.sendChatMessage(
          cleanText,
          messages.slice(-8),
          context,
        );

      const botMessage = {
        id:
          `msg-${Date.now()}-ai`,
        role: "assistant",
        content:
          reply ||
          "I could not generate a response.",
        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
      };

      setMessages(
        (prev) => [
          ...prev,
          botMessage,
        ],
      );

      if (speechActive) {
        speakAlert(
          botMessage.content,
          activeLangObj?.speechCode ||
            "en-IN",
        );
      }
    } catch (error) {
      console.error(
        "PRAVAH AI Error:",
        error,
      );

      addAssistantMessage(
        "PRAVAH AI could not connect to the Gemini service. Please check the Gemini API/server connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };


  // ===================================================
  // CLOSED
  // ===================================================

  if (!isOpen) {
    return null;
  }


  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="pravah-ai-chatbot fixed top-20 right-4 z-50 w-[95vw] sm:w-[430px] h-[600px] max-h-[82vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

      {/* =============================================
          HEADER
      ============================================== */}

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
                GEMINI
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
                (prev) =>
                  !prev,
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


      {/* =============================================
          STATUS
      ============================================== */}

      <div className="px-3 py-2 bg-blue-950/40 border-b border-blue-900/50 flex items-center gap-2">

        <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />

        <span className="text-[10px] text-blue-200">
          Gemini + PRAVAH Data Connected
        </span>

        <span className="ml-auto text-[9px] text-blue-400">
          {darkMode
            ? "Dark"
            : "Light"}{" "}
          •{" "}
          {currentLanguage}
        </span>

      </div>


      {/* =============================================
          MESSAGES
      ============================================== */}

      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">

        {messages.map(
          (message) => (
            <div
              key={
                message.id
              }
              className={`flex items-start gap-2 ${
                message.role ===
                "user"
                  ? "flex-row-reverse"
                  : ""
              }`}
            >

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  message.role ===
                  "user"
                    ? "bg-slate-700 text-slate-200"
                    : "bg-blue-950 border border-blue-700 text-blue-300"
                }`}
              >
                {message.role ===
                "user" ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              <div
                className={`max-w-[84%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  message.role ===
                  "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none"
                }`}
              >

                <div className="flex items-center justify-between gap-3 mb-1">

                  <span className="text-[10px] font-semibold text-slate-300">
                    {message.role ===
                    "user"
                      ? "You"
                      : "PRAVAH AI"}
                  </span>

                  <span className="text-[9px] text-slate-500">
                    {
                      message.timestamp
                    }
                  </span>

                </div>

                <p>
                  {
                    message.content
                  }
                </p>


                {/* Emergency confirmation */}

                {message.confirmation && (
                  <div className="mt-3 flex gap-2">

                    <button
                      onClick={
                        confirmEmergency
                      }
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                    >
                      Activate Emergency
                    </button>

                    <button
                      onClick={() =>
                        addAssistantMessage(
                          "Emergency activation cancelled.",
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold"
                    >
                      Cancel
                    </button>

                  </div>
                )}


                {/* Read aloud */}

                {message.role ===
                  "assistant" && (
                  <button
                    onClick={() =>
                      speakAlert(
                        message.content,
                        activeLangObj?.speechCode ||
                          "en-IN",
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
          ),
        )}


        {/* Loading */}

        {isLoading && (
          <div className="flex items-start gap-2">

            <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center">

              <Bot className="w-3.5 h-3.5 text-blue-300" />

            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-blue-300">

              <span className="animate-pulse">
                Gemini is analysing PRAVAH data...
              </span>

            </div>

          </div>
        )}

        <div
          ref={messagesEndRef}
        />

      </div>


      {/* =============================================
          QUICK ACTIONS
      ============================================== */}

      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950">

        <div className="text-[9px] font-bold text-blue-400 uppercase mb-1.5">
          Quick Actions
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">

          {[
            "Open Dashboard",
            "Open Live Map",
            "Open Alerts",
            "Change to Dark Theme",
            "Open Settings",
          ].map(
            (action) => (
              <button
                key={action}
                onClick={() =>
                  handleSend(
                    action,
                  )
                }
                className="shrink-0 text-[10px] px-2.5 py-1.5 rounded-full bg-slate-800 hover:bg-blue-950 hover:text-blue-300 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                {action}
              </button>
            ),
          )}

        </div>

      </div>


      {/* =============================================
          QUESTIONS
      ============================================== */}

      <div className="px-3 py-1.5 border-t border-slate-800 bg-slate-950/80 flex gap-1.5 overflow-x-auto">

        {QUICK_PROMPTS.map(
          (
            prompt,
            index,
          ) => (
            <button
              key={index}
              onClick={() =>
                handleSend(
                  prompt,
                )
              }
              className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-blue-950 hover:text-blue-300 text-slate-300 border border-slate-700 transition-colors"
            >
              {prompt}
            </button>
          ),
        )}

      </div>


      {/* =============================================
          INPUT
      ============================================== */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >

        <button
          type="button"
          onClick={
            toggleMic
          }
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
          onChange={(
            event,
          ) =>
            setInput(
              event.target
                .value,
            )
          }
          placeholder="Ask PRAVAH about dams, floods, alerts..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />


        <button
          type="submit"
          disabled={
            !input.trim() ||
            isLoading
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