import type { LucideIcon } from "lucide-react"
import { BookOpen, Car, FileText, Home } from "lucide-react"

export type PdtTypeId = "escrituras" | "garantias" | "vehiculares" | "libros"

export const PDT_TYPE_OPTIONS: {
    id: PdtTypeId
    label: string
    description: string
    icon: LucideIcon
    tone: { icon: string; active: string; dot: string }
}[] = [
    {
        id: "escrituras",
        label: "Escrituras",
        description: "Escrituras públicas",
        icon: FileText,
        tone: {
            icon: "bg-sky-50 text-sky-600",
            active: "border-sky-500 ring-sky-500/20",
            dot: "bg-sky-500",
        },
    },
    {
        id: "garantias",
        label: "Garantías",
        description: "Garantías mobiliarias",
        icon: Home,
        tone: {
            icon: "bg-emerald-50 text-emerald-600",
            active: "border-emerald-500 ring-emerald-500/20",
            dot: "bg-emerald-500",
        },
    },
    {
        id: "vehiculares",
        label: "Vehiculares",
        description: "Transferencias vehiculares",
        icon: Car,
        tone: {
            icon: "bg-amber-50 text-amber-600",
            active: "border-amber-500 ring-amber-500/20",
            dot: "bg-amber-500",
        },
    },
    {
        id: "libros",
        label: "Libros",
        description: "Apertura de libros",
        icon: BookOpen,
        tone: {
            icon: "bg-violet-50 text-violet-600",
            active: "border-violet-500 ring-violet-500/20",
            dot: "bg-violet-500",
        },
    },
]
