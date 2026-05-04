import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, ChefHat, ClipboardPaste, FormInput,
  ArrowLeft, GripVertical, Clock, Users, ImageIcon,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { recipesService } from '@/services/recipes.service'
import { parseRecipeText } from '@/utils/recipeParser'
import { cn } from '@/utils/cn'

const ingredientSchema = z.object({
  name: z.string().min(1, 'Required'),
  quantity: z.coerce.number().min(0),
  unit: z.string(),
  optional: z.boolean(),
})

const stepSchema = z.object({
  description: z.string().min(1, 'Required'),
  duration: z.coerce.number().optional(),
})

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  prepTime: z.coerce.number().min(0),
  cookTime: z.coerce.number().min(0),
  servings: z.coerce.number().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  cuisine: z.string().min(1, 'Cuisine is required'),
  tagsRaw: z.string(),
  ingredients: z.array(ingredientSchema).min(1, 'Add at least one ingredient'),
  steps: z.array(stepSchema).min(1, 'Add at least one step'),
})

type FormData = z.infer<typeof schema>

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
const CUISINES = ['Italian', 'Asian', 'American', 'Middle Eastern', 'Mexican', 'French', 'Indian', 'British', 'Greek', 'Spanish', 'Other']

export default function CreateRecipePage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'form' | 'paste'>('form')
  const [pasteText, setPasteText] = useState('')
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      difficulty: 'easy',
      prepTime: 0,
      cookTime: 0,
      servings: 2,
      tagsRaw: '',
      ingredients: [{ name: '', quantity: 1, unit: '', optional: false }],
      steps: [{ description: '', duration: undefined }],
    },
  })

  const { fields: ingFields, append: addIng, remove: removeIng } = useFieldArray({ control, name: 'ingredients' })
  const { fields: stepFields, append: addStep, remove: removeStep } = useFieldArray({ control, name: 'steps' })

  const difficulty = watch('difficulty')

  const handleParse = () => {
    if (!pasteText.trim()) return
    const parsed = parseRecipeText(pasteText)

    if (parsed.title) setValue('title', parsed.title)
    if (parsed.description) setValue('description', parsed.description)
    if (parsed.imageUrl) setValue('imageUrl', parsed.imageUrl)
    if (parsed.prepTime) setValue('prepTime', parsed.prepTime)
    if (parsed.cookTime) setValue('cookTime', parsed.cookTime)
    if (parsed.servings) setValue('servings', parsed.servings)
    if (parsed.cuisine) setValue('cuisine', parsed.cuisine)
    if (parsed.tags?.length) setValue('tagsRaw', parsed.tags.join(', '))

    if (parsed.ingredients?.length) {
      setValue('ingredients', parsed.ingredients)
    }
    if (parsed.steps?.length) {
      setValue('steps', parsed.steps)
    }

    setMode('form')
  }

  const onSubmit = async (data: FormData) => {
    setApiError('')
    try {
      const tags = data.tagsRaw
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)

      const recipe = await recipesService.createRecipe({
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        difficulty: data.difficulty,
        cuisine: data.cuisine,
        tags,
        ingredients: data.ingredients,
        steps: data.steps.map((s) => ({
          description: s.description,
          duration: s.duration || undefined,
        })),
      })

      navigate(`/recipes/${recipe.id}`)
    } catch (err: any) {
      setApiError(err.message ?? 'Failed to save recipe.')
    }
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-text-primary">Create Recipe</h1>
          <p className="text-sm text-text-secondary mt-0.5">Fill in the form or paste a recipe to auto-fill</p>
        </div>
        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
          <ChefHat size={20} className="text-green-400" />
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6 bg-bg-surface border border-border rounded-2xl p-1">
        <button
          onClick={() => setMode('form')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all',
            mode === 'form' ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary',
          )}
        >
          <FormInput size={15} />
          Build Form
        </button>
        <button
          onClick={() => setMode('paste')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all',
            mode === 'paste' ? 'bg-bg-elevated text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary',
          )}
        >
          <ClipboardPaste size={15} />
          Paste Recipe
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'paste' ? (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-bg-surface border border-border rounded-2xl p-4">
              <p className="text-sm text-text-secondary mb-3">
                Paste any recipe below — from a website, cookbook, or anywhere else.
                The parser will extract the title, ingredients, and steps automatically.
              </p>
              <div className="bg-bg-elevated border border-border rounded-xl p-1 mb-1">
                <p className="text-xs text-text-muted px-3 pt-2 pb-1 font-medium">Example format:</p>
                <pre className="text-xs text-text-muted px-3 pb-3 leading-relaxed whitespace-pre-wrap opacity-70">{`Spaghetti Carbonara
Serves 2 · Prep 10 min · Cook 20 min

Ingredients:
- 200g spaghetti
- 100g pancetta
- 2 eggs
- 50g parmesan

Instructions:
1. Cook pasta in salted boiling water.
2. Fry pancetta until crispy.
3. Mix eggs and parmesan.
4. Combine all off the heat.`}</pre>
              </div>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your recipe here..."
                rows={16}
                className="input-base w-full resize-y font-mono text-sm leading-relaxed"
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleParse}
              disabled={!pasteText.trim()}
            >
              Parse &amp; Fill Form
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* ── Basics ── */}
              <section className="bg-bg-surface border border-border rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Basics</h2>

                <Input
                  label="Recipe title"
                  placeholder="e.g. Spaghetti Carbonara"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    placeholder="A short description of the dish..."
                    className={cn('input-base w-full resize-none', errors.description && 'border-red-500/50')}
                    {...register('description')}
                  />
                  {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    <span className="flex items-center gap-1.5"><ImageIcon size={13} /> Image URL <span className="text-text-muted font-normal">(optional)</span></span>
                  </label>
                  <Input
                    placeholder="https://..."
                    error={errors.imageUrl?.message}
                    {...register('imageUrl')}
                  />
                </div>
              </section>

              {/* ── Details ── */}
              <section className="bg-bg-surface border border-border rounded-2xl p-5 space-y-4">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Details</h2>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1">
                      <Clock size={11} /> Prep (min)
                    </label>
                    <Input type="number" placeholder="10" {...register('prepTime')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1">
                      <Clock size={11} /> Cook (min)
                    </label>
                    <Input type="number" placeholder="20" {...register('cookTime')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1">
                      <Users size={11} /> Servings
                    </label>
                    <Input type="number" placeholder="2" {...register('servings')} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Cuisine</label>
                  <select className="input-base w-full" {...register('cuisine')}>
                    <option value="">Select cuisine...</option>
                    {CUISINES.map((c) => <option key={c} value={c} className="bg-bg-elevated">{c}</option>)}
                  </select>
                  {errors.cuisine && <p className="text-xs text-red-400 mt-1">{errors.cuisine.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setValue('difficulty', d)}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-sm font-medium border capitalize transition-all',
                          difficulty === d
                            ? d === 'easy' ? 'bg-green-500/15 text-green-400 border-green-500/30'
                              : d === 'medium' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-bg-elevated text-text-muted border-border hover:border-border-strong',
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Tags (comma separated)"
                  placeholder="e.g. pasta, vegetarian, quick"
                  {...register('tagsRaw')}
                />
              </section>

              {/* ── Ingredients ── */}
              <section className="bg-bg-surface border border-border rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Ingredients
                    <span className="ml-2 text-xs font-normal text-text-muted normal-case">({ingFields.length})</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => addIng({ name: '', quantity: 1, unit: '', optional: false })}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>

                {errors.ingredients?.root && (
                  <p className="text-xs text-red-400">{errors.ingredients.root.message}</p>
                )}

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_72px_72px_32px_28px] gap-2 px-1">
                  <span className="text-xs text-text-muted">Ingredient</span>
                  <span className="text-xs text-text-muted">Qty</span>
                  <span className="text-xs text-text-muted">Unit</span>
                  <span className="text-xs text-text-muted text-center">Opt?</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {ingFields.map((field, i) => (
                    <div key={field.id} className="grid grid-cols-[1fr_72px_72px_32px_28px] gap-2 items-center">
                      <input
                        className={cn('input-base text-sm', errors.ingredients?.[i]?.name && 'border-red-500/50')}
                        placeholder="e.g. Garlic"
                        {...register(`ingredients.${i}.name`)}
                      />
                      <input
                        type="number"
                        step="0.1"
                        className="input-base text-sm text-center"
                        {...register(`ingredients.${i}.quantity`)}
                      />
                      <input
                        className="input-base text-sm"
                        placeholder="g, ml, cup…"
                        {...register(`ingredients.${i}.unit`)}
                      />
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-green-500 cursor-pointer"
                          {...register(`ingredients.${i}.optional`)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIng(i)}
                        className="p-1 text-text-muted hover:text-red-400 transition-colors"
                        disabled={ingFields.length === 1}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Steps ── */}
              <section className="bg-bg-surface border border-border rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                    Steps
                    <span className="ml-2 text-xs font-normal text-text-muted normal-case">({stepFields.length})</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => addStep({ description: '', duration: undefined })}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>

                {errors.steps?.root && (
                  <p className="text-xs text-red-400">{errors.steps.root.message}</p>
                )}

                <div className="space-y-3">
                  {stepFields.map((field, i) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-bg-elevated text-text-muted text-xs font-bold flex items-center justify-center shrink-0 mt-2">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <textarea
                          rows={2}
                          placeholder={`Step ${i + 1}...`}
                          className={cn('input-base w-full resize-none text-sm', errors.steps?.[i]?.description && 'border-red-500/50')}
                          {...register(`steps.${i}.description`)}
                        />
                        <input
                          type="number"
                          className="input-base w-28 text-sm"
                          placeholder="Duration (min)"
                          {...register(`steps.${i}.duration`)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStep(i)}
                        className="p-1 mt-2 text-text-muted hover:text-red-400 transition-colors"
                        disabled={stepFields.length === 1}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {apiError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {apiError}
                </div>
              )}

              <div className="flex gap-3 pb-10">
                <Button type="submit" variant="primary" size="lg" className="flex-1" loading={isSubmitting}>
                  Save Recipe
                </Button>
                <Button type="button" variant="ghost" size="lg" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
