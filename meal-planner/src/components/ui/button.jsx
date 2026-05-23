import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost',
  danger: 'btn btn--danger',
}

const Button = forwardRef(function Button({ className, variant = 'secondary', size, ...props }, ref) {
  return <button ref={ref} className={cn(variants[variant] || variants.secondary, size === 'sm' && 'btn--sm', className)} {...props} />
})

export { Button }
