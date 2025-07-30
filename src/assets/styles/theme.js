
export const pxToRem = (px) => `${px / 16}rem`;
export const pxToMax = (px, baseVw = 1920, fontBase = 16) => {
  const rem = px / fontBase;
  const vw = (px / baseVw) * 100;
  return `max(${rem}rem, ${vw}vw)`;
};

export const colors = {
  primary: "#E5A6A6",
  secondary: "#C8BFE7",
  accent: "#F6C6A7",
  background: "#fff",
  sidebarBg: "#f3f0f8",
  text: "#5A4E4D",
  textLight: "#fff",
  muted: "#888",
  border: "#ede7f6",
  card: "#fff",
  highlight: "#b49be0",
  warning: "#ff6b6b",
  success: "#27ae60",
  info: "#c8bfe7",
  gray: "#ccc",
  dark: "#222",
};

export const fonts = {
  title: 'League Spartan, "League Spartan", Arial, sans-serif',
  body: 'Lato, "Lato", Arial, sans-serif',
};

export const fontSizes = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  md: "18px",
  lg: "22px",
  xl: "32px",
  xxl: "48px",
};
