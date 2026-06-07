import { User } from "lucide-react"
import type { Persona } from "../../../services/taxes/personasService"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate } from "../../../utils/formatLocalDate"

interface Props {
    persona: Persona
    onEdit?: (persona: Persona) => void
}

const formatDateTime = (iso: string | null) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

const displayValue = (value: string | null | undefined) => {
    if (!value || value === "0" || value === "-") return "—"
    return value
}

const PersonaCard = ({ persona, onEdit }: Props) => {
    const displayName = getTitleCase(persona.nombre_completo || "Sin nombre")

    return (
        <article className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <User className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-800">
                                {persona.numero_documento || "—"}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                Doc. tipo {persona.documento}
                            </span>
                        </div>
                        <h3 className="mt-1 text-sm font-medium leading-snug text-slate-900">
                            {displayName}
                        </h3>
                        {persona.razon_social && persona.razon_social !== "0" && (
                            <p className="mt-0.5 text-xs text-slate-600">
                                {getTitleCase(persona.razon_social)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="shrink-0 text-right text-xs">
                    <div>
                        <p className="text-slate-500">Email</p>
                        <p className="max-w-[220px] truncate font-medium text-slate-800">
                            {displayValue(persona.email)}
                        </p>
                    </div>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(persona)}
                            className="mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Editar
                        </button>
                    )}
                </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-4">
                <div>
                    <dt className="text-slate-500">Dirección</dt>
                    <dd className="font-medium text-slate-800">
                        {getTitleCase(displayValue(persona.direccion))}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Nacimiento</dt>
                    <dd className="font-medium text-slate-800">
                        {formatLocalDate(persona.fecha_nacimiento)}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Nombre comercial</dt>
                    <dd className="font-medium text-slate-800">
                        {getTitleCase(displayValue(persona.nombre_comercial))}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Actualizado</dt>
                    <dd className="font-medium text-slate-800">
                        {formatDateTime(persona.actualizado)}
                    </dd>
                </div>
            </dl>
        </article>
    )
}

export default PersonaCard
