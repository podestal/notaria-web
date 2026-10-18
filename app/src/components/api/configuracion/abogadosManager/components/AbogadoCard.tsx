import { ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
    title: string
    subtitle?: string
    children: ReactNode
}

const AbogadoCard = ({ title, subtitle, children }: Props) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
            <header className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            </header>
            <div className="p-4">{children}</div>
        </motion.section>
    )
}

export default AbogadoCard
