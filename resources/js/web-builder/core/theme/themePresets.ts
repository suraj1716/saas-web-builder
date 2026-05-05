export type ThemeVars = Record<string, string>;

export const themePresets: Record<string, ThemeVars> = {
  light: {
    "--color-primary": "#4f46e5",
    "--color-secondary": "#06b6d4",
    "--color-bg": "#ffffff",
    "--color-surface": "#f9fafb",
    "--color-text": "#111827",
    "--color-muted": "#6b7280",
  },

  dark: {
    "--color-primary": "#818cf8",
    "--color-secondary": "#22d3ee",
    "--color-bg": "#0f172a",
    "--color-surface": "#1e293b",
    "--color-text": "#f1f5f9",
    "--color-muted": "#94a3b8",
  },

  business: {
    "--color-primary": "#0ea5e9",
    "--color-secondary": "#0284c7",
    "--color-bg": "#ffffff",
    "--color-surface": "#f8fafc",
    "--color-text": "#0f172a",
    "--color-muted": "#64748b",
    "--radius-md": "6px",
  },
};