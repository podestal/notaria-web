import { useMemo, useRef, useState, type FormEvent } from "react"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"
import useCreateActo from "../../../hooks/api/acto/useCreateActo"
import useUpdateActo from "../../../hooks/api/acto/useUpdateActo"
import ActoTipoForm, { emptyActo, mergeActoForApi } from "./ActoTipoForm"
import ActoCondicionesListSection from "./ActoCondicionesListSection"

const CreateActo = () => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data: tiposKardexRaw } = useGetTipoKardexList()
    const tiposKardex = useMemo(() => (Array.isArray(tiposKardexRaw) ? tiposKardexRaw : []), [tiposKardexRaw])

    const [form, setForm] = useState(emptyActo)
    const [createdActo, setCreatedActo] = useState<Acto | null>(null)
    const originalIdRef = useRef("")
    const [localError, setLocalError] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const createActo = useCreateActo()
    const updateActo = useUpdateActo()

    const hasCreated = createdActo !== null && String(createdActo.idtipoacto ?? "").trim() !== ""

    const handleCreate = (e: FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setFeedback(null)
        if (!form.desacto.trim()) {
            setLocalError("La descripción es obligatoria.")
            return
        }
        if (!form.idtipkar || form.idtipkar === 0) {
            setLocalError("Seleccione un tipo de kardex.")
            return
        }
        if (!access) {
            setLocalError("Debe iniciar sesión.")
            return
        }
        createActo.mutate(
            { access, acto: mergeActoForApi(form) },
            {
                onSuccess: (data: Acto) => {
                    setCreatedActo(data)
                    originalIdRef.current = data.idtipoacto.trim()
                    setForm({ ...data })
                    setFeedback({
                        type: "success",
                        message: `Acto creado (id: ${data.idtipoacto}). Puede ajustar datos, guardar y gestionar condiciones.`,
                    })
                },
            }
        )
    }

    const handleUpdateActo = () => {
        if (!access || !hasCreated) return
        const urlId = originalIdRef.current
        if (!urlId) return
        if (!form.desacto.trim()) {
            setFeedback({ type: "error", message: "La descripción es obligatoria." })
            return
        }
        if (!form.idtipkar || form.idtipkar === 0) {
            setFeedback({ type: "error", message: "Seleccione un tipo de kardex." })
            return
        }
        setFeedback(null)
        updateActo.mutate(
            { access, idtipoactoUrl: urlId, payload: mergeActoForApi(form) },
            {
                onSuccess: (data: Acto) => {
                    setCreatedActo(data)
                    setForm({ ...data })
                    originalIdRef.current = data.idtipoacto.trim()
                    setFeedback({ type: "success", message: "Acto actualizado." })
                },
                onError: (e: Error) => {
                    setFeedback({
                        type: "error",
                        message: e instanceof Error ? e.message : "Error al actualizar.",
                    })
                },
            }
        )
    }

    return (
        <div className="space-y-6 pb-2">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Nuevo tipo de acto</h2>
                <p className="mt-1 text-sm text-slate-500">
                    {hasCreated
                        ? "El id lo asignó el sistema. Puede seguir editando el acto y las condiciones; el modal permanece abierto."
                        : "Indique tipo de kardex y descripción (obligatorios) y el resto opcional."}
                </p>
            </div>

            {hasCreated && (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                    <span className="font-semibold text-slate-600">Id tipo acto asignado:</span>{" "}
                    <span className="font-mono">{createdActo!.idtipoacto}</span>
                </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
                <section>
                    <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                        Datos del tipo de acto
                    </h3>
                    <ActoTipoForm value={form} onChange={setForm} tipoKardex={tiposKardex} />
                </section>

                {localError && <p className="text-sm text-red-600">{localError}</p>}
                {createActo.isError && (
                    <p className="text-sm text-red-600">
                        {createActo.error instanceof Error ? createActo.error.message : "Error al crear."}
                    </p>
                )}
                {feedback && (
                    <p
                        className={`rounded-md px-3 py-2 text-sm ${
                            feedback.type === "success"
                                ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                                : "border border-red-200 bg-red-50 text-red-800"
                        }`}
                    >
                        {feedback.message}
                    </p>
                )}

                <div className="flex flex-wrap justify-end gap-2 pt-2">
                    {!hasCreated ? (
                        <button
                            type="submit"
                            disabled={!access || createActo.isPending}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createActo.isPending ? "Creando…" : "Crear acto"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleUpdateActo}
                            disabled={!access || updateActo.isPending}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {updateActo.isPending ? "Guardando…" : "Guardar cambios del acto"}
                        </button>
                    )}
                </div>
            </form>

            {hasCreated && <ActoCondicionesListSection idtipoacto={createdActo!.idtipoacto} enabled />}
        </div>
    )
}

export default CreateActo
