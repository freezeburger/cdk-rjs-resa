// tools/plop/generators/cdk.mjs
import fs from "node:fs";
import path from "node:path";

function ensureUniqueExport(content, line) {
  return content.includes(line) ? content : (content.trimEnd() + "\n" + line + "\n");
}

export default async function (plop) {
  plop.setHelper("kebabCase", (s) =>
    String(s).replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase()
  );

  plop.setGenerator("cdk", {
    description: "@cdk/* generators (tokens, theme, primitives, headless, components, lab, icons, presets)",
    prompts: [
      { type: "list", name: "pkg", message: "Package @cdk ciblé :", choices: [
        { name: "@cdk/tokens", value: "tokens" },
        { name: "@cdk/theme", value: "theme" },
        { name: "@cdk/primitives", value: "primitives" },
        { name: "@cdk/headless", value: "headless" },
        { name: "@cdk/components", value: "components" },
        { name: "@cdk/lab", value: "lab" },
        { name: "@cdk/icons", value: "icons" },
        { name: "@cdk/presets", value: "presets" },
      ]},
      { type: "input", name: "tokenName", message: "Nom du TOKEN :", when: (a)=>a.pkg==="tokens", validate:(v)=>!!v||"Nom requis" },
      { type: "input", name: "themeName", message: "Nom du Theme (PascalCase) :", when: (a)=>a.pkg==="theme", validate:(v)=>!!v||"Nom requis" },
      { type: "input", name: "primitiveName", message: "Nom de la Primitive (PascalCase) :", when: (a)=>a.pkg==="primitives", validate:(v)=>!!v||"Nom requis" },
      { type: "input", name: "themeRef", message: "Nom du Theme (pour stylage) :", when: (a)=>a.pkg==="primitives", validate:(v)=>!!v||"Nom requis" },
      { type: "list", name: "headlessKind", message: "Headless : hook ou service ?", when: (a)=>a.pkg==="headless", choices:[{name:"Hook",value:"hook"},{name:"Service (+ utilitaire)",value:"service"}] },
      { type: "input", name: "headlessName", message: "Nom (PascalCase service / camelCase hook) :", when: (a)=>a.pkg==="headless", validate:(v)=>!!v||"Nom requis" },
      { type: "input", name: "componentName", message: "Nom du composant (PascalCase) :", when: (a)=>a.pkg==="components", validate:(v)=>!!v||"Nom requis" },
      { type: "input", name: "iconName", message: "Nom de l'icône (kebab-case) :", when: (a)=>a.pkg==="icons", validate:(v)=>!!v||"Nom requis" },
      { type: "input", name: "presetPrimitive", message: "Nom de la primitive à inclure :", when: (a)=>a.pkg==="presets", validate:(v)=>!!v||"Nom requis" },
    ],
    actions: (answers) => {
      const actions = [];
      const pkgBase = `packages/${answers.pkg}/src`;

      if (answers.pkg === "tokens") {
        const tokensJsonPath = `packages/tokens/src/tokens.json`;
        const tokensTsPath = `packages/tokens/src/index.ts`;
        actions.push({
          type: "modify",
          path: tokensJsonPath,
          transform: (content) => {
            let obj; try { obj = JSON.parse(content || "{}"); } catch { throw new Error("tokens.json invalide"); }
            if (Object.prototype.hasOwnProperty.call(obj, answers.tokenName)) throw new Error("TOKEN déjà existant");
            obj[answers.tokenName] = "REPLACE_ME";
            return JSON.stringify(obj, null, 2) + "\n";
          },
        });
        actions.push({
          type: "modify",
          path: tokensTsPath,
          transform: (content) => ensureUniqueExport(content, `export const ${answers.tokenName.replace(/[-\s]/g, "_").toUpperCase()} = tokens["${answers.tokenName}"];`),
        });
      }

      if (answers.pkg === "theme") {
        const pDir = `${pkgBase}/providers/{{pascalCase themeName}}Provider`;
        actions.push(
          { type: "add", path: `${pDir}/{{pascalCase themeName}}Provider.tsx`, templateFile: "tools/plop/templates/cdk/theme/provider.hbs" },
          { type: "add", path: `${pDir}/index.ts`, templateFile: "tools/plop/templates/index.hbs" },
          { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./providers/{{pascalCase themeName}}Provider";`) }
        );
      }

      if (answers.pkg === "primitives") {
        const pDir = `${pkgBase}/{{pascalCase primitiveName}}`;
        actions.push(
          { type: "add", path: `${pDir}/{{pascalCase primitiveName}}.tsx`, templateFile: "tools/plop/templates/cdk/primitives/primitive.hbs" },
          { type: "add", path: `${pDir}/index.ts`, templateFile: "tools/plop/templates/index.hbs" },
          { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./{{pascalCase primitiveName}}";`) }
        );
      }

      if (answers.pkg === "headless") {
        if (answers.headlessKind === "hook") {
          actions.push(
            { type: "add", path: `${pkgBase}/hooks/use{{pascalCase headlessName}}.ts`, templateFile: "tools/plop/templates/cdk/headless/hook.hbs" },
            { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./hooks/use{{pascalCase headlessName}}";`) }
          );
        } else {
          actions.push(
            { type: "add", path: `${pkgBase}/services/{{kebabCase headlessName}}.service.ts`, templateFile: "tools/plop/templates/cdk/headless/service.hbs" },
            { type: "add", path: `${pkgBase}/utils/{{kebabCase headlessName}}.consumer.ts`, templateFile: "tools/plop/templates/cdk/headless/consumer.hbs" },
            { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./services/{{kebabCase headlessName}}.service";`) },
            { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./utils/{{kebabCase headlessName}}.consumer";`) }
          );
        }
      }

      if (answers.pkg === "components") {
        const cDir = `${pkgBase}/{{pascalCase componentName}}`;
        actions.push(
          { type: "add", path: `${cDir}/{{pascalCase componentName}}.tsx`, templateFile: "tools/plop/templates/cdk/components/component.hbs" },
          { type: "add", path: `${cDir}/index.ts`, templateFile: "tools/plop/templates/index.hbs" },
          { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./{{pascalCase componentName}}";`) }
        );
      }

      if (answers.pkg === "lab") {
        const lDir = `${pkgBase}/{{pascalCase componentName || "Experiment"}}`;
        actions.push({ type: "add", path: `${lDir}/README.md`, templateFile: "tools/plop/templates/cdk/lab/readme.hbs" });
      }

      if (answers.pkg === "icons") {
        const iDir = `${pkgBase}/icons`;
        actions.push(
          { type: "add", path: `${iDir}/{{kebabCase iconName}}.ts`, templateFile: "tools/plop/templates/cdk/icons/icon.hbs" },
          { type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export { default as {{pascalCase iconName}} } from "./icons/{{kebabCase iconName}}";`) }
        );
      }

      if (answers.pkg === "presets") {
        actions.push({ type: "modify", path: `${pkgBase}/index.ts`, transform: (c)=>ensureUniqueExport(c, `export * from "./{{pascalCase presetPrimitive}}";`) });
      }

      actions.push({ type: "shell", command: "pnpm prettier -w ." });
      return actions;
    },
  });
}
