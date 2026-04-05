export function injectTemplateCss(css: string) {
    const styleId = "dynamic-template-css";
  
    let styleTag = document.getElementById(styleId);
  
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
  
    styleTag.innerHTML = css;
  }