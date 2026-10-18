import { motion } from "framer-motion"
import { Loader2, Search, X } from "lucide-react"
import type { FormEvent, ReactNode } from "react"

interface ShellProps {
    title?: string
    onSubmit?: (e: FormEvent) => void
    children: ReactNode
    columns?: 1 | 2 | 3
}

export const EXTRA_FILTER_INPUT_CLASS =
    "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

export const EXTRA_FILTER_SELECT_CLASS =
    "w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

const ExtraFiltersShell = ({
    title = "Búsqueda por:",
    onSubmit,
    children,
    columns = 2,
}: ShellProps) => {
    const cols =
        columns === 1
            ? "md:grid-cols-1"
            : columns === 3
              ? "md:grid-cols-3"
              : "md:grid-cols-2"

    const content = (
        <>
            <p className="mb-2 text-xs font-semibold text-slate-700">{title}</p>
            <div className={`grid grid-cols-1 gap-2 text-xs ${cols}`}>{children}</div>
        </>
    )

    if (onSubmit) {
        return (
            <form
                onSubmit={onSubmit}
                className="w-full border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6"
            >
                {content}
            </form>
        )
    }

    return (
        <div className="w-full border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6">
            {content}
        </div>
    )
}

export default ExtraFiltersShell

interface FieldProps {
    label: string
    index?: number
    children: ReactNode
    className?: string
    colSpan?: 1 | 2 | 3
}

export const ExtraFilterField = ({
    label,
    index = 0,
    children,
    className = "",
    colSpan = 1,
}: FieldProps) => {
    const span =
        colSpan === 2
            ? "md:col-span-2"
            : colSpan === 3
              ? "md:col-span-3"
              : ""

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
            className={`flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100 ${span} ${className}`}
        >
            <p className="min-w-[5.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <div className="min-w-0 flex-1">{children}</div>
        </motion.div>
    )
}

interface TextFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    index?: number
    placeholder?: string
    colSpan?: 1 | 2 | 3
}

export const ExtraFilterTextField = ({
    label,
    value,
    onChange,
    index = 0,
    placeholder,
    colSpan,
}: TextFieldProps) => (
    <ExtraFilterField label={label} index={index} colSpan={colSpan}>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={EXTRA_FILTER_INPUT_CLASS}
        />
    </ExtraFilterField>
)

interface SelectFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    index?: number
    colSpan?: 1 | 2 | 3
}

export const ExtraFilterSelectField = ({
    label,
    value,
    onChange,
    options,
    index = 0,
    colSpan,
}: SelectFieldProps) => (
    <ExtraFilterField label={label} index={index} colSpan={colSpan}>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={EXTRA_FILTER_SELECT_CLASS}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </ExtraFilterField>
)

interface SearchButtonProps {
    loading?: boolean
    label?: string
    loadingLabel?: string
    index?: number
    colSpan?: 1 | 2 | 3
    type?: "submit" | "button"
    onClick?: () => void
    variant?: "search" | "clear"
}

export const ExtraFilterSearchButton = ({
    loading = false,
    label = "Buscar",
    loadingLabel = "Buscando...",
    index = 0,
    colSpan = 2,
    type = "submit",
    onClick,
    variant = "search",
}: SearchButtonProps) => {
    const span =
        colSpan === 1
            ? ""
            : colSpan === 3
              ? "md:col-span-3"
              : "md:col-span-2"

    const isClear = variant === "clear"

    return (
        <motion.button
            type={type}
            disabled={loading}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 + index * 0.04 }}
            whileHover={loading ? undefined : { y: -1 }}
            whileTap={loading ? undefined : { scale: 0.96 }}
            className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${span} ${
                isClear
                    ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    : "border border-blue-700 bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
            {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isClear ? (
                <X className="h-3.5 w-3.5" />
            ) : (
                <Search className="h-3.5 w-3.5" />
            )}
            {loading ? loadingLabel : label}
        </motion.button>
    )
}
