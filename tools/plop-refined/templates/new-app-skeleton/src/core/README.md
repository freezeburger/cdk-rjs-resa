# Modélisation du Code par le Typage en TypeScript et Apport des Design Patterns

## Introduction

La modélisation du code constitue une étape essentielle dans le processus de conception logicielle.

 En TypeScript, le typage statique offre une opportunité de formaliser les **structures de données et les comportements** attendus au sein d’un système logiciel. 

---

## 1. Fondements de la Modélisation Typée

### 1.1 Interfaces et Types

L’interface permet de spécifier la forme d’un objet de manière déclarative :

```ts
interface Utilisateur {
  id: number;
  nom: string;
  email?: Email;
}

type Email = string;
```
Ce contrat de typage favorise la documentation implicite, la complétion automatique, ainsi que la détection précoce des erreurs.

###  1.2 Types Unions et Intersections

Les types unions (`|`) modélisent des alternatives tandis que les types intersections (&) décrivent des combinaisons :


```ts
type Etat = "chargement" | "succès" | "échec";

type Employe = {
  nom: string;
} & (
  | { statut: "temps plein"; salaire: number }
  | { statut: "freelance"; tarifHoraire: number }
);

```

Cette approche permet une représentation précise des variantes métiers.


###  1.2  Généricité

Les types génériques offrent une abstraction réutilisable :

```ts
function envelopper<T>(valeur: T): T[] {
  return [valeur];
}

envelopper<number>(1)

```


## 2. Apports des Design Patterns dans une Modélisation Typée

L’usage combiné du typage et des Design Patterns renforce la maintenabilité et la modularité de l’architecture.

###  2.1 Le Pattern Factory

Permet la création d’objets sans exposer la logique d’instanciation :

```ts
interface Vehicule {
  rouler(): void;
}

class Voiture implements Vehicule {
  rouler() {
    console.log("La voiture roule.");
  }
}

class Moto implements Vehicule {
  rouler() {
    console.log("La moto roule.");
  }
}

function vehiculeFactory(type: "voiture" | "moto"): Vehicule {
  if (type === "voiture") return new Voiture();
  return new Moto();
}


```

###  2.2 Le Pattern Strategy

Permet de modifier dynamiquement le comportement d’un algorithme :

```ts
interface StrategieDeTri {
  trier(tableau: number[]): number[];
}

class TriCroissant implements StrategieDeTri {
  trier(t) {
    return t.sort((a, b) => a - b);
  }
}

class TriDecroissant implements StrategieDeTri {
  trier(t) {
    return t.sort((a, b) => b - a);
  }
}

class ContexteTri {
  constructor(private strategie: StrategieDeTri) {}

  trier(tableau: number[]) {
    return this.strategie.trier(tableau);
  }
}

```

###  2.3 Le Pattern Observer

Facilite la mise en œuvre de systèmes réactifs ou événementiels :

```ts
type Observateur = (donnee: string) => void;

class Sujet {
  private observateurs: Observateur[] = [];

  abonner(obs: Observateur) {
    this.observateurs.push(obs);
  }

  notifier(donnee: string) {
    this.observateurs.forEach(obs => obs(donnee));
  }
}


```

##  3 Avantages du Typage dans la Conception Logicielle

- ✅ Détection statique des erreurs avant l’exécution.
- ✅ Documentation implicite et lisibilité du code.
- ✅ Séparation des responsabilités facilitée par les interfaces.
- ✅ Testabilité accrue grâce à la prévisibilité des types.
- ✅ Robustesse face au changement, notamment dans les grandes bases de code.