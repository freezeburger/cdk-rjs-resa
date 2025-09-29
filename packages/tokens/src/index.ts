// tsconfig: "resolveJsonModule": true recommandé
import tokensJson from './tokens.json' assert { type: 'json' };

// immuabilité superficielle + types conservés
export const tokens = Object.freeze(tokensJson);
export type Tokens = typeof tokens;


/*
type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
};

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  Object.freeze(obj);
  for (const key of Object.getOwnPropertyNames(obj)) {
    // @ts-expect-error indexation volontaire
    const val = obj[key];
    if (val && (typeof val === 'object' || typeof val === 'function') && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj as DeepReadonly<T>;
}

import tokensJson from './tokens.json' assert { type: 'json' };

export const tokens = deepFreeze(tokensJson);
export type Tokens = typeof tokens;
*/