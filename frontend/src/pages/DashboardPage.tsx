import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, BookOpen, CheckCircle2, TrendingUp, ArrowRight, ChefHat } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { usePantryStore } from '@/stores/pantryStore'
import { buildRecipeMatches, mockPantryItems } from '@/utils/mockData'
import RecipeCard from '@/features/recipes/components/RecipeCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { items, setItems } = usePantryStore()

  // Seed pantry for new users
  const pantryItems = items.length > 0 ? items : mockPantryItems

  const matches = useMemo(() => buildRecipeMatches(pantryItems), [pantryItems])
  const cookableRecipes = matches.filter((m) => m.canMake)
  const topSuggestions = [...matches].sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 3)

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
      value: cookableRecipes.length,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      to: '/recipes',
    },
    {
      icon: BookOpen,
      label: 'Total recipes',
      value: matches.length,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      to: '/recipes',
    },
    {
      icon: TrendingUp,
      label: 'Avg match',
      value: `${Math.round(matches.reduce((s, m) => s + m.matchPercent, 0) / matches.length)}%`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      to: '/recipes',
    },
  ]

  const firstName = user?.name?.split(' ')[0] ?? 'Chef'

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
          {cookableRecipes.length > 0
            ? `You can cook ${cookableRecipes.length} recipe${cookableRecipes.length > 1 ? 's' : ''} right now!`
            : 'Add items to your pantry to unlock recipe suggestions.'}
        </p>
      </div>

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
      {cookableRecipes.length > 0 && (
        <section className="mb-10">
          <div className="section-header">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary">Ready to cook</h2>
              <Badge variant="green">{cookableRecipes.length}</Badge>
            </div>
            <Link to="/recipes?filter=canMake">
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />}>
                See all
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cookableRecipes.slice(0, 3).map((m) => (
              <RecipeCard key={m.recipe.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Top suggestions */}
      <section className="mb-10">
        <div className="section-header">
          <h2 className="text-lg font-bold text-text-primary">Best matches</h2>
          <Link to="/recipes">
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />}>
              All recipes
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSuggestions.map((m) => (
            <RecipeCard key={m.recipe.id} match={m} />
          ))}
        </div>
      </section>

      {/* Pantry teaser */}
      {pantryItems.length === 0 && (
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
