// ── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ── Pantry ───────────────────────────────────────────────────────────────────

export interface PantryItem {
  id: string
  userId: string
  name: string
  category: IngredientCategory
  quantity?: number
  unit?: string
  expiresAt?: string
  addedAt: string
  barcode?: string
}

export type IngredientCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'grains'
  | 'condiments'
  | 'frozen'
  | 'beverages'
  | 'other'

export interface AddPantryItemRequest {
  name: string
  category: IngredientCategory
  quantity?: number
  unit?: string
  expiresAt?: string
  barcode?: string
}

// ── Recipes ──────────────────────────────────────────────────────────────────

export interface Recipe {
  id: string
  title: string
  description: string
  imageUrl?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine: string
  tags: string[]
  ingredients: RecipeIngredient[]
  instructions: RecipeStep[]
  nutrition?: NutritionInfo
  createdAt: string
}

export interface RecipeIngredient {
  id: string
  name: string
  quantity: number
  unit: string
  optional: boolean
}

export interface RecipeStep {
  order: number
  description: string
  duration?: number
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface RecipeMatch {
  recipe: Recipe
  canMake: boolean
  matchPercent: number
  haveCount: number
  missingCount: number
  missingIngredients: string[]
  haveIngredients: string[]
}

// ── Saved Recipes ─────────────────────────────────────────────────────────────

export interface SavedRecipe {
  id: string
  userId: string
  recipeId: string
  savedAt: string
}

// ── QR / Barcode ──────────────────────────────────────────────────────────────

export interface BarcodeResult {
  code: string
  ingredient?: string
  category?: IngredientCategory
}

// ── Common ────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
