import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Package, BookOpen, CheckCircle2, TrendingUp, ArrowRight, ChefHat, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { usePantryStore } from '@/stores/pantryStore'
import { recipesService } from '@/services/recipes.service'
import RecipeCard, { RecipeCardSkeleton } from '@/features/recipes/components/RecipeCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { items: pantryItems } = usePantryStore()
  const firstName = user?.name?.split(' ')[0] ?? 'Chef'

  const { data: matches = [], isLoading, isError } = useQuery({
    queryKey: ['recipes', 'matches'],
    queryFn: () => recipesService.getMatches(),
    staleTime: 1000 * 60 * 2,
  })

  const cookableRecipes = matches.filter((m) => m.canMake)
  const topSuggestions = [...matches]
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 3)

  const avgMatch = matches.length > 0
    ? Math.round(matches.reduce((s, m) => s + m.matchPercent, 0) / matches.length)
    : 0

  const stats = [
    {
      icon: Package,
      label: 'Pantry items',
      value: pantryItems.length,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      to: '/pantry',
    },
    {
      icon: CheckCircle2,
      label: 'Can cook now',
      value: isLoading ? '…' : cookableRecipes.length,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      to: '/recipes?filter=canMake',
    },
    {
      icon: BookOpen,
      label: 'Total recipes',
      value: isLoading ? '…' : matches.length,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      to: '/recipes',
    },
    {
      icon: TrendingUp,
      label: 'Avg match',
      value: isLoading ? '…' : `${avgMatch}%`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      to: '/recipes',
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1"
        >
          Good cooking, <span className="gradient-text">{firstName}</span> 👋
        </motion.h1>
        <p className="text-text-secondary text-sm">
          {isLoading
            ? 'Checking your pantry matches…'
            : cookableRecipes.length > 0
              ? `You can cook ${cookableRecipes.length} recipe${cookableRecipes.length > 1 ? 's' : ''} right now!`
              : pantryItems.length === 0
                ? 'Add items to your pantry to unlock recipe suggestions.'
                : 'Add more pantry items or create new recipes to improve your matches.'}
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6 text-sm text-red-400">
          <AlertTriangle size={15} className="shrink-0" />
          Couldn't load recipes — make sure the backend is running.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={stat.to}
              className="bg-bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-border-strong hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Can cook now */}
      {(isLoading || cookableRecipes.length > 0) && (
        <section className="mb-10">
          <div className="section-header mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary">Ready to cook</h2>
              {!isLoading && <Badge variant="green">{cookableRecipes.length}</Badge>}
            </div>
            <Link to="/recipes?filter=canMake">
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />}>See all</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <RecipeCardSkeleton key={i} />)
              : cookableRecipes.slice(0, 3).map((m) => <RecipeCard key={m.recipe.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Best matches */}
      <section className="mb-10">
        <div className="section-header mb-4">
          <h2 className="text-lg font-bold text-text-primary">Best matches</h2>
          <Link to="/recipes">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />}>All recipes</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : topSuggestions.map((m) => <RecipeCard key={m.recipe.id} match={m} />)}
        </div>
      </section>

      {/* Empty pantry CTA */}
      {!isLoading && pantryItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-border rounded-3xl p-8 text-center"
        >
          <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={28} className="text-green-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Build your pantry</h3>
          <p className="text-sm text-text-secondary mb-5 max-w-xs mx-auto">
            Scan barcodes or add items manually to unlock personalised recipe suggestions.
          </p>
          <Link to="/pantry">
            <Button variant="primary">Go to Pantry</Button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}
