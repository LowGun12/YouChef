import client from './client'
import type { Recipe, RecipeMatch, PaginatedResponse } from '@/types'

export interface RecipeFilters {
  search?: string
  cuisine?: string
  difficulty?: string
  filterByPantry?: boolean
  page?: number
  pageSize?: number
}

export const recipesService = {
  getAll: (filters?: RecipeFilters) =>
    client
      .get<PaginatedResponse<Recipe>>('/recipes', { params: filters })
      .then((r) => r.data),

  getById: (id: string) =>
    client.get<Recipe>(`/recipes/${id}`).then((r) => r.data),

  getMatches: () =>
    client.get<RecipeMatch[]>('/recipes/matches').then((r) => r.data),

  getSaved: () =>
    client.get<Recipe[]>('/recipes/saved').then((r) => r.data),

  saveRecipe: (recipeId: string) =>
    client.post(`/recipes/${recipeId}/save`).then((r) => r.data),

  unsaveRecipe: (recipeId: string) =>
    client.delete(`/recipes/${recipeId}/save`).then((r) => r.data),
}
