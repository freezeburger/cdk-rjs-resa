import React from 'react'
import '../styles.css'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={['cdk-input', className].filter(Boolean).join(' ')} {...rest} />
  }
)
