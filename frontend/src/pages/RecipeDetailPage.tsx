import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Clock, Users, ChefHat, Bookmark, BookmarkCheck,
  CheckCircle2, XCircle, Timer, AlertTriangle,
} from 'lucide-react'
import { usePantryStore } from '@/stores/pantryStore'
import { recipesService } from '@/services/recipes.service'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { items: pantryItems } = usePantryStore()
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipesService.getById(id!),
    enabled: !!id,
  })

  const saveMutation = useMutation({
    mutationFn: (recipeId: string) => recipesService.saveRecipe(recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes', 'saved'] }),
  })
  const unsaveMutation = useMutation({
    mutationFn: (recipeId: string) => recipesService.unsaveRecipe(recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes', 'saved'] }),
  })

  const [saved, setSaved] = useState(false)

  const pantryNames = useMemo(
    () => pantryItems.map((i) => i.name.toLowerCase()),
    [pantryItems],
  )

  const toggleSave = () => {
    if (saved) {
      unsaveMutation.mutate(id!)
    } else {
      saveMutation.mutate(id!)
    }
    setSaved(!saved)
  }

  const toggleStep = (order: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev)
      next.has(order) ? next.delete(order) : next.add(order)
      return next
    })
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="skeleton h-6 w-16 mb-5 rounded-xl" />
        <div className="skeleton rounded-3xl aspect-[16/9] mb-6" />
        <div className="space-y-3 mb-6">
          <div className="skeleton h-8 w-2/3 rounded-xl" />
          <div className="skeleton h-4 w-full rounded-xl" />
          <div className="skeleton h-4 w-3/4 rounded-xl" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 bg-bg-elevated rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-text-muted" />
        </div>
        <p className="text-text-secondary font-medium mb-1">Recipe not found</p>
        <p className="text-sm text-text-muted mb-4">It may have been deleted or the link is invalid.</p>
        <Link to="/recipes"><Button variant="secondary">Back to recipes</Button></Link>
      </div>
    )
  }

  const ingredientStatus = recipe.ingredients.map((ing) => ({
    ...ing,
    have: pantryNames.some(
      (p) => p.includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p),
    ),
  }))

  const haveCount = ingredientStatus.filter((i) => i.have && !i.optional).length
  const requiredCount = ingredientStatus.filter((i) => !i.optional).length
  const canMake = haveCount === requiredCount
  const matchPct = requiredCount > 0 ? Math.round((haveCount / requiredCount) * 100) : 100

  const difficultyColor = { easy: 'green', medium: 'orange', hard: 'red' } as const

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero image */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-6">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
            <ChefHat size={48} className="text-text-muted" />
          </div>
        )}

        {/* Pantry match badge */}
        <div className="absolute bottom-3 left-3">
          {canMake ? (
            <span className="flex items-center gap-1.5 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-glow">
              <CheckCircle2 size={13} /> You can make this!
            </span>
          ) : (
            <span className="bg-bg-surface/80 backdrop-blur text-text-secondary text-xs font-medium px-3 py-1.5 rounded-full border border-border">
              {matchPct}% pantry match
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={toggleSave}
          disabled={saveMutation.isPending || unsaveMutation.isPending}
          className={cn(
            'absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur transition-all duration-200',
            saved ? 'bg-green-500 text-white shadow-glow' : 'bg-bg-surface/80 text-text-secondary hover:text-green-400',
          )}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Title + meta */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-2xl font-extrabold text-text-primary leading-tight">{recipe.title}</h1>
          <Badge variant={difficultyColor[recipe.difficulty as keyof typeof difficultyColor] ?? 'neutral'} className="shrink-0 capitalize">
            {recipe.difficulty}
          </Badge>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{recipe.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-green-400" /> Prep: {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <Timer size={14} className="text-orange-400" /> Cook: {recipe.cookTime} min
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-blue-400" /> {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1.5">
            <ChefHat size={14} className="text-purple-400" /> {recipe.cuisine}
          </span>
        </div>
      </div>

      {/* Allergen / dietary badges */}
      {(recipe.allergens?.length > 0 || recipe.dietary?.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.allergens?.map((a) => (
            <Badge key={a} variant="red" size="sm" className="capitalize">⚠ {a}</Badge>
          ))}
          {recipe.dietary?.map((d) => (
            <Badge key={d} variant="green" size="sm" className="capitalize">{d}</Badge>
          ))}
        </div>
      )}

      {/* Ingredients */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Ingredients</h2>
          <span className="text-sm text-text-muted">{haveCount}/{requiredCount} in pantry</span>
        </div>

        {/* Match bar */}
        <div className="h-1.5 bg-bg-elevated rounded-full mb-5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className={cn(
              'h-full rounded-full',
              canMake ? 'bg-green-500' : matchPct >= 60 ? 'bg-orange-500' : 'bg-text-muted',
            )}
          />
        </div>

        <ul className="space-y-2">
          {ingredientStatus.map((ing) => (
            <li
              key={ing.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border',
                ing.have
                  ? 'bg-green-500/5 border-green-500/15'
                  : ing.optional
                    ? 'bg-bg-surface border-border opacity-60'
                    : 'bg-red-500/5 border-red-500/10',
              )}
            >
              {ing.have ? (
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              ) : (
                <XCircle size={16} className={cn('shrink-0', ing.optional ? 'text-text-muted' : 'text-red-400')} />
              )}
              <span className="flex-1 text-sm text-text-primary">
                {ing.quantity} {ing.unit} {ing.name}
              </span>
              {ing.optional && <span className="text-xs text-text-muted">optional</span>}
            </li>
          ))}
        </ul>

        {!canMake && (
          <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-sm text-orange-400 font-medium mb-1">Missing ingredients</p>
            <p className="text-xs text-text-secondary">
              {ingredientStatus.filter((i) => !i.have && !i.optional).map((i) => i.name).join(', ')}
            </p>
          </div>
        )}
      </section>

      {/* Instructions */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-text-primary mb-4">Instructions</h2>
        <div className="space-y-3">
          {recipe.instructions.map((step) => {
            const done = completedSteps.has(step.order)
            return (
              <motion.button
                key={step.order}
                layout
                onClick={() => toggleStep(step.order)}
                className={cn(
                  'w-full text-left flex gap-4 p-4 rounded-2xl border transition-all duration-200',
                  done ? 'bg-green-500/10 border-green-500/20' : 'bg-bg-surface border-border hover:border-border-strong',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors',
                    done ? 'bg-green-500 text-white' : 'bg-bg-elevated text-text-muted',
                  )}
                >
                  {done ? <CheckCircle2 size={16} /> : step.order}
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm leading-relaxed', done ? 'text-text-muted line-through' : 'text-text-primary')}>
                    {step.description}
                  </p>
                  {step.duration && !done && (
                    <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1">
                      <Timer size={11} /> {step.duration} min
                    </p>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
        {completedSteps.size === recipe.instructions.length && recipe.instructions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
          >
            <p className="text-green-400 font-bold text-lg">🎉 Recipe complete!</p>
            <p className="text-sm text-text-secondary mt-1">Enjoy your meal!</p>
          </motion.div>
        )}
      </section>

      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-6">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="neutral" size="md" className="capitalize">#{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}
