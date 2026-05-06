import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, ArrowRight, ArrowLeft, Check, AlertTriangle, Salad, Globe } from 'lucide-react'
import { ALLERGENS, DIETARY_OPTIONS, CUISINE_OPTIONS } from '@/types'
import { preferencesService } from '@/services/preferences.service'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const STEPS = [
  {
    id: 'allergens',
    title: 'Any food allergies?',
    subtitle: "We'll never show you recipes containing these ingredients.",
    icon: <AlertTriangle size={22} className="text-red-400" />,
    color: 'red',
  },
  {
    id: 'dietary',
    title: 'Dietary preferences?',
    subtitle: "We'll highlight recipes that match your lifestyle.",
    icon: <Salad size={22} className="text-green-400" />,
    color: 'green',
  },
  {
    id: 'cuisines',
    title: 'Favourite cuisines?',
    subtitle: "We'll personalise your recipe suggestions.",
    icon: <Globe size={22} className="text-blue-400" />,
    color: 'blue',
  },
] as const


const LABEL_MAP: Record<string, string> = {
  'tree-nuts': 'Tree Nuts',
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
  'nut-free': 'Nut-Free',
}

function label(s: string) {
  return LABEL_MAP[s] ?? s.charAt(0).toUpperCase() + s.slice(1)
}

function ChipGrid({
  options,
  selected,
  color,
  onToggle,
}: {
  options: readonly string[]
  selected: string[]
  color: string
  onToggle: (v: string) => void
}) {
  const active = {
    red: 'bg-red-500/15 text-red-400 border-red-500/40',
    green: 'bg-green-500/15 text-green-400 border-green-500/40',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  }[color]

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isOn = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all',
              isOn
                ? active
                : 'bg-bg-elevated text-text-muted border-border hover:border-border-strong hover:text-text-secondary',
            )}
          >
            {isOn && <Check size={12} />}
            {label(opt)}
          </button>
        )
      })}
    </div>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [step, setStep] = useState(0)
  const [allergies, setAllergies] = useState<string[]>([])
  const [dietary, setDietary] = useState<string[]>([])
  const [cuisines, setCuisines] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login', { replace: true })
    return null
  }

  const currentStep = STEPS[step]

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  const currentOptions =
    currentStep.id === 'allergens'
      ? ALLERGENS
      : currentStep.id === 'dietary'
        ? DIETARY_OPTIONS
        : CUISINE_OPTIONS

  const currentSelected =
    currentStep.id === 'allergens' ? allergies : currentStep.id === 'dietary' ? dietary : cuisines

  const currentToggle = (v: string) =>
    currentStep.id === 'allergens'
      ? toggle(allergies, setAllergies, v)
      : currentStep.id === 'dietary'
        ? toggle(dietary, setDietary, v)
        : toggle(cuisines, setCuisines, v)

  const isLast = step === STEPS.length - 1

  const handleNext = async () => {
    if (!isLast) {
      setStep(step + 1)
      return
    }
    setSaving(true)
    try {
      await preferencesService.save({ allergies, dietary, cuisinePrefs: cuisines })
      navigate('/dashboard', { replace: true })
    } catch {
      navigate('/dashboard', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-3xl opacity-30"
          style={{ background: 'rgba(249,115,22,0.12)' }}
        />
      </div>

      <div className="w-full max-w-lg relative">
        {/* Logo + progress */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-glow mx-auto mb-4">
            <ChefHat size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-text-primary mb-1">
            Let's personalise your experience
          </h1>
          <p className="text-sm text-text-muted">Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === step ? 'w-8 bg-orange-500' : i < step ? 'w-4 bg-green-500' : 'w-4 bg-bg-elevated',
              )}
            />
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            className="bg-bg-surface border border-border rounded-3xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-bg-elevated rounded-xl flex items-center justify-center">
                {currentStep.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary leading-tight">
                  {currentStep.title}
                </h2>
              </div>
            </div>
            <p className="text-sm text-text-muted mb-5">{currentStep.subtitle}</p>

            <ChipGrid
              options={currentOptions}
              selected={currentSelected}
              color={currentStep.color}
              onToggle={currentToggle}
            />

            {currentSelected.length === 0 && (
              <p className="text-xs text-text-muted mt-4 italic">
                Nothing selected — tap chips to choose, or skip this step.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-6">
          {step > 0 && (
            <Button
              variant="ghost"
              size="md"
              icon={<ArrowLeft size={15} />}
              onClick={() => setStep(step - 1)}
              className="shrink-0"
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handleNext}
            loading={saving}
            icon={!isLast ? <ArrowRight size={15} /> : undefined}
          >
            {isLast ? 'Finish & get cooking' : 'Next'}
          </Button>
        </div>

        <button
          onClick={() => navigate('/dashboard', { replace: true })}
          className="w-full text-center text-xs text-text-muted hover:text-text-secondary transition-colors mt-4 py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
