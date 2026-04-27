const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? '#040a17' : '#f1f5f9',
    paper: darkMode ? '#081326' : '#ffffff',
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? '#3b82f6' : '#1d4ed8'),
    light: darkMode ? '#93c5fd' : '#60a5fa',
    dark: darkMode ? '#1d4ed8' : '#1e3a8a',
    contrastText: '#ffffff',
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || (darkMode ? '#818cf8' : '#6366f1'),
    light: darkMode ? '#c7d2fe' : '#a5b4fc',
    contrastText: '#ffffff',
  },
  neutral: {
    main: darkMode ? '#64748b' : '#94a3b8',
  },
  geometry: {
    main: '#38bdf8',
  },
  alwaysDark: {
    main: '#040a17',
  },
  divider: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.1)',
  text: {
    primary: darkMode ? '#e2e8f0' : '#0f172a',
    secondary: darkMode ? '#94a3b8' : '#475569',
  },
});
