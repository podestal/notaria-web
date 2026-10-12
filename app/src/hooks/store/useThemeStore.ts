import { create } from "zustand"

export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"

const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    try {
        localStorage.setItem(STORAGE_KEY, theme)
    } catch {
        // Storage can be unavailable (private mode); the class still applies for this session.
    }
}

interface ThemeStore {
    theme: Theme
    toggleTheme: () => void
}

const useThemeStore = create<ThemeStore>((set, get) => ({
    // index.html sets the class before React mounts, so read it back instead of localStorage.
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark"
        applyTheme(next)
        set({ theme: next })
    },
}))

export default useThemeStore
