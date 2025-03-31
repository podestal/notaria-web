import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'

interface DecodedToken {
    user_id: number;
}

interface AuthState {
    access_token: string | null 
    refresh_token: string | null 
    userId: number
    setUserId: (id: number) => void
    setTokens: (access_token: string, refresh_token: string) => void
    clearTokens: () => void 
}

const useAuthStore = create<AuthState>(set => ({

    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),

    userId: localStorage.getItem('access') ? jwtDecode<DecodedToken>(localStorage.getItem('access') || '').user_id : 0,

    setTokens: (access_token, refresh_token) => {
        localStorage.setItem('access_token', access_token) 
        localStorage.setItem('refresh_token', refresh_token)
        set({ access_token, refresh_token }) 
    },

    clearTokens: () => {
        localStorage.removeItem('access_token') 
        localStorage.removeItem('refresh_token')
        set({ access_token: '', refresh_token: '', userId: 0 }) 
    },

    setUserId: (id) => {
        set({ userId: id })
    }
}))

export default useAuthStore