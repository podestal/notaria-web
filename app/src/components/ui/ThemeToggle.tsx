import { Moon, Sun } from "lucide-react"
import useThemeStore from "../../hooks/store/useThemeStore"

interface Props {
    className?: string
}

const ThemeToggle = ({ className = "" }: Props) => {
    const theme = useThemeStore(s => s.theme)
    const toggleTheme = useThemeStore(s => s.toggleTheme)
    const isDark = theme === "dark"

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Modo claro" : "Modo oscuro"}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors duration-200 ${className}`}
        >
            {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
        </button>
    )
}

export default ThemeToggle
