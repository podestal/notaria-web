import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface Props {
    count: number
    label?: string
    hint?: string
    minWidth?: string
    children: ReactNode
    footer?: ReactNode
}

const ExtraTableShell = ({
    count,
    label = "registros encontrados",
    hint,
    minWidth = "960px",
    children,
    footer,
}: Props) => {
  return (
    <div className="p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
                <p className="flex items-center gap-1 text-xs text-slate-500">
                    <motion.span
                        key={count}
                        initial={{ opacity: 0, y: -6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="inline-block font-semibold text-slate-800"
                    >
                        {count}
                    </motion.span>
                    {label}
                </p>
                {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
            </div>
            <div className="overflow-x-auto">
                <div style={{ minWidth }}>{children}</div>
            </div>
            {footer}
        </div>
    </div>
  )
}

export default ExtraTableShell

export const EXTRA_HEADER_CLASS =
    "sticky top-0 z-10 grid items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur"

export const EXTRA_ROW_CLASS =
    "group grid items-center gap-3 px-4 py-3 text-xs text-slate-700 transition-colors hover:bg-sky-50/70"

export const EXTRA_ID_BADGE_CLASS =
    "inline-flex max-w-full truncate rounded-md bg-sky-50 px-2 py-1 font-mono text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100 transition group-hover:bg-sky-100 group-hover:ring-sky-200"
