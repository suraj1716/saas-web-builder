const fs = require("fs");
const path = require("path");

// Args
const templateName = process.argv[2];
if (!templateName) {
  console.error("Usage: node generateTemplate.cjs <template-name>");
  process.exit(1);
}

// Paths
const templateDir = path.join(__dirname, "..", "storage", "templates", templateName);
const appRoot = path.join(__dirname, "..", "react-app", templateName);
const outputDir = path.join(appRoot, "src");

// Create folders
function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

mkdirp(appRoot);
mkdirp(outputDir);
mkdirp(path.join(outputDir, "components"));
mkdirp(path.join(outputDir, "pages"));

// Read template
const templateJsonPath = path.join(templateDir, "template.json");

if (!fs.existsSync(templateJsonPath)) {
  console.error("❌ Template JSON not found:", templateJsonPath);
  process.exit(1);
}

const templateData = JSON.parse(fs.readFileSync(templateJsonPath, "utf-8"));

// Helper
function sectionComponentName(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// ==============================
// ✅ GENERATE COMPONENT
// ==============================
function generateSectionComponent(section) {
  const compName = sectionComponentName(section.type);
  const contentKeys = Object.keys(section.content || {});

  const jsx = contentKeys.map(key => {
    if (key.toLowerCase().includes("heading"))
      return `<h1>{content.${key}}</h1>`;
    if (key.toLowerCase().includes("text"))
      return `<p>{content.${key}}</p>`;
    return `<p>{content.${key}}</p>`;
  }).join("\n    ");

  return `import React from "react";

type Props = {
  content: {
    ${contentKeys.map(key => `${key}: string`).join("\n    ")}
  };
};

const ${compName}: React.FC<Props> = ({ content }) => {
  return (
    <section className="${section.type}">
      ${jsx}
    </section>
  );
};

export default ${compName};
`;
}

// ==============================
// ✅ COLLECT ALL SECTIONS (FIXED)
// ==============================
const allSections = [];

// Pages
templateData.pages.forEach(page => {
  page.sections.forEach(section => {
    allSections.push(section);
  });
});

// Layout (Navbar + Footer)
if (templateData.layout?.navbar) {
  allSections.push(templateData.layout.navbar);
}

if (templateData.layout?.footer) {
  allSections.push(templateData.layout.footer);
}

// ==============================
// ✅ CREATE COMPONENTS
// ==============================
const sectionTypes = new Set();

allSections.forEach(section => {
  if (!sectionTypes.has(section.type)) {
    sectionTypes.add(section.type);

    const compCode = generateSectionComponent(section);

    fs.writeFileSync(
      path.join(outputDir, "components", `${sectionComponentName(section.type)}.tsx`),
      compCode
    );
  }
});

// ==============================
// ✅ GENERATE PAGE FILE
// ==============================
function generatePageFile(page) {
  const imports = new Set();
  let componentsJsx = "";

  // Sections
  page.sections.forEach(section => {
    const compName = sectionComponentName(section.type);
    imports.add(`import ${compName} from "../components/${compName}";`);

    const contentKeys = Object.keys(section.content || {});
    const contentObj = contentKeys
      .map(key => `${key}: ${JSON.stringify(section.content[key])}`)
      .join(", ");

    componentsJsx += `\n      <${compName} content={{ ${contentObj} }} />`;
  });

  // Navbar
  let navbarJsx = "";
  if (templateData.layout?.navbar) {
    imports.add(`import Navbar from "../components/Navbar";`);
    navbarJsx = `<Navbar content={${JSON.stringify(templateData.layout.navbar.content)}} />`;
  }

  // Footer
  let footerJsx = "";
  if (templateData.layout?.footer) {
    imports.add(`import Footer from "../components/Footer";`);
    footerJsx = `<Footer content={${JSON.stringify(templateData.layout.footer.content)}} />`;
  }

  const pageName = page.title.replace(/\s+/g, "");

  return `${[...imports].join("\n")}

import React from "react";

export default function ${pageName}() {
  return (
    <div>
      ${navbarJsx}
      ${componentsJsx}
      ${footerJsx}
    </div>
  );
}
`;
}

// ==============================
// ✅ CREATE PAGES
// ==============================
templateData.pages.forEach(page => {
  const pageCode = generatePageFile(page);

  fs.writeFileSync(
    path.join(outputDir, "pages", `${page.title.replace(/\s+/g, "")}.tsx`),
    pageCode
  );
});

// ==============================
// ✅ APP.TSX
// ==============================
const pageNames = templateData.pages.map(p =>
  p.title.replace(/\s+/g, "")
);

const imports = pageNames
  .map(name => `import ${name} from "./pages/${name}";`)
  .join("\n");

const appCode = `
import React from "react";
${imports}
import "./index.css";

function App() {
  return <${pageNames[0]} />;
}

export default App;
`;

fs.writeFileSync(path.join(outputDir, "App.tsx"), appCode);

// ==============================
// ✅ INDEX.TSX
// ==============================
const indexCode = `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

fs.writeFileSync(path.join(outputDir, "index.tsx"), indexCode);

// ==============================
// ✅ CSS FIX (IMPORTANT)
// ==============================
let cssContent = "";

// Try template CSS file
const cssPath = path.join(templateDir, "index.css");

if (fs.existsSync(cssPath)) {
  cssContent = fs.readFileSync(cssPath, "utf-8");
}

// If empty → generate from design
if (!cssContent || cssContent.trim() === "") {
  const design = templateData.design || {};

  cssContent = `
body {
  margin: 0;
  font-family: sans-serif;
  background: ${design.backgroundColor || "#ffffff"};
  color: ${design.textColor || "#000000"};
}

section {
  padding: 40px;
}
`;
}

fs.writeFileSync(path.join(outputDir, "index.css"), cssContent);

// DONE
console.log(`✅ React app generated at react-app/${templateName}/src`);