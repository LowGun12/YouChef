import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, CheckCircle2, X, Plus } from 'lucide-react'
import { usePantryStore } from '@/stores/pantryStore'
import { buildRecipeMatches, mockPantryItems, mockRecipes } from '@/utils/mockData'
import RecipeCard, { RecipeCardSkeleton } from '@/features/recipes/components/RecipeCard'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { RecipeMatch } from '@/types'

const CUISINES = ['All', 'Italian', 'Asian', 'American', 'Middle Eastern']
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'] as const

export default function RecipesPage() {
  const [searchParams] = useSearchParams()
  const { items } = usePantryStore()
  const pantryItems = items.length > 0 ? items : mockPantryItems

  const [search, setSearch] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [filterByPantry, setFilterByPantry] = useState(searchParams.get('filter') === 'canMake')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const matches = useMemo(() => buildRecipeMatches(pantryItems), [pantryItems])

  const filtered = useMemo<RecipeMatch[]>(() => {
    return matches.filter((m) => {
      const r = m.recipe
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
      if (cuisine !== 'All' && r.cuisine !== cuisine) return false
      if (difficulty !== 'all' && r.difficulty !== difficulty) return false
      if (filterByPantry && !m.canMake) return false
      return true
    })
  }, [matches, search, cuisine, difficulty, filterByPantry])

  const canMakeCount = matches.filter((m) => m.canMake).length

  const toggleSave = (recipeId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      next.has(recipeId) ? next.delete(recipeId) : next.add(recipeId)
      return next
    })
  }

  const hasFilters = search || cuisine !== 'All' || difficulty !== 'all' || filterByPantry

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary mb-1">Recipes</h1>
          <p className="text-sm text-text-secondary">
            {canMakeCount} recipe{canMakeCount !== 1 ? 's' : ''} you can cook right now
          </p>
        </div>
        <Link to="/recipes/new">
          <Button variant="primary" size="sm" icon={<Plus size={15} />}>
            New Recipe
          </Button>
        </Link>
      </div>

      {/* Search + filters */}
      <div className="space-y-3 mb-6">
        <Input
          placeholder="Search recipes..."
          icon={<Search size={15} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Pantry filter toggle */}
          <button
            onClick={() => setFilterByPantry(!filterByPantry)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              filterByPantry
                ? 'bg-green-500/15 text-green-400 border-green-500/30'
                : 'bg-bg-surface text-text-muted border-border hover:border-border-strong'
            }`}
          >
            <CheckCircle2 size={12} />
            Can cook now
          </button>

          {/* Cuisine filter */}
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                cuisine === c
                  ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                  : 'bg-bg-surface text-text-muted border-border hover:border-border-strong'
              }`}
            >
              {c}
            </button>
          ))}

          {/* Difficulty */}
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all capitalize ${
                difficulty === d
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  : 'bg-bg-surface text-text-muted border-border hover:border-border-strong'
              }`}
            >
              {d === 'all' ? 'Any difficulty' : d}
            </button>
          ))}

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setCuisine('All'); setDifficulty('all'); setFilterByPantry(false) }}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors ml-auto"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">
          {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
          {hasFilters ? ' match your filters' : ''}
        </p>
        {savedIds.size > 0 && (
          <Badge variant="green">{savedIds.size} saved</Badge>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((m) => (
              <RecipeCard
                key={m.recipe.id}
                match={m}
                saved={savedIds.has(m.recipe.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-bg-elevated rounded-2xl flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium mb-1">No recipes found</p>
          <p className="text-sm text-text-muted">Try adjusting your filters</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => { setSearch(''); setCuisine('All'); setDifficulty('all'); setFilterByPantry(false) }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
