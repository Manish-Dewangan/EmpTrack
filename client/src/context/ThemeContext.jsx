import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext(null);

// ─── Hook ───────────────────────────────────────────────────────────────
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ─── Helpers ─────────────────────────────────────────────────────────────
const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
  } catch {
    // localStorage unavailable (private mode etc.)
  }

  return getSystemTheme();
};

const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      theme === "dark" ? "#0f172a" : "#ffffff"
    );
  }
};

// ─── Provider ────────────────────────────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isDark = theme === "dark";

  // Apply theme to DOM whenever theme changes
  useEffect(() => {
    applyTheme(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      const savedTheme = localStorage.getItem("theme");

      // Only follow system if user hasn't manually set a theme
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }

    // Fallback for older browsers
    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, []);

  // Add smooth transition class when toggling
  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);

    // Add transition class to root
    document.documentElement.classList.add("theme-transitioning");

    setTheme((prev) => (prev === "light" ? "dark" : "light"));

    // Remove transition class after animation
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Set specific theme
  const setSpecificTheme = useCallback((newTheme) => {
    if (newTheme !== "light" && newTheme !== "dark") return;
    setTheme(newTheme);
  }, []);

  // Reset to system theme
  const resetToSystemTheme = useCallback(() => {
    try {
      localStorage.removeItem("theme");
    } catch {
      // localStorage unavailable
    }
    setTheme(getSystemTheme());
  }, []);

  const value = {
    theme,
    isDark,
    isLight: !isDark,
    isTransitioning,
    toggleTheme,
    setTheme: setSpecificTheme,
    resetToSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};