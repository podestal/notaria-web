import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import type { ActoCondicion } from "../../../services/api/actoCondicionService"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useGetActoCondicionByTipoActo from "../../../hooks/api/actoCondicion/useGetActoCondicionByTipoActo"
import useDeleteActoCondicion from "../../../hooks/api/actoCondicion/useDeleteActoCondicion"
import TopModal from "../../ui/TopModal"
import ActoCondicionForm from "./ActoCondicionForm"
import {
    formularioLabel,
    montopLabel,
    mutationErrorMessage,
    normalizeActoCondicion,
    parteLabel,
    resolveActoCondicionId,
} from "./actoCondicionFormShared"

function displayValue(v: unknown): string {
    if (v === null || v === undefined || v === "") return "—"
    return String(v)
}

function normalizeCondiciones(raw: unknown): ActoCondicion[] {
    let list: ActoCondicion[] = []
    if (raw == null) list = []
    else if (Array.isArray(raw)) list = raw as ActoCondicion[]
    else if (typeof raw === "object" && "results" in (raw as object)) {
        const r = (raw as { results?: unknown }).results
        list = Array.isArray(r) ? (r as ActoCondicion[]) : []
    }
    return list.map(normalizeActoCondicion)
}

interface Props {
    idtipoacto: string
    enabled?: boolean
    title?: string
    showCreateForm?: boolean
}

const ActoCondicionesListSection = ({ idtipoacto, enabled = true, title, showCreateForm = true }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const id = idtipoacto.trim()

    const notify = (type: "success" | "error", message: string) => {
        setMessage(message)
        setType(type)
        setShow(true)
    }

    const [editing, setEditing] = useState<ActoCondicion | null>(null)
    const [deleting, setDeleting] = useState<ActoCondicion | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    const { data: condicionesRaw, isLoading, isError, error } = useGetActoCondicionByTipoActo({
        idtipoacto: id,
        access,
        enabled: enabled !== false && Boolean(id),
    })

    const deleteMutation = useDeleteActoCondicion({ idtipoacto: id })

    const condiciones = normalizeCondiciones(condicionesRaw)
    const queryEnabled = enabled !== false && Boolean(access && id)

    const handleDelete = () => {
        if (!deleting || !access) return
        const idc = resolveActoCondicionId(deleting)
        if (!idc) {
            const msg = "No se encontró el id de la condición."
            setActionError(msg)
            notify("error", msg)
            return
        }
        setActionError(null)
        deleteMutation.mutate(
            { access, idcondicion: idc },
            {
                onSuccess: () => {
                    notify("success", "Condición eliminada correctamente.")
                    if (editing && resolveActoCondicionId(editing) === idc) {
                        setEditing(null)
                    }
                    setDeleting(null)
                },
                onError: (err: unknown) => {
                    const msg = mutationErrorMessage(err, "No se pudo eliminar la condición.")
                    setActionError(msg)
                    notify("error", msg)
                },
            }
        )
    }

    return (
        <section>
            <h3 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold text-slate-800">
                {title ?? `Condiciones (${id || "—"})`}
            </h3>
            {!queryEnabled && (
                <p className="text-sm text-slate-500">Inicie sesión y seleccione un acto con id válido para ver condiciones.</p>
            )}
            {queryEnabled && showCreateForm && (
                <ActoCondicionForm
                    idtipoacto={id}
                    editing={editing}
                    onCancelEdit={() => setEditing(null)}
                />
            )}
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
                                <th className="px-3 py-2 text-right">Acciones</th>
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
                                condiciones.map((c) => {
                                    const rowId = resolveActoCondicionId(c)
                                    const isRowEditing = editing != null && resolveActoCondicionId(editing) === rowId
                                    return (
                                        <tr
                                            key={rowId || displayValue(c.condicion)}
                                            className={isRowEditing ? "bg-blue-50/80" : "hover:bg-slate-50/80"}
                                        >
                                            <td className="whitespace-nowrap px-3 py-2 font-mono">{displayValue(rowId)}</td>
                                            <td className="max-w-xs px-3 py-2">{displayValue(c.condicion)}</td>
                                            <td className="px-3 py-2">{parteLabel(c.parte)}</td>
                                            <td className="px-3 py-2">{displayValue(c.uif)}</td>
                                            <td className="px-3 py-2">{formularioLabel(c.formulario)}</td>
                                            <td className="px-3 py-2">{montopLabel(c.montop)}</td>
                                            <td className="px-3 py-2">{displayValue(c.totorgante)}</td>
                                            <td className="max-w-xs px-3 py-2">{displayValue(c.condicionsisgen)}</td>
                                            <td className="px-3 py-2 font-mono">{displayValue(c.codconsisgen)}</td>
                                            <td className="whitespace-nowrap px-3 py-2 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        title="Editar"
                                                        onClick={() => {
                                                            setActionError(null)
                                                            setEditing(c)
                                                        }}
                                                        className="rounded-md p-1.5 text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Eliminar"
                                                        onClick={() => {
                                                            setActionError(null)
                                                            setDeleting(c)
                                                        }}
                                                        className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" aria-hidden />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <TopModal isOpen={deleting !== null} onClose={() => !deleteMutation.isPending && setDeleting(null)}>
                {deleting && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Eliminar condición</h2>
                        <p className="text-sm text-slate-600">
                            ¿Eliminar la condición{" "}
                            <span className="font-mono font-semibold">{resolveActoCondicionId(deleting)}</span> —{" "}
                            {deleting.condicion}?
                        </p>
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleting(null)}
                                disabled={deleteMutation.isPending}
                                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={!access || deleteMutation.isPending}
                                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
                            </button>
                        </div>
                    </div>
                )}
            </TopModal>
        </section>
    )
}

export default ActoCondicionesListSection
