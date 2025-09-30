// tools/plop/generators/entry-advanced.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.cwd();
const templatesRoot = "tools/plop/templates";

function readWorkspaceGlobs() {
  const wsFile = path.join(repoRoot, "pnpm-workspace.yaml");
  if (!fs.existsSync(wsFile)) return [];
  const content = fs.readFileSync(wsFile, "utf-8");
  const data = YAML.parse(content);
  return Array.isArray(data?.packages) ? data.packages : [];
}

function listDirsFromGlob(globStr) {
  const base = globStr.replace(/\*.*$/, "");
  const abs = path.join(repoRoot, base);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((name) => fs.existsSync(path.join(abs, name, "package.json")));
}

function resolveTargets() {
  const globs = readWorkspaceGlobs();
  const apps = new Set();
  const packages = new Set();

  const defaultApps = path.join(repoRoot, "apps");
  if (fs.existsSync(defaultApps)) {
    for (const n of fs.readdirSync(defaultApps)) {
      if (fs.existsSync(path.join(defaultApps, n, "package.json"))) apps.add(`apps/${n}`);
    }
  }
  const defaultPackages = path.join(repoRoot, "packages");
  if (fs.existsSync(defaultPackages)) {
    for (const n of fs.readdirSync(defaultPackages)) {
      if (fs.existsSync(path.join(defaultPackages, n, "package.json"))) packages.add(`packages/${n}`);
    }
  }
  for (const g of globs) {
    for (const name of listDirsFromGlob(g)) {
      if (name.startsWith("apps/")) apps.add(name);
      else packages.add(name);
    }
  }
  return { apps: Array.from(apps).sort(), packages: Array.from(packages).sort() };
}

