import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'orange' | 'red' | 'blue' | 'neutral'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  green: 'bg-green-500/15 text-green-400 border border-green-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/15',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  neutral: 'bg-bg-elevated text-text-secondary border border-border',
}

const sizes = {
  sm: 'text-xs px-2 py-0.5 rounded-full',
  md: 'text-xs px-2.5 py-1 rounded-full',
}

export default function Badge({ children, variant = 'neutral', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
