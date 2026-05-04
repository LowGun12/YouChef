import type { CreateRecipeIngredient, CreateRecipeStep } from '@/types'

export interface ParsedRecipe {
  title: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  cuisine: string
  tags: string[]
  imageUrl: string
  ingredients: CreateRecipeIngredient[]
  steps: CreateRecipeStep[]
}

const INGREDIENT_HEADERS = /^(ingredients?|what you.?ll need|you.?ll need|you will need)[\s:]*$/i
const STEP_HEADERS = /^(instructions?|method|directions?|steps?|how to (make|cook|prepare)|preparation|to (make|cook))[\s:]*$/i
const SKIP_LINES = /^(notes?|tips?|serving suggestions?|nutrition|equipment|storage)[\s:]*$/i

// Matches: "2 cups flour", "400g pasta", "1/2 tsp salt", "3-4 cloves garlic"
const INGREDIENT_LINE = /^[-•*▪–]?\s*(\d+[\/-]\d+|\d*\.?\d+)?\s*(g|kg|ml|l|litre|liter|tsp|tbsp|tablespoon|teaspoon|cup|cups|oz|lb|lbs|pound|pint|handful|pinch|bunch|cloves?|pieces?|pcs?|slices?|cans?|tins?|bags?|packets?)?\s+(.+?)(\s*\(optional\))?$/i
// Step number: "1. ...", "1) ...", "Step 1:", "Step 1 -"
const STEP_LINE = /^(?:step\s+)?(\d+)[.):\s\-]+\s*(.+)$/i

function parseQuantity(raw: string): number {
  if (raw.includes('/')) {
    const [num, den] = raw.split('/')
    return parseFloat(num) / parseFloat(den)
  }
  if (raw.includes('-')) {
    // Range like "3-4" — take midpoint
    const [lo, hi] = raw.split('-').map(Number)
    return Math.round((lo + hi) / 2)
  }
  return parseFloat(raw) || 1
}

function extractMetaValue(text: string, patterns: RegExp[]): number {
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return parseInt(m[1])
  }
  return 0
}

export function parseRecipeText(raw: string): Partial<ParsedRecipe> {
  const lines = raw.split('\n').map((l) => l.trim())
  const nonEmpty = lines.filter(Boolean)

  if (nonEmpty.length === 0) return {}

  // First non-empty line is the title
  const title = nonEmpty[0]

  let inIngredients = false
  let inSteps = false
  let descLines: string[] = []
  const ingredients: CreateRecipeIngredient[] = []
  const steps: CreateRecipeStep[] = []

  for (let i = 1; i < nonEmpty.length; i++) {
    const line = nonEmpty[i]

    if (SKIP_LINES.test(line)) { inIngredients = false; inSteps = false; continue }
    if (INGREDIENT_HEADERS.test(line)) { inIngredients = true; inSteps = false; continue }
    if (STEP_HEADERS.test(line)) { inSteps = true; inIngredients = false; continue }

    if (inIngredients) {
      const m = line.match(INGREDIENT_LINE)
      if (m) {
        ingredients.push({
          name: m[3].replace(/,+$/, '').trim(),
          quantity: m[1] ? parseQuantity(m[1]) : 1,
          unit: (m[2] ?? '').toLowerCase().replace(/s$/, ''),
          optional: !!m[4],
        })
      } else if (/^[-•*▪–]\s+/.test(line)) {
        ingredients.push({ name: line.replace(/^[-•*▪–]\s+/, ''), quantity: 1, unit: '', optional: false })
      }
      continue
    }

    if (inSteps) {
      const m = line.match(STEP_LINE)
      if (m) {
        const durMatch = m[2].match(/\((\d+)\s*min/i) ?? m[2].match(/for\s+(\d+)\s*min/i)
        steps.push({ description: m[2].trim(), duration: durMatch ? parseInt(durMatch[1]) : undefined })
      } else if (line.length > 15) {
        // Un-numbered paragraph in step section
        const durMatch = line.match(/\((\d+)\s*min/i) ?? line.match(/for\s+(\d+)\s*min/i)
        steps.push({ description: line, duration: durMatch ? parseInt(durMatch[1]) : undefined })
      }
      continue
    }

    // Before any section header — treat as description (first 3 lines max)
    if (descLines.length < 3 && !INGREDIENT_HEADERS.test(line) && !STEP_HEADERS.test(line)) {
      descLines.push(line)
    }
  }

  const fullText = raw.toLowerCase()

  const prepTime = extractMetaValue(fullText, [
    /prep(?:aration)?\s*(?:time)?\s*:?\s*(\d+)\s*min/i,
    /(\d+)\s*min(?:utes?)?\s+prep/i,
  ])

  const cookTime = extractMetaValue(fullText, [
    /cook(?:ing)?\s*(?:time)?\s*:?\s*(\d+)\s*min/i,
    /(\d+)\s*min(?:utes?)?\s+cook/i,
    /bake\s+(?:for\s+)?(\d+)\s*min/i,
  ])

  const servings = extractMetaValue(fullText, [
    /serves?\s*:?\s*(\d+)/i,
    /servings?\s*:?\s*(\d+)/i,
    /makes?\s*:?\s*(\d+)/i,
    /yield\s*:?\s*(\d+)/i,
  ])

  return {
    title,
    description: descLines.join(' ').trim(),
    ingredients,
    steps,
    prepTime,
    cookTime,
    servings: servings || 2,
    cuisine: '',
    tags: [],
    imageUrl: '',
  }
}
