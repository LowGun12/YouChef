import { create } from 'zustand'
import type { PantryItem } from '@/types'

interface PantryStore {
  items: PantryItem[]
  setItems: (items: PantryItem[]) => void
  addItem: (item: PantryItem) => void
  removeItem: (id: string) => void
  hasIngredient: (name: string) => boolean
}

export const usePantryStore = create<PantryStore>((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  hasIngredient: (name) => {
    const lower = name.toLowerCase()
    return get().items.some((i) => i.name.toLowerCase().includes(lower))
  },
}))
