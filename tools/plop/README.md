# tools/plop

Générateurs Plop centralisés pour le monorepo.

## Utilisation

1. Installer Plop à la racine :
   ```bash
   pnpm add -D plop
   ```

2. Ajouter le script dans `package.json` (racine) :
   ```json
   {
     "scripts": {
       "plop": "plop --plopfile tools/plop/plopfile.js"
     }
   }
   ```

3. Lancer :
   ```bash
   pnpm plop entry
   ```

## Ce que fait le générateur `entry`

- Propose de cibler un **package existant**, une **application existante**, ou de **créer une nouvelle application** (Vite + React + TS).
- Permet de générer : **Component**, **Hook**, **Service**, **Page** dans la cible choisie.
