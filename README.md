# CDK React Monorepo (Skeleton)

Ceci un **Component Development Kit (CDK)** léger et personnalisable pour React, doté d’un système de design à la fois orienté et discret.

**Structure**:
- `@cdk/tokens`: Design tokens (JSON + TS).
- `@cdk/theme`: ThemeProvider + CSS variables.
- `@cdk/primitives`: Box/Stack/Text primitives.
- `@cdk/headless`: Headless hooks (behaviors).
- `@cdk/components`: Styled components (light opinion): Button, Field, Input (MVP).
- `@cdk/icons`: Minimal icon wrapper.
- `@cdk/presets`: Ready-to-use themes.
- `apps/playground`: Vite React sandbox.

## Démarrage Rapide

> [Voir les prérequis](./documentation/1.TOOLING.md)
> [Guide de structure](./documentation/2.STRUCTURE.md)
> [Workflow](./documentation/3.WORKFLOW.md)

```bash
pnpm i
pnpm -w build
pnpm -w dev    # starts the playground
```

> Outils: **pnpm workspaces**, **tsup** our les builds, **Vitest** pour les tests, **Typescript** en mode strict, et **Turborepo** optionnel (déjà configuré).

## Rapport:

<!-- LINE_COUNT_PLACEHOLDER_1 -->

**Lines of Code:** `631`  
**Project Size:** Compact utility 🛠️

| Extension | Files | Effective LOC |
|-----------|--------|----------------:|
| `.json` | 15 | 328 |
| `.tsx` | 8 | 180 |
| `.ts` | 14 | 74 |
| `.css` | 1 | 35 |
| `.md` | 7 | 14 |
| **Total** | **45** | **631** |

<!-- LINE_COUNT_PLACEHOLDER_2 -->