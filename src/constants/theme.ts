export const COLORS = {
  primary: "#7C3AED",
  background: "#000000",
  surface: "#1a1a1a",
  border: "#333333",
  text: "#FFFFFF",
  textMuted: "#9e9e9e",
  danger: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
} as const;

export type ThemeColors = typeof COLORS;
