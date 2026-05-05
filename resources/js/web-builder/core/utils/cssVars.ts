export function getCssVarBlock(css: string) {
    const match = css.match(/:root\s*{([\s\S]*?)}/);
    return match ? match[1] : "";
  }
  
  export function setCssVar(css: string, key: string, value: string) {
    if (!css.includes(":root")) return css;
  
    const regex = new RegExp(`(${key}\\s*:\\s*)([^;]+)`);
    if (regex.test(css)) {
      return css.replace(regex, `$1${value}`);
    }
  
    // fallback inject
    return css.replace(":root {", `:root {\n  ${key}: ${value};`);
  }