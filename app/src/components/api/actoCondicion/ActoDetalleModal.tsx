import { useEffect, useMemo, useRef, useState } from "react"
import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"
import useUpdateActo from "../../../hooks/api/acto/useUpdateActo"
import TopModal from "../../ui/TopModal"
import ActoTipoForm, { mergeActoForApi } from "./ActoTipoForm"
import ActoCondicionesListSection from "./ActoCondicionesListSection"

interface Props {
    acto: Acto | null
    isOpen: boolean
    onClose: () => void
    onActoUpdated?: (acto: Acto) => void
}

const ActoDetalleModal = ({ acto, isOpen, onClose, onActoUpdated }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const originalIdRef = useRef("")
    const [form, setForm] = useState<Acto | null>(null)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const { data: tiposKardexRaw } = useGetTipoKardexList()
    const tiposKardex = useMemo(() => (Array.isArray(tiposKardexRaw) ? tiposKardexRaw : []), [tiposKardexRaw])

    const updateActo = useUpdateActo()

    useEffect(() => {
        if (isOpen && acto) {
            originalIdRef.current = acto.idtipoacto.trim()
            setForm({ ...acto })
            setFeedback(null)
        }
    }, [isOpen, acto])

    const idtipoactoForQuery = isOpen && acto?.idtipoacto ? acto.idtipoacto.trim() : ""
    const queryEnabled = Boolean(isOpen && access && idtipoactoForQuery)

    const handleSave = () => {
        if (!form || !access) return
        const urlId = originalIdRef.current
        if (!urlId) {
            setFeedback({ type: "error", message: "No se pudo determinar el id del acto." })
            return
        }
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
                    setForm({ ...data })
                    originalIdRef.current = data.idtipoacto.trim()
                    onActoUpdated?.(data)
                    setFeedback({ type: "success", message: "Acto actualizado." })
                },
                onError: (e: Error) => {
                    setFeedback({ type: "error", message: e instanceof Error ? e.message : "Error al guardar." })
                },
            }
        )
    }

    return (
        <TopModal isOpen={isOpen} onClose={onClose}>
            {!acto || !form ? null : (
                <div className="space-y-8 pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Editar tipo de acto</h2>
                            <p className="mt-1 font-mono text-xs text-slate-600">Id: {acto.idtipoacto}</p>
                            <p className="mt-1 text-sm text-slate-500">
                                Ajuste los datos y guarde. Las condiciones están abajo.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!access || updateActo.isPending}
                            className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {updateActo.isPending ? "Guardando…" : "Guardar acto"}
                        </button>
                    </div>

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

                    <section>
                        <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                            Datos del tipo de acto
                        </h3>
                        <ActoTipoForm value={form} onChange={setForm} tipoKardex={tiposKardex} />
                    </section>

                    <ActoCondicionesListSection idtipoacto={idtipoactoForQuery} enabled={queryEnabled} />
                </div>
            )}
        </TopModal>
    )
}

export default ActoDetalleModal
