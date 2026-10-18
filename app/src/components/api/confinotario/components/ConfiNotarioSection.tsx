import { ReactNode } from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface ConfiNotarioSectionProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  index?: number
  children: ReactNode
  columns?: 1 | 2 | 3
}

const ConfiNotarioSection = ({
  title,
  subtitle,
  icon: Icon,
  index = 0,
  children,
  columns = 2,
}: ConfiNotarioSectionProps) => {
  const cols =
    columns === 1
      ? "md:grid-cols-1"
      : columns === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2"

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 + index * 0.06, ease: "easeOut" }}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        {Icon ? (
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
            <Icon size={15} aria-hidden />
          </span>
        ) : null}
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <div className={`grid grid-cols-1 gap-2.5 p-4 ${cols}`}>{children}</div>
    </motion.section>
  )
}

export default ConfiNotarioSection
