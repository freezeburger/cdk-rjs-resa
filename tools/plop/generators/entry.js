
// tools/plop/generators/entry.js
import fs from "fs";
import path from "path";

function listWorkspaces(cwd) {
  const appsDir = path.join(cwd, "apps");
  const packagesDir = path.join(cwd, "packages");

  const isPkg = (p) => {
    try {
      return fs.existsSync(path.join(p, "package.json"));
    } catch {
      return false;
    }
  };

  const safeList = (dir) =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((name) => isPkg(path.join(dir, name)))
      : [];

  return {
    apps: safeList(appsDir),
    packages: safeList(packagesDir),
  };
}

export default function (plop) {
  const cwd = process.cwd();
  const { apps, packages } = listWorkspaces(cwd);

  plop.setHelper("kebabCase", (txt) =>
    String(txt)
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase()
  );

  plop.setGenerator("entry", {
    description:
      "Générateur d'entrée: choisir package/app existant ou créer une nouvelle application, puis générer un artefact (component/hook/service/page).",
    prompts: [
      {
        type: "list",
        name: "targetKind",
        message: "Cible :",
        choices: [
          { name: "📦 Package existant", value: "package" },
          { name: "🧩 Application existante", value: "app" },
          { name: "🆕 Créer une nouvelle application", value: "newApp" },
        ],
      },
      // If existing package/app, choose which one
      {
        type: "list",
        name: "whichPackage",
        message: "Quel package ?",
        when: (a) => a.targetKind === "package",
        choices: packages.length
          ? packages
          : [{ name: "(aucun package trouvé)", value: "__none__", disabled: true }],
      },
      {
        type: "list",
        name: "whichApp",
        message: "Quelle application ?",
        when: (a) => a.targetKind === "app",
        choices: apps.length
          ? apps
          : [{ name: "(aucune app trouvée)", value: "__none__", disabled: true }],
      },
      // If creating new app
      {
        type: "input",
        name: "newAppName",
        message: "Nom de la nouvelle application (kebab-case) :",
        when: (a) => a.targetKind === "newApp",
        validate: (v) =>
          /^[a-z0-9-]+$/.test(v || "") || "Utilise kebab-case (ex: my-new-app)",
      },
      // What do we want to create (for app/package targets)
      {
        type: "list",
        name: "artifact",
        message: "Que veux-tu générer ?",
        when: (a) => a.targetKind !== "newApp",
        choices: [
          { name: "React Component", value: "component" },
          { name: "React Hook", value: "hook" },
          { name: "Service (TS)", value: "service" },
          { name: "Page (React)", value: "page" },
        ],
      },
      {
        type: "input",
        name: "name",
        message: "Nom (PascalCase pour component/page, camelCase pour hook/service) :",
        when: (a) => a.targetKind !== "newApp",
        validate: (v) => !!v || "Nom requis",
      },
    ],
    actions: (answers) => {
      const actions = [];
      const templatesRoot = "tools/plop/templates";

      const targetBase =
        answers.targetKind === "package"
          ? `packages/${answers.whichPackage}`
          : answers.targetKind === "app"
          ? `apps/${answers.whichApp}`
          : null;

      if (answers.targetKind === "newApp") {
        // Scaffold a new Vite React TS app
        const base = `apps/${answers.newAppName}`;
        actions.push(
          { type: "add", path: `${base}/package.json`, templateFile: `${templatesRoot}/new-app/package.json.hbs` },
          { type: "add", path: `${base}/index.html`, templateFile: `${templatesRoot}/new-app/index.html.hbs` },
          { type: "add", path: `${base}/tsconfig.json`, templateFile: `${templatesRoot}/new-app/tsconfig.json.hbs` },
          { type: "add", path: `${base}/tsconfig.node.json`, templateFile: `${templatesRoot}/new-app/tsconfig.node.json.hbs` },
          { type: "add", path: `${base}/vite.config.ts`, templateFile: `${templatesRoot}/new-app/vite.config.ts.hbs` },
          { type: "add", path: `${base}/src/main.tsx`, templateFile: `${templatesRoot}/new-app/src/main.tsx.hbs` },
          { type: "add", path: `${base}/src/App.tsx`, templateFile: `${templatesRoot}/new-app/src/App.tsx.hbs` },
          { type: "add", path: `${base}/src/index.css`, templateFile: `${templatesRoot}/new-app/src/index.css.hbs` }
        );
        return actions;
      }

      // For existing app/package, route by artifact
      if (!targetBase) return actions;

      if (answers.artifact === "component") {
        actions.push(
          {
            type: "add",
            path: `${targetBase}/src/components/{{pascalCase name}}/{{pascalCase name}}.tsx`,
            templateFile: `${templatesRoot}/component.hbs`,
          },
          {
            type: "add",
            path: `${targetBase}/src/components/{{pascalCase name}}/index.ts`,
            templateFile: `${templatesRoot}/index.hbs`,
          }
        );
      }

      if (answers.artifact === "hook") {
        actions.push({
          type: "add",
          path: `${targetBase}/src/hooks/use{{pascalCase name}}.ts`,
          templateFile: `${templatesRoot}/hook.hbs`,
        });
      }

      if (answers.artifact === "service") {
        actions.push({
          type: "add",
          path: `${targetBase}/src/services/{{kebabCase name}}.service.ts`,
          templateFile: `${templatesRoot}/service.hbs`,
        });
      }

      if (answers.artifact === "page") {
        actions.push(
          {
            type: "add",
            path: `${targetBase}/src/pages/{{pascalCase name}}/{{pascalCase name}}.tsx`,
            templateFile: `${templatesRoot}/page.hbs`,
          },
          {
            type: "add",
            path: `${targetBase}/src/pages/{{pascalCase name}}/index.ts`,
            templateFile: `${templatesRoot}/index.hbs`,
          }
        );
      }

      return actions;
    },
  });
}
