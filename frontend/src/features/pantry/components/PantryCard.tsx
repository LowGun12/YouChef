import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { PantryItem, IngredientCategory } from '@/types'
import { cn } from '@/utils/cn'

const categoryColors: Record<IngredientCategory, string> = {
  produce: 'text-green-400 bg-green-500/10',
  dairy: 'text-blue-400 bg-blue-500/10',
  meat: 'text-red-400 bg-red-500/10',
  grains: 'text-orange-400 bg-orange-500/10',
  condiments: 'text-yellow-400 bg-yellow-500/10',
  frozen: 'text-cyan-400 bg-cyan-500/10',
  beverages: 'text-purple-400 bg-purple-500/10',
  other: 'text-text-muted bg-bg-overlay',
}

const categoryEmoji: Record<IngredientCategory, string> = {
  produce: '🥦',
  dairy: '🥛',
  meat: '🥩',
  grains: '🌾',
  condiments: '🫙',
  frozen: '❄️',
  beverages: '🥤',
  other: '📦',
}

interface PantryCardProps {
  item: PantryItem
  onRemove: (id: string) => void
}

export default function PantryCard({ item, onRemove }: PantryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="pantry-card group flex items-center gap-3"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0', categoryColors[item.category])}>
        {categoryEmoji[item.category]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
        <p className="text-xs text-text-muted capitalize">
          {item.quantity && item.unit ? `${item.quantity} ${item.unit} · ` : ''}
          {item.category}
        </p>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className={cn(
          'p-1.5 rounded-lg text-text-muted transition-all duration-200',
          'opacity-0 group-hover:opacity-100',
          'hover:text-red-400 hover:bg-red-500/10',
        )}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

export function PantryCardSkeleton() {
  return (
    <div className="pantry-card flex items-center gap-3">
      <div className="skeleton w-10 h-10" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-3 w-16" />
      </div>
    </div>
  )
}
