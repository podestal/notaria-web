import { useEffect, useState, type FormEvent } from "react"
import type { ActoCondicion } from "../../../services/api/actoCondicionService"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateActoCondicion from "../../../hooks/api/actoCondicion/useCreateActoCondicion"
import useUpdateActoCondicion from "../../../hooks/api/actoCondicion/useUpdateActoCondicion"
import ActoCondicionFormFields from "./ActoCondicionFormFields"
import {
    actoCondicionToFields,
    emptyActoCondicionFields,
    fieldsToActoCondicionPayload,
    mutationErrorMessage,
    resolveActoCondicionId,
    type ActoCondicionFields,
} from "./actoCondicionFormShared"

interface Props {
    idtipoacto: string
    /** Si está definido, el formulario pasa a modo edición. */
    editing?: ActoCondicion | null
    onCancelEdit?: () => void
    disabled?: boolean
}

const ActoCondicionForm = ({ idtipoacto, editing = null, onCancelEdit, disabled = false }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const isEdit = editing != null
    const editId = editing ? resolveActoCondicionId(editing) : ""

    const [f, setF] = useState<ActoCondicionFields>(emptyActoCondicionFields)
    const [localError, setLocalError] = useState<string | null>(null)

    const notify = (type: "success" | "error", message: string) => {
        setMessage(message)
        setType(type)
        setShow(true)
    }

    const create = useCreateActoCondicion()
    const update = useUpdateActoCondicion({ idtipoacto: idtipoacto.trim() })
    const isPending = create.isPending || update.isPending

    useEffect(() => {
        if (editing) {
            setF(actoCondicionToFields(editing))
        } else {
            setF(emptyActoCondicionFields())
        }
        setLocalError(null)
    }, [editing])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setLocalError(null)

        const idta = idtipoacto.trim()
        if (!idta) {
            setLocalError("Falta id de tipo de acto.")
            return
        }
        if (!f.condicion.trim()) {
            setLocalError("El texto de condición es obligatorio.")
            return
        }
        if (!access) {
            setLocalError("Debe iniciar sesión.")
            return
        }

        const payload = fieldsToActoCondicionPayload(f, idta)
        if (!payload) return

        if (isEdit) {
            if (!editId) {
                setLocalError("No se encontró el id de la condición para actualizar.")
                return
            }
            update.mutate(
                { access, idcondicion: editId, body: payload },
                {
                    onSuccess: () => {
                        notify("success", "Condición actualizada correctamente.")
                        onCancelEdit?.()
                    },
                    onError: (err: unknown) => {
                        const msg = mutationErrorMessage(err, "No se pudo actualizar la condición.")
                        notify("error", msg)
                        setLocalError(msg)
                    },
                }
            )
            return
        }

        create.mutate(
            { access, body: payload },
            {
                onSuccess: () => {
                    setF(emptyActoCondicionFields())
                    notify("success", "Condición creada correctamente.")
                },
                onError: (err: unknown) => {
                    const msg = mutationErrorMessage(err, "No se pudo crear la condición.")
                    notify("error", msg)
                    setLocalError(msg)
                },
            }
        )
    }

    return (
        <div
            className={`mb-4 rounded-lg border p-4 ${
                isEdit ? "border-blue-200 bg-blue-50/50" : "border-slate-200 bg-slate-50/80"
            }`}
        >
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <h4 className="text-sm font-semibold text-slate-800">
                        {isEdit ? "Editar condición" : "Nueva condición"}
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Tipo de acto:{" "}
                        <span className="font-mono font-medium text-slate-700">{idtipoacto.trim() || "—"}</span>
                        {isEdit && editId && (
                            <>
                                {" "}
                                · Id: <span className="font-mono font-medium">{editId}</span>
                            </>
                        )}
                    </p>
                </div>
                {isEdit && onCancelEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        disabled={isPending}
                        className="text-xs font-semibold text-slate-600 underline hover:text-slate-900"
                    >
                        Cancelar edición
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                <ActoCondicionFormFields
                    idPrefix={isEdit ? "edit-cond" : "nueva-cond"}
                    value={f}
                    onChange={setF}
                    disabled={disabled || !access || isPending}
                />

                {localError && <p className="text-sm text-red-600">{localError}</p>}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={disabled || !access || isPending}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending
                            ? "Guardando…"
                            : isEdit
                              ? "Guardar cambios"
                              : "Agregar condición"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ActoCondicionForm
