import { ArrowLeft } from "lucide-react"
import { type ReactNode } from "react"
import { motion } from "framer-motion"

interface LayoutProps {
    title: string
    subtitle?: string
    onBack: () => void
    children: ReactNode
    footer?: ReactNode
}

interface SectionProps {
    title: string
    children: ReactNode
    action?: ReactNode
}

interface DropdownFieldProps {
    label: string
    required?: boolean
    error?: string
    children: ReactNode
}

export const ClienteFormSection = ({ title, children, action }: SectionProps) => (
    <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
            {action}
        </div>
        <div className="p-4 sm:p-5">{children}</div>
    </motion.section>
)

export const ClienteDropdownField = ({ label, required, children }: DropdownFieldProps) => (
    <div className="flex w-full flex-col gap-1.5">
        <label className="block min-h-4 text-xs font-semibold leading-4 text-slate-700">
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {children}
    </div>
)

export const clienteFormBackButtonClass =
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"

export const clienteFormPrimaryButtonClass =
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"

export const clienteFormActionButtonClass =
    "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"

const ClienteContratanteFormLayout = ({ title, subtitle, onBack, children, footer }: LayoutProps) => (
    <div className="mx-auto w-full max-w-4xl text-slate-800">
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
                <button type="button" onClick={onBack} className={`shrink-0 ${clienteFormBackButtonClass}`}>
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                    Volver
                </button>
                <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
                </div>
            </div>
            <div className="space-y-4 bg-slate-50/60 p-4 sm:p-5">{children}</div>
            {footer && (
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
                    {footer}
                </div>
            )}
        </div>
    </div>
)

export default ClienteContratanteFormLayout
