import React from 'react'
import '../styles.css'
import { Icon } from '@cdk/icons'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: 'solid' | 'ghost'
  tone?: 'primary' | 'neutral' | 'danger'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { loading, children, className, variant='solid', tone='primary', iconLeft, iconRight, ...rest },
  ref
){
  return (
    <button
      ref={ref}
      data-variant={variant}
      data-tone={tone}
      className={['cdk-btn', variant==='ghost' && 'ghost', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {loading ? <Icon name="loader" className="spin" aria-hidden /> : iconLeft}
      <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>{children}{iconRight}</span>
    </button>
  )
})