export default async function (plop) {
  const { apps, packages } = resolveTargets();

  plop.setHelper("kebabCase", (s) =>
    String(s).replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase()
  );

  plop.setGenerator("entry-advanced", {
    description: "Apps/Packages existants ou nouvelle app à partir d'un squelette. Génère component/hook/service/page/feature + artefacts app.",
    prompts: [
      { type: "list", name: "targetKind", message: "Cible :", choices: [
        { name: "📦 Package existant", value: "package" },
        { name: "🧩 Application existante", value: "app" },
        { name: "🆕 Créer une nouvelle application (squelette fourni)", value: "newApp" },
      ]},
      { type: "list", name: "targetPath", message: "Choisir le package :", when: (a)=>a.targetKind==="package",
        choices: (packages.length?packages:[{name:"(aucun package trouvé)",value:"__none__",disabled:true}]) },
      { type: "list", name: "targetPath", message: "Choisir l'application :", when: (a)=>a.targetKind==="app",
        choices: (apps.length?apps:[{name:"(aucune app trouvée)",value:"__none__",disabled:true}]) },
      { type: "input", name: "newAppName", message: "Nom de la nouvelle application (kebab-case) :", when: (a)=>a.targetKind==="newApp",
        validate: (v)=>/^[a-z0-9-]+$/.test(v||"") || "kebab-case requis (ex: my-new-app)" },
      { type: "list", name: "artifact", message: "Artefact à générer :", when: (a)=>a.targetKind!=="newApp", choices: [
        { name: "Component (React)", value: "component" },
        { name: "Hook (React)", value: "hook" },
        { name: "Service (TS)", value: "service" },
        { name: "Page (React)", value: "page" },
        { name: "Feature (page+component+service+tests+story)", value: "feature" },
        { name: "App: DTO", value: "dto" },
        { name: "App: Container (Redux + local hook)", value: "container" },
        { name: "App: Layout", value: "layout" }
      ]},
      { type: "list", name: "style", message: "Style (component/page/feature) :", when: (a)=>["component","page","feature"].includes(a.artifact),
        choices: [{name:"CSS Modules",value:"css-modules"},{name:"Tailwind (classes)",value:"tailwind"},{name:"Aucun",value:"none"}] },
      { type: "list", name: "tests", message: "Tests :", when: (a)=>["component","hook","service","page","feature"].includes(a.artifact),
        choices: [{name:"Vitest",value:"vitest"},{name:"Jest",value:"jest"},{name:"Aucun",value:"none"}] },
      { type: "confirm", name: "storybook", message: "Générer une storybook story ?", when: (a)=>["component","page","feature"].includes(a.artifact), default: true },
      { type: "list", name: "layout", message: "Organisation :", when: (a)=>a.targetKind!=="newApp",
        choices: [{name:"Co-localisé (src/components/Foo/Foo.tsx)",value:"colocated"},{name:"Centralisé (src/components/ui/Foo/Foo.tsx)",value:"centralized"}] },
      { type: "list", name: "onExists", message: "Si des fichiers existent :", choices: [
        { name: "⏭️ Skip", value: "skip" },{ name: "✍️ Overwrite", value: "overwrite" },{ name: "🛑 Abort", value: "abort" }
      ], default: "skip" },
      { type: "confirm", name: "format", message: "Lancer Prettier après génération ?", default: true },
      { type: "input", name: "name", message: "Nom (PascalCase pour component/page/feature, camelCase pour hook/service) :", when: (a)=>a.targetKind!=="newApp",
        validate: (v)=>!!v || "Nom requis" },
    ],
    actions: (answers) => {
      const actions = [];
      const base = answers.targetKind === "newApp" ? `apps/${answers.newAppName}` : answers.targetPath;
      const force = answers.onExists === "overwrite";
      const t = (n) => `${templatesRoot}/${n}`;

      if (answers.targetKind === "newApp") {
        actions.push({ type: "addMany", destination: base, base: `${templatesRoot}/new-app-skeleton`, templateFiles: `${templatesRoot}/new-app-skeleton/**/*`, force });
        if (answers.format) actions.push({ type: "shell", command: "pnpm prettier -w ." });
        return actions;
      }

      if (answers.onExists === "abort") { actions.push(()=>{ throw new Error("Abandon (onExists=abort)."); }); return actions; }

      const colocated = answers.layout === "colocated";
      const cmpDir = colocated ? `${base}/src/components/{{pascalCase name}}` : `${base}/src/components/ui/{{pascalCase name}}`;
      const pageDir = `${base}/src/pages/{{pascalCase name}}`;
      const hooksDir = `${base}/src/hooks`;
      const svcDir = `${base}/src/core/service`;
      const dtoDir = `${base}/src/core/dto`;
      const containerDir = `${base}/src/container`;
      const layoutDir = `${base}/src/layouts`;

      const addCmp = () => {
        actions.push(
          { type: "add", path: `${cmpDir}/{{pascalCase name}}.tsx`, templateFile: t("app/component.hbs"), force },
          { type: "add", path: `${cmpDir}/index.ts`, templateFile: t("index.hbs"), force },
        );
        if (answers.style === "css-modules") actions.push({ type: "add", path: `${cmpDir}/{{pascalCase name}}.module.css`, templateFile: t("app/component.module.css.hbs"), force });
        if (answers.tests !== "none") actions.push({ type: "add", path: `${cmpDir}/{{pascalCase name}}.test.tsx`, templateFile: t(`tests/component.test.${answers.tests}.hbs`), force });
        if (answers.storybook) actions.push({ type: "add", path: `${cmpDir}/{{pascalCase name}}.stories.tsx`, templateFile: t("stories/component.stories.hbs"), force });
      };

      const addPage = () => {
        actions.push(
          { type: "add", path: `${pageDir}/{{pascalCase name}}.page.tsx`, templateFile: t("app/page.hbs"), force },
          { type: "add", path: `${pageDir}/index.ts`, templateFile: t("index.hbs"), force },
        );
        if (answers.style === "css-modules") actions.push({ type: "add", path: `${pageDir}/{{pascalCase name}}.module.css`, templateFile: t("app/page.module.css.hbs"), force });
        if (answers.tests !== "none") actions.push({ type: "add", path: `${pageDir}/{{pascalCase name}}.page.test.tsx`, templateFile: t(`tests/page.test.${answers.tests}.hbs`), force });
        if (answers.storybook) actions.push({ type: "add", path: `${pageDir}/{{pascalCase name}}.stories.tsx`, templateFile: t("stories/page.stories.hbs"), force });
      };

      const addHook = () => {
        actions.push({ type: "add", path: `${hooksDir}/use{{pascalCase name}}.hook.ts`, templateFile: t("app/hook.hbs"), force });
        if (answers.tests !== "none") actions.push({ type: "add", path: `${hooksDir}/use{{pascalCase name}}.hook.test.ts`, templateFile: t(`tests/hook.test.${answers.tests}.hbs`), force });
      };

      const addService = () => {
        actions.push({ type: "add", path: `${svcDir}/{{kebabCase name}}.service.ts`, templateFile: t("app/service.hbs"), force });
        if (answers.tests !== "none") actions.push({ type: "add", path: `${svcDir}/{{kebabCase name}}.service.test.ts`, templateFile: t(`tests/service.test.${answers.tests}.hbs`), force });
      };

      const addDto = () => {
        actions.push({ type: "add", path: `${dtoDir}/{{kebabCase name}}.dto.ts`, templateFile: t("app/dto.hbs"), force });
      };

      const addContainer = () => {
        actions.push(
          { type: "add", path: `${containerDir}/{{pascalCase name}}.container.tsx`, templateFile: t("app/container.hbs"), force },
          { type: "add", path: `${containerDir}/use{{pascalCase name}}Logic.ts`, templateFile: t("app/container.logic.hbs"), force },
        );
      };

      const addLayout = () => {
        actions.push({ type: "add", path: `${layoutDir}/{{pascalCase name}}.layout.tsx`, templateFile: t("app/layout.hbs"), force });
      };

      switch (answers.artifact) {
        case "component": addCmp(); break;
        case "page": addPage(); break;
        case "hook": addHook(); break;
        case "service": addService(); break;
        case "dto": addDto(); break;
        case "container": addContainer(); break;
        case "layout": addLayout(); break;
        case "feature": addPage(); addCmp(); addService(); if (answers.tests !== "none") addHook(); break;
      }

      if (answers.format) actions.push({ type: "shell", command: "pnpm prettier -w ." });
      return actions;
    },
  });
}
