# Le Pattern HOC (Higher-Order Component) en React

Un Higher-Order Component (HOC) est une fonction qui prend un composant en argument et retourne un nouveau composant enrichi. C’est une manière de réutiliser de la logique entre plusieurs composants.

> Convention, commence par "with"

```jsx
const withSomething = (WrappedComponent) => {
  return (props) => {
    // logique supplémentaire
    return <WrappedComponent {...props} />;
  };
};
```

## Inspiration

```jsx
// Higher Order Function
const A = () => () => true;
const B = A() // () => true;
console.log( B() ) // true

// Currying -> Transformer une fonction avec plusieurs arguments en une série de fonctions imbriquées, chacune prenant un seul argument.

// Exemple

const applyDiscount = (price, percent) => price - price * percent / 100 ;
applyDiscount(100,20);

// const createDiscount = (percent) => {(price) => price - price * percent / 100 ;
// Modification
const createDiscount = (percent) => {
    const modifiedPercent = percent -5; // Add taxes
    return (price) => price - price * modifiedPercent / 100 ;
}
const discount80 = createDiscount(80)

const priceOne = discount80(1000)
const priceTwo = discount80(1000)
```

## Exemple HOC

```jsx
// Higher Order Component
import React from 'react';

const withCurrentDate = (WrappedComponent) => {
  return (props) => {
    const currentDate = new Date().toLocaleDateString();
    return <WrappedComponent {...props} currentDate={currentDate} />;
  };
};

// Composant de base
const Hello = ({ currentDate }) => (
  <div>
    <p>Bonjour ! Aujourd'hui, nous sommes le {currentDate}.</p>
  </div>
);

// Composant enrichi
const HelloWithDate = withCurrentDate(Hello);

```
