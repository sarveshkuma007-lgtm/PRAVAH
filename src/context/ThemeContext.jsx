import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("pravah_theme");

    if (saved) {
      return saved === "dark";
    }

    return false; // Light mode by default
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("pravah_high_contrast") === "true";
  });

  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem("pravah_large_text") === "true";
  });

  // Theme
  useEffect(() => {
    localStorage.setItem("pravah_theme", darkMode ? "dark" : "light");

    document.documentElement.classList.toggle("dark-theme-mode", darkMode);
    document.documentElement.classList.toggle("light-theme-mode", !darkMode);
  }, [darkMode]);

  // High contrast
  useEffect(() => {
    localStorage.setItem(
      "pravah_high_contrast",
      String(highContrast)
    );

    document.documentElement.classList.toggle(
      "high-contrast-mode",
      highContrast
    );
  }, [highContrast]);

  // Large text
  useEffect(() => {
    localStorage.setItem(
      "pravah_large_text",
      String(largeText)
    );

    document.documentElement.classList.toggle(
      "large-text-mode",
      largeText
    );
  }, [largeText]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,

        toggleDarkMode: () => {
          setDarkMode((prev) => !prev);
        },

        highContrast,
        setHighContrast,

        largeText,
        setLargeText,

        toggleHighContrast: () => {
          setHighContrast((prev) => !prev);
        },

        toggleLargeText: () => {
          setLargeText((prev) => !prev);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}