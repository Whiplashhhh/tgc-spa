import { defineStore } from 'pinia'

import { useApi } from '@/composables/useApi.ts'
import { useStorage } from '@/composables/useStorage.ts'
import type { SignInPayload, SignUpPayload, User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
}

interface ApiError {
  error: string | null
  message: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const storage = useStorage()

    return {
      token: storage.get<string>('token') ?? null,
      user: storage.get<User>('user') ?? null,
      loading: false,
      error: null,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,

    username: (state) => state.user?.username ?? '',
  },

  actions: {
    async signIn(payload: SignInPayload) {
      const api = useApi()
      const storage = useStorage()

      this.loading = true
      this.error = null

      try {
        const { token, user } = await api.signIn(payload)

        this.token = token
        this.user = user

        storage.set('token', token)
        storage.set('user', user)
      } catch (error: unknown) {
        const apiError = error as ApiError
        this.error = apiError.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signUp(payload: SignUpPayload) {
      const api = useApi()

      this.loading = true
      this.error = null

      try {
        await api.signUp(payload)
        await this.signIn(payload)
      } catch (error: unknown) {
        const apiError = error as ApiError
        this.error = apiError.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
