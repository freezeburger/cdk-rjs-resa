import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@cdk/theme'
import { Button, Field, Input } from '@cdk/components'
import { neutral, ocean } from '@cdk/presets'

function App() {
  const [theme, setTheme] = React.useState<'neutral'|'ocean'>('neutral')
  return (
    <ThemeProvider value={theme==='neutral' ? neutral : ocean}>
      <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto' }}>
        <h1>CDK Playground</h1>
        <div style={{ display:'flex', gap: 12, marginBottom: 16 }}>
          <Button onClick={() => setTheme('neutral')}>Neutral</Button>
          <Button variant="ghost" onClick={() => setTheme('ocean')}>Ocean</Button>
        </div>
        <div style={{ display:'grid', gap: 12, maxWidth: 360 }}>
          <Field label="Email" hint="Nous ne partagerons pas votre email.">
            <Input placeholder="vous@exemple.fr" />
          </Field>
          <Button>Valider</Button>
        </div>
      </div>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
