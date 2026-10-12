import { create } from "zustand"

export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"
const systemQuery = window.matchMedia("(prefers-color-scheme: dark)")

const getSystemTheme = (): Theme => (systemQuery.matches ? "dark" : "light")

const getStoredTheme = (): Theme | null => {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        return value === "dark" || value === "light" ? value : null
    } catch {
        return null
    }
}

const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark")
}

// Picking the same theme as the system clears the override, so the app follows the system again.
const storeChoice = (theme: Theme) => {
    try {
        if (theme === getSystemTheme()) localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, theme)
    } catch {
        // Storage can be unavailable (private mode); the class still applies for this session.
    }
}

interface ThemeStore {
    theme: Theme
    toggleTheme: () => void
}

const useThemeStore = create<ThemeStore>((set, get) => ({
    theme: getStoredTheme() ?? getSystemTheme(),
    toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark"
        applyTheme(next)
        storeChoice(next)
        set({ theme: next })
    },
}))

systemQuery.addEventListener("change", () => {
    if (getStoredTheme()) return
    const theme = getSystemTheme()
    applyTheme(theme)
    useThemeStore.setState({ theme })
})

export default useThemeStore
