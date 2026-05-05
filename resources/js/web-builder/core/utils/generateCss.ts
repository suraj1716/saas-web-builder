export const generateCss = (vars: Record<string, string>) => {
  if (!vars) return "";

  let css = ".template-root {\n"; // ✅ FIXED

  Object.entries(vars).forEach(([key, value]) => {
    css += `${key}: ${value};\n`;
  });

  css += "}";

  return css;
};