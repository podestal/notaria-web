import { ReactNode } from "react"

interface ConfiNotarioSectionProps {
  title: string
  subtitle?: string
  children: ReactNode
}

const ConfiNotarioSection = ({ title, subtitle, children }: ConfiNotarioSectionProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </section>
  )
}

export default ConfiNotarioSection
