import type { ActoCondicion } from "../../../services/api/actoCondicionService"
import useAuthStore from "../../../store/useAuthStore"
import useGetActoCondicionByTipoActo from "../../../hooks/api/actoCondicion/useGetActoCondicionByTipoActo"
import ActoCondicionCreateForm from "./ActoCondicionCreateForm"

function displayValue(v: unknown): string {
    if (v === null || v === undefined || v === "") return "—"
    return String(v)
}

function normalizeCondiciones(raw: unknown): ActoCondicion[] {
    if (raw == null) return []
    if (Array.isArray(raw)) return raw as ActoCondicion[]
    if (typeof raw === "object" && "results" in (raw as object)) {
        const r = (raw as { results?: unknown }).results
        return Array.isArray(r) ? (r as ActoCondicion[]) : []
    }
    return []
}

interface Props {
    idtipoacto: string
    /** When false, condiciones are not fetched. */
    enabled?: boolean
    title?: string
    /** Mostrar formulario de alta encima de la tabla. */
    showCreateForm?: boolean
}

const ActoCondicionesListSection = ({ idtipoacto, enabled = true, title, showCreateForm = true }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const id = idtipoacto.trim()

    const { data: condicionesRaw, isLoading, isError, error } = useGetActoCondicionByTipoActo({
        idtipoacto: id,
        access,
        enabled: enabled !== false && Boolean(id),
    })

    const condiciones = normalizeCondiciones(condicionesRaw)
    const queryEnabled = enabled !== false && Boolean(access && id)

    return (
        <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                {title ?? `Condiciones (${id || "—"})`}
            </h3>
            {!queryEnabled && (
                <p className="text-sm text-slate-500">Inicie sesión y seleccione un acto con id válido para ver condiciones.</p>
            )}
            {queryEnabled && showCreateForm && <ActoCondicionCreateForm idtipoacto={id} />}
            {queryEnabled && isLoading && <p className="text-sm text-slate-500">Cargando condiciones…</p>}
            {queryEnabled && isError && (
                <p className="text-sm text-red-600">
                    {error instanceof Error ? error.message : "Error al cargar condiciones."}
                </p>
            )}
            {queryEnabled && !isLoading && !isError && (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-slate-50 font-semibold uppercase tracking-wide text-slate-600">
                            <tr>
                                <th className="px-3 py-2">Id</th>
                                <th className="px-3 py-2">Condición</th>
                                <th className="px-3 py-2">Parte</th>
                                <th className="px-3 py-2">UIF</th>
                                <th className="px-3 py-2">Formulario</th>
                                <th className="px-3 py-2">Monto p.</th>
                                <th className="px-3 py-2">Tot. otorgante</th>
                                <th className="px-3 py-2">Cond. Sisgen</th>
                                <th className="px-3 py-2">Cod. cons.</th>
                                <th className="px-3 py-2">Parte gen.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                            {condiciones.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-3 py-8 text-center text-sm text-slate-500">
                                        Aún no hay condiciones. Use el formulario de arriba para agregar la primera.
                                    </td>
                                </tr>
                            ) : (
                                condiciones.map((c, idx) => (
                                    <tr key={`${c.idcondicion}-${idx}`}>
                                        <td className="whitespace-nowrap px-3 py-2 font-mono">{displayValue(c.idcondicion)}</td>
                                        <td className="max-w-xs px-3 py-2">{displayValue(c.condicion)}</td>
                                        <td className="px-3 py-2">{displayValue(c.parte)}</td>
                                        <td className="px-3 py-2">{displayValue(c.uif)}</td>
                                        <td className="px-3 py-2">{displayValue(c.formulario)}</td>
                                        <td className="px-3 py-2">{displayValue(c.montop)}</td>
                                        <td className="px-3 py-2">{displayValue(c.totorgante)}</td>
                                        <td className="max-w-xs px-3 py-2">{displayValue(c.condicionsisgen)}</td>
                                        <td className="px-3 py-2 font-mono">{displayValue(c.codconsisgen)}</td>
                                        <td className="px-3 py-2">{displayValue(c.parte_generacion)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}

export default ActoCondicionesListSection
