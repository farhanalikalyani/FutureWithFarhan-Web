import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then(v => {
      if (v === "true") setIsDark(true);
    });
  }, []);

  async function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem("darkMode", next.toString());
  }

  const theme = isDark ? {
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    textPrimary: Colors.dark.textPrimary,
    textSecondary: Colors.dark.textSecondary,
    textMuted: Colors.dark.textMuted,
    border: Colors.dark.border,
    white: Colors.dark.surface,
    primary: Colors.primary,
    card: Colors.dark.surfaceAlt,
  } : {
    background: Colors.background,
    surface: Colors.white,
    textPrimary: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    textMuted: Colors.textMuted,
    border: Colors.border,
    white: Colors.white,
    primary: Colors.primary,
    card: Colors.white,
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
