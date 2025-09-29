import React from 'react'
import '../styles.css'

export interface FieldProps {
  label?: string
  hint?: string
  error?: string
  children: React.ReactNode
}

export const Field: React.FC<FieldProps> = ({ label, hint, error, children }) => {
  const id = React.useId()
  return (
    <label className="cdk-field" htmlFor={id}>
      {label && <span>{label}</span>}
      {React.isValidElement(children)
        ? React.cloneElement(children as any, { id, 'aria-invalid': !!error || undefined, 'aria-describedby': hint ? id+'-hint' : undefined })
        : children}
      {hint && !error && <span id={id+'-hint'} className="cdk-hint">{hint}</span>}
      {error && <span role="alert" className="cdk-error">{error}</span>}
    </label>
  )
}
