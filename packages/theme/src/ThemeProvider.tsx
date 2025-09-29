import { createContext, useContext, useMemo, PropsWithChildren } from 'react'
import { tokens as defaultTokens } from '@cdk/tokens'

type Scheme = 'light' | 'dark' | 'system'
export interface Theme {
  scheme?: Scheme
  brand?: { accent?: string }
  density?: 'compact' | 'normal' | 'cozy'
  radius?: 'sm'|'md'|'lg'|'full'
  tokens?: typeof defaultTokens
}

const ThemeContext = createContext<Theme>({})

export function useTheme() {
  return useContext(ThemeContext)
}

function cssVars(theme: Theme) {
  const t = theme.tokens ?? defaultTokens
  const radius = theme.radius ?? 'md'
  return `:root{
    --accent-500: ${theme.brand?.accent ?? t.color.accent[500]};
    --focus-ring: var(--accent-500);
    --radius: ${t.radius[radius]}px;
    --shadow-1: ${t.shadow['1']};
    --shadow-2: ${t.shadow['2']};
    --shadow-3: ${t.shadow['3']};
    --control-h: ${t.control.heights.md}px;
    --easing: ${t.easing.standard};
    --duration: ${t.duration.normal}ms;
  }`
}

export function ThemeProvider({ children, value }: PropsWithChildren<{ value?: Theme }>) {
  const v = useMemo(() => value ?? {}, [value])
  return (
    <ThemeContext.Provider value={v}>
      <style dangerouslySetInnerHTML={{ __html: cssVars(v) }} />
      {children}
    </ThemeContext.Provider>
  )
}
