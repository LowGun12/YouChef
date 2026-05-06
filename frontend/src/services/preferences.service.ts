import client from './client'
import type { UserPreferences, SavePreferencesRequest } from '@/types'

export const preferencesService = {
  get: () =>
    client.get<UserPreferences>('/preferences').then((r) => r.data),

  save: (data: SavePreferencesRequest) =>
    client.post<UserPreferences>('/preferences', data).then((r) => r.data),
}
