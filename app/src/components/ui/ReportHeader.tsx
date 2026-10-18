import { motion } from "framer-motion"
import { FileBarChart2, LibraryBig } from "lucide-react"
import type { ReactNode } from "react"

interface Props {
    title: string
    subtitle?: string
    badge?: string
    actions?: ReactNode
}

const ReportHeader = ({
    title,
    subtitle = "Consulta e exportación de índices y reportes",
    badge = "Reportes",
    actions,
}: Props) => {
  return (
    <div className="keep-dark relative flex w-full items-center justify-between overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 text-slate-50">
        <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl"
            animate={{ x: [0, 24, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex min-w-0 items-center gap-3">
            <motion.div
                initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                whileHover={{ rotate: -6, scale: 1.05 }}
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-2"
            >
                <LibraryBig className="text-emerald-300" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="min-w-0"
            >
                <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-300/90">Módulo</p>
                <h2 className="truncate text-lg font-semibold text-white">{title}</h2>
                {subtitle && <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>}
            </motion.div>
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="relative flex shrink-0 items-center gap-3"
        >
            {actions}
            <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-slate-200">
                <FileBarChart2 size={16} className="text-emerald-300" />
                <p className="text-xs font-semibold">{badge}</p>
            </div>
        </motion.div>
    </div>
  )
}

export default ReportHeader
