import { Trash2 } from "lucide-react"
import useRemoveContratante from "../../../hooks/api/contratantes/useRemoveContratante"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
    contratanteId: string
    kardex: string
}

const RemoveContratante = ({ contratanteId, kardex }: Props) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setMessage, setShow, setType } = useNotificationsStore()
    const removeContratante = useRemoveContratante({ kardex, contratanteId })

    const handleRemove = () => {
        setLoading(true)
        removeContratante.mutate(
            { access: "" },
            {
                onSuccess: () => {
                    setType("success")
                    setMessage("Contratante eliminado correctamente.")
                    setShow(true)
                    setOpen(false)
                },
                onError: (error) => {
                    setType("error")
                    setMessage(`Error al eliminar el contratante: ${error.message}`)
                    setShow(true)
                },
                onSettled: () => {
                    setLoading(false)
                },
            }
        )
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title="Eliminar contratante"
                aria-label="Eliminar contratante"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
            >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
            <TopModal isOpen={open} onClose={() => setOpen(false)}>
                <div className="mx-auto max-w-md px-2 py-6 text-center">
                    <h2 className="text-lg font-semibold text-slate-900">
                        ¿Eliminar este contratante?
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Esta acción no se puede deshacer desde aquí.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={loading}
                            className="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Eliminando…" : "Eliminar"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </TopModal>
        </>
    )
}

export default RemoveContratante
