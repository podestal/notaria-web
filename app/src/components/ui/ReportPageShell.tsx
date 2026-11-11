import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface Props {
    children: ReactNode
    className?: string
    /** Skip the outer page chrome when rendered inside a parent module. */
    embedded?: boolean
}

const ReportPageShell = ({ children, className = "", embedded = false }: Props) => {
  if (embedded) {
    return <div className={`w-full text-slate-800 ${className}`}>{children}</div>
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`mx-auto mb-10 mt-[80px] w-[92%] max-w-[1400px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm ${className}`}
    >
        {children}
    </motion.div>
  )
}

export default ReportPageShell
