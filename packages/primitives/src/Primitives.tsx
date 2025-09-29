import React from 'react'

export type BoxProps<E extends React.ElementType = 'div'> = {
  as?: E
  className?: string
  style?: React.CSSProperties
  p?: number
  px?: number
  py?: number
  gap?: number
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'style'>

export function Box<E extends React.ElementType = 'div'>(props: BoxProps<E>) {
  const { as, className, style, p, px, py, gap, ...rest } = props as any
  const Comp = (as ?? 'div')
  const s: React.CSSProperties = {
    padding: p,
    paddingInline: px,
    paddingBlock: py,
    gap,
    ...style
  }
  return <Comp className={className} style={s} {...rest} />
}

export const Stack = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ style, ...rest }, ref) => (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }} {...rest} />
  )
)

export const Text: React.FC<React.ComponentProps<'span'>> = ({ style, ...rest }) => (
  <span style={{ lineHeight: 1.4, ...style }} {...rest} />
)
