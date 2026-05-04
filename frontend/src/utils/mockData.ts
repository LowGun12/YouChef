import type { Recipe, PantryItem, RecipeMatch } from '@/types'

export const mockPantryItems: PantryItem[] = [
  { id: '1', userId: 'u1', name: 'Eggs', category: 'dairy', quantity: 6, unit: 'pcs', addedAt: new Date().toISOString() },
  { id: '2', userId: 'u1', name: 'Pasta', category: 'grains', quantity: 500, unit: 'g', addedAt: new Date().toISOString() },
  { id: '3', userId: 'u1', name: 'Tomatoes', category: 'produce', quantity: 4, unit: 'pcs', addedAt: new Date().toISOString() },
  { id: '4', userId: 'u1', name: 'Garlic', category: 'produce', quantity: 1, unit: 'bulb', addedAt: new Date().toISOString() },
  { id: '5', userId: 'u1', name: 'Olive Oil', category: 'condiments', quantity: 500, unit: 'ml', addedAt: new Date().toISOString() },
  { id: '6', userId: 'u1', name: 'Chicken Breast', category: 'meat', quantity: 400, unit: 'g', addedAt: new Date().toISOString() },
  { id: '7', userId: 'u1', name: 'Onion', category: 'produce', quantity: 2, unit: 'pcs', addedAt: new Date().toISOString() },
  { id: '8', userId: 'u1', name: 'Cheddar Cheese', category: 'dairy', quantity: 200, unit: 'g', addedAt: new Date().toISOString() },
]

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Aglio e Olio',
    description: 'A classic Neapolitan pasta dish with garlic, olive oil, and a hint of chili. Simple, fast, and incredibly satisfying.',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop',
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'Italian',
    tags: ['pasta', 'vegetarian', 'quick'],
    ingredients: [
      { id: 'i1', name: 'Pasta', quantity: 200, unit: 'g', optional: false },
      { id: 'i2', name: 'Garlic', quantity: 4, unit: 'cloves', optional: false },
      { id: 'i3', name: 'Olive Oil', quantity: 60, unit: 'ml', optional: false },
      { id: 'i4', name: 'Red Chili Flakes', quantity: 1, unit: 'tsp', optional: true },
      { id: 'i5', name: 'Parsley', quantity: 2, unit: 'tbsp', optional: true },
    ],
    instructions: [
      { order: 1, description: 'Bring a large pot of salted water to boil. Cook pasta al dente.', duration: 10 },
      { order: 2, description: 'While pasta cooks, thinly slice garlic and gently fry in olive oil until golden.', duration: 5 },
      { order: 3, description: 'Add chili flakes, then toss in drained pasta. Add pasta water to emulsify.', duration: 2 },
      { order: 4, description: 'Finish with fresh parsley and serve immediately.' },
    ],
    nutrition: { calories: 480, protein: 14, carbs: 72, fat: 16, fiber: 3 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Chicken Tomato Stir-fry',
    description: 'A quick and healthy stir-fry with tender chicken, fresh tomatoes, and aromatics. Ready in 20 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'Asian',
    tags: ['chicken', 'quick', 'healthy'],
    ingredients: [
      { id: 'i1', name: 'Chicken Breast', quantity: 300, unit: 'g', optional: false },
      { id: 'i2', name: 'Tomatoes', quantity: 3, unit: 'pcs', optional: false },
      { id: 'i3', name: 'Onion', quantity: 1, unit: 'pc', optional: false },
      { id: 'i4', name: 'Garlic', quantity: 3, unit: 'cloves', optional: false },
      { id: 'i5', name: 'Soy Sauce', quantity: 2, unit: 'tbsp', optional: false },
      { id: 'i6', name: 'Sesame Oil', quantity: 1, unit: 'tsp', optional: true },
    ],
    instructions: [
      { order: 1, description: 'Slice chicken into strips. Season with salt and pepper.' },
      { order: 2, description: 'Heat oil in a wok over high heat. Stir-fry chicken until cooked through.', duration: 6 },
      { order: 3, description: 'Add garlic and onion, fry for 2 minutes.' },
      { order: 4, description: 'Add tomatoes and soy sauce. Cook until tomatoes soften.', duration: 4 },
      { order: 5, description: 'Drizzle sesame oil and serve over rice.' },
    ],
    nutrition: { calories: 320, protein: 36, carbs: 12, fat: 12, fiber: 2 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Cheesy Scrambled Eggs',
    description: 'Silky soft scrambled eggs with melted cheddar. The ultimate comfort breakfast.',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
    prepTime: 2,
    cookTime: 8,
    servings: 1,
    difficulty: 'easy',
    cuisine: 'American',
    tags: ['breakfast', 'eggs', 'quick'],
    ingredients: [
      { id: 'i1', name: 'Eggs', quantity: 3, unit: 'pcs', optional: false },
      { id: 'i2', name: 'Cheddar Cheese', quantity: 40, unit: 'g', optional: false },
      { id: 'i3', name: 'Butter', quantity: 1, unit: 'tbsp', optional: false },
      { id: 'i4', name: 'Chives', quantity: 1, unit: 'tbsp', optional: true },
    ],
    instructions: [
      { order: 1, description: 'Whisk eggs with a pinch of salt.' },
      { order: 2, description: 'Melt butter in a non-stick pan over low heat. Add eggs.', duration: 1 },
      { order: 3, description: 'Fold gently with a spatula, removing from heat occasionally to keep soft.', duration: 4 },
      { order: 4, description: 'Fold in cheese just before eggs fully set. Serve immediately.' },
    ],
    nutrition: { calories: 380, protein: 28, carbs: 2, fat: 28, fiber: 0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Garlic Chicken Pasta',
    description: 'Creamy garlic pasta with seared chicken breast. A comforting weeknight dinner.',
    imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&auto=format&fit=crop',
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    difficulty: 'medium',
    cuisine: 'Italian',
    tags: ['pasta', 'chicken', 'comfort'],
    ingredients: [
      { id: 'i1', name: 'Pasta', quantity: 300, unit: 'g', optional: false },
      { id: 'i2', name: 'Chicken Breast', quantity: 400, unit: 'g', optional: false },
      { id: 'i3', name: 'Garlic', quantity: 5, unit: 'cloves', optional: false },
      { id: 'i4', name: 'Heavy Cream', quantity: 200, unit: 'ml', optional: false },
      { id: 'i5', name: 'Parmesan', quantity: 50, unit: 'g', optional: false },
      { id: 'i6', name: 'Olive Oil', quantity: 2, unit: 'tbsp', optional: false },
    ],
    instructions: [
      { order: 1, description: 'Cook pasta al dente. Reserve 1 cup pasta water.' },
      { order: 2, description: 'Season and sear chicken in olive oil until golden. Rest, then slice.' },
      { order: 3, description: 'In same pan, fry garlic 1 minute, then add cream and reduce.' },
      { order: 4, description: 'Toss pasta in sauce, add parmesan and pasta water to consistency.' },
      { order: 5, description: 'Top with sliced chicken and serve.' },
    ],
    nutrition: { calories: 620, protein: 44, carbs: 68, fat: 18, fiber: 3 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Caprese Salad',
    description: 'Fresh tomatoes with mozzarella, basil, and a drizzle of balsamic glaze. No cooking required.',
    imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'Italian',
    tags: ['salad', 'vegetarian', 'no-cook'],
    ingredients: [
      { id: 'i1', name: 'Tomatoes', quantity: 3, unit: 'pcs', optional: false },
      { id: 'i2', name: 'Mozzarella', quantity: 200, unit: 'g', optional: false },
      { id: 'i3', name: 'Basil', quantity: 10, unit: 'leaves', optional: false },
      { id: 'i4', name: 'Olive Oil', quantity: 2, unit: 'tbsp', optional: false },
      { id: 'i5', name: 'Balsamic Glaze', quantity: 1, unit: 'tbsp', optional: true },
    ],
    instructions: [
      { order: 1, description: 'Slice tomatoes and mozzarella into 1cm rounds.' },
      { order: 2, description: 'Arrange alternating slices on a plate.' },
      { order: 3, description: 'Tuck basil leaves between slices.' },
      { order: 4, description: 'Drizzle olive oil and balsamic. Season with salt and pepper.' },
    ],
    nutrition: { calories: 280, protein: 18, carbs: 8, fat: 20, fiber: 1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Shakshuka',
    description: 'Poached eggs in a rich, spiced tomato and pepper sauce. A Middle Eastern classic.',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop',
    prepTime: 5,
    cookTime: 20,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'Middle Eastern',
    tags: ['breakfast', 'eggs', 'vegetarian'],
    ingredients: [
      { id: 'i1', name: 'Eggs', quantity: 4, unit: 'pcs', optional: false },
      { id: 'i2', name: 'Tomatoes', quantity: 4, unit: 'pcs', optional: false },
      { id: 'i3', name: 'Onion', quantity: 1, unit: 'pc', optional: false },
      { id: 'i4', name: 'Garlic', quantity: 3, unit: 'cloves', optional: false },
      { id: 'i5', name: 'Cumin', quantity: 1, unit: 'tsp', optional: false },
      { id: 'i6', name: 'Paprika', quantity: 1, unit: 'tsp', optional: false },
      { id: 'i7', name: 'Olive Oil', quantity: 2, unit: 'tbsp', optional: false },
    ],
    instructions: [
      { order: 1, description: 'Sauté onion in olive oil until soft. Add garlic and spices.' },
      { order: 2, description: 'Add chopped tomatoes and simmer 10 minutes until thick.', duration: 10 },
      { order: 3, description: 'Make wells in the sauce and crack eggs into them.' },
      { order: 4, description: 'Cover and cook until whites are set but yolks still runny.', duration: 5 },
      { order: 5, description: 'Serve with crusty bread.' },
    ],
    nutrition: { calories: 290, protein: 16, carbs: 14, fat: 18, fiber: 4 },
    createdAt: new Date().toISOString(),
  },
]

export function buildRecipeMatches(pantryItems: PantryItem[]): RecipeMatch[] {
  const pantryNames = pantryItems.map((i) => i.name.toLowerCase())

  return mockRecipes.map((recipe) => {
    const required = recipe.ingredients.filter((i) => !i.optional)
    const have = required.filter((i) =>
      pantryNames.some((p) => p.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(p)),
    )
    const missing = required.filter(
      (i) => !pantryNames.some((p) => p.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(p)),
    )

    const matchPercent = required.length > 0 ? Math.round((have.length / required.length) * 100) : 100

    return {
      recipe,
      canMake: missing.length === 0,
      matchPercent,
      haveCount: have.length,
      missingCount: missing.length,
      missingIngredients: missing.map((i) => i.name),
      haveIngredients: have.map((i) => i.name),
    }
  })
}

export const qrBarcodeDatabase: Record<string, { name: string; category: string }> = {
  '5000112637922': { name: 'Heinz Baked Beans', category: 'other' },
  '5000143021008': { name: 'Lurpak Butter', category: 'dairy' },
  '7622210100740': { name: 'Oreo Cookies', category: 'other' },
  '3017620422003': { name: 'Nutella', category: 'condiments' },
  '0016000119499': { name: 'Cheerios Cereal', category: 'grains' },
  '5000159407236': { name: 'Mozzarella', category: 'dairy' },
  '4000521004862': { name: 'Pasta Penne', category: 'grains' },
  '8076809513753': { name: 'Spaghetti', category: 'grains' },
  'DEMO001': { name: 'Cherry Tomatoes', category: 'produce' },
  'DEMO002': { name: 'Whole Milk', category: 'dairy' },
  'DEMO003': { name: 'Free Range Eggs', category: 'dairy' },
  'DEMO004': { name: 'Sourdough Bread', category: 'grains' },
}
