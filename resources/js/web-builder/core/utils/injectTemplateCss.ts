export function injectTemplateCss(css: string) {

  let styleTag = document.getElementById("dynamic-template-css");

  if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "dynamic-template-css";
      document.head.appendChild(styleTag);
  }
  
  styleTag.innerHTML = css;
}