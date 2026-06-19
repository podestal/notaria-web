import { ArrowLeft } from "lucide-react"
import { type ReactNode } from "react"

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
}

interface DropdownFieldProps {
    label: string
    required?: boolean
    error?: string
    children: ReactNode
}

export const ClienteFormSection = ({ title, children }: SectionProps) => (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        {children}
    </section>
)

export const ClienteDropdownField = ({ label, required, error, children }: DropdownFieldProps) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
)

const grayButtonClass =
    "rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs transition duration-300 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"

export const clienteFormBackButtonClass = grayButtonClass

const ClienteContratanteFormLayout = ({ title, subtitle, onBack, children, footer }: LayoutProps) => (
    <div className="text-black">
        <div className="mb-5 flex items-start gap-3 border-b border-slate-200 pb-4">
            <button type="button" onClick={onBack} className={`shrink-0 ${grayButtonClass}`}>
                <span className="inline-flex items-center gap-1.5">
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                    Volver al contratante
                </span>
            </button>
            <div className="min-w-0 flex-1 text-center">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            </div>
            <div className="hidden w-[148px] shrink-0 sm:block" aria-hidden />
        </div>

        <div className="space-y-4">{children}</div>

        {footer && (
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
                {footer}
            </div>
        )}
    </div>
)

export default ClienteContratanteFormLayout
