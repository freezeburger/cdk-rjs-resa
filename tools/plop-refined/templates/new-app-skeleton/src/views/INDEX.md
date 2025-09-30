# 🌱 Stratégie des fichiers `index.js` dans une application React

Dans une application React, on utilise souvent des fichiers `index.(js,jsx,ts,tsx)` dans les sous-répertoires (composants, pages, utils, etc.) pour simplifier les **imports** et améliorer la **lisibilité** du code.

## ✅ Pourquoi utiliser un fichier `index.(js,jsx,ts,tsx)` ?

Les fichiers `index.js` permettent de **centraliser les exports** d’un dossier. Ainsi, au lieu de devoir importer chaque fichier un par un, on peut les regrouper et les exposer via un seul point d'entrée.

## 📦 Exemple

Imaginons un dossier `components` contenant plusieurs composants :

/components 
├── Button.js 
├── Card.js 
└── index.js


```js
export { default as Button } from './Button';
export { default as Card } from './Card';
```

### Utilisation dans un autre fichier
```js
import { Button, Card } from './components';

/*
Au lieu de :
import Button from './components/Button';
import Card from './components/Card';
*/
```

## Avantages
- Code plus propre et modulaire
- Importations plus concises
- Facilite la maintenance en centralisant les exports