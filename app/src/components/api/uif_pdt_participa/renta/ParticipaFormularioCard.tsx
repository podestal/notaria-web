import { Loader2, Trash2 } from "lucide-react"
import { Formulario } from "../../../../services/api/formularioService"
import useAuthStore from "../../../../store/useAuthStore"
import useRemoveFormulario from "../../../../hooks/api/formulario/useRemoveFormulario"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import { useState } from "react"

interface Props {
    formulario: Formulario
}

const ParticipaFormularioCard = ({ formulario }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const removeFormulario = useRemoveFormulario({ idformulario: formulario.idformulario, idrenta: formulario.idrenta })

    const [isLoading, setIsLoading] = useState(false)

    const handleRemove = () => {
        setIsLoading(true)
        removeFormulario.mutate({
            access: access,
        }, {
            onSuccess: () => {
                setMessage('Formulario eliminado correctamente')
                setShow(true)
                setType('success')
            },
            onError: () => {
                setMessage('Error al eliminar el formulario')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setIsLoading(false)
            }
        })
    }

    return (
        <div
            className="grid grid-cols-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 sm:grid-cols-[1fr_1fr_auto] sm:gap-3"
        >
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:hidden">
                    N° Op. Sunat / Orden
                </p>
                <p className="truncate text-sm font-medium text-slate-800">
                    {formulario.numformu}
                </p>
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:hidden">
                    Monto
                </p>
                <p className="text-sm text-slate-700">
                    {formulario.monto}
                </p>
            </div>
            <div className="flex justify-end sm:justify-center">
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isLoading}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                    aria-label="Eliminar formulario"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                        <Trash2 className="h-4 w-4" aria-hidden />
                    )}
                </button>
            </div>
        </div>
    )
}

export default ParticipaFormularioCard
