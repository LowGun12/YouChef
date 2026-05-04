import client from './client'
import type { AddPantryItemRequest, PantryItem } from '@/types'

export const pantryService = {
  getItems: () =>
    client.get<PantryItem[]>('/pantry').then((r) => r.data),

  addItem: (data: AddPantryItemRequest) =>
    client.post<PantryItem>('/pantry', data).then((r) => r.data),

  removeItem: (id: string) =>
    client.delete(`/pantry/${id}`).then((r) => r.data),

  lookupBarcode: (code: string) =>
    client.get<{ name: string; category: string }>(`/pantry/barcode/${code}`).then((r) => r.data),
}
