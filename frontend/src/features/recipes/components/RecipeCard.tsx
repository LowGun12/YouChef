import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users, Bookmark, BookmarkCheck, ChefHat, CheckCircle2 } from 'lucide-react'
import type { RecipeMatch } from '@/types'
import Badge from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

interface RecipeCardProps {
  match: RecipeMatch
  saved?: boolean
  onToggleSave?: (recipeId: string) => void
}

const difficultyColor = {
  easy: 'green',
  medium: 'orange',
  hard: 'red',
} as const

export default function RecipeCard({ match, saved = false, onToggleSave }: RecipeCardProps) {
  const { recipe, canMake, matchPercent, missingIngredients, haveIngredients } = match
  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group bg-bg-surface border rounded-2xl overflow-hidden transition-all duration-300',
        'hover:shadow-card-hover hover:-translate-y-0.5',
        canMake ? 'border-green-500/30 hover:border-green-500/50' : 'border-border hover:border-border-strong',
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/9]">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
            <ChefHat size={40} className="text-text-muted" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {canMake ? (
            <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-glow">
              <CheckCircle2 size={12} />
              You can make this!
            </span>
          ) : matchPercent >= 60 ? (
            <span className="bg-orange-500/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {matchPercent}% match
            </span>
          ) : (
            <span className="bg-bg-surface/80 backdrop-blur text-text-muted text-xs font-medium px-2.5 py-1 rounded-full border border-border">
              {matchPercent}% match
            </span>
          )}

          {onToggleSave && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleSave(recipe.id)
              }}
              className={cn(
                'p-2 rounded-xl backdrop-blur transition-all duration-200',
                saved
                  ? 'bg-green-500 text-white shadow-glow'
                  : 'bg-bg-surface/80 text-text-secondary hover:text-green-400',
              )}
            >
              {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/recipes/${recipe.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text-primary leading-tight line-clamp-1">{recipe.title}</h3>
          <Badge variant={difficultyColor[recipe.difficulty]} size="sm" className="shrink-0 capitalize">
            {recipe.difficulty}
          </Badge>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2 mb-3">{recipe.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {recipe.servings} servings
          </span>
          <span className="text-text-muted">{recipe.cuisine}</span>
        </div>

        {/* Ingredient status */}
        {(haveIngredients.length > 0 || missingIngredients.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {haveIngredients.slice(0, 3).map((name) => (
              <span key={name} className="ingredient-tag ingredient-tag--have">
                ✓ {name}
              </span>
            ))}
            {missingIngredients.slice(0, 2).map((name) => (
              <span key={name} className="ingredient-tag ingredient-tag--missing">
                − {name}
              </span>
            ))}
            {(haveIngredients.length + missingIngredients.length) > 5 && (
              <span className="ingredient-tag ingredient-tag--missing">
                +{haveIngredients.length + missingIngredients.length - 5} more
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export function RecipeCardSkeleton() {
  return (
    <div className="bg-bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="skeleton aspect-[16/9]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex gap-3">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
    </div>
  )
}
