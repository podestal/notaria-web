import useGetFormularioByRenta from "../../../../hooks/api/formulario/useGetFormularioByRenta"
import useAuthStore from "../../../../store/useAuthStore"
import ParticipaFormularioCard from "./ParticipaFormularioCard"
import { FileX2 } from "lucide-react"

interface Props {
    idrenta: string
}

const ParticipaFormularioTable = ({ idrenta }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: formularios, isLoading, isError, error, isSuccess } = useGetFormularioByRenta({ access, idrenta })

    if (isLoading) {
        return (
            <p className="py-8 text-center text-sm text-slate-500 animate-pulse">
                Cargando formularios…
            </p>
        )
    }

    if (isError) {
        return (
            <p className="py-8 text-center text-sm text-rose-600">
                Error: {error?.message}
            </p>
        )
    }

    if (!formularios || formularios.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                <FileX2 className="h-8 w-8 text-slate-300" aria-hidden />
                <p className="text-sm font-medium text-slate-600">Sin formularios</p>
                <p className="text-xs text-slate-400">
                    Agregue el primer formulario usando el panel izquierdo.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto] gap-3 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>N° Op. Sunat / Orden</span>
                <span>Monto</span>
                <span className="w-9 text-center">Acción</span>
            </div>
            <div className="flex flex-col gap-2">
                {formularios.map((formulario) => (
                    <ParticipaFormularioCard key={formulario.idformulario} formulario={formulario} />
                ))}
            </div>
        </div>
    )
}

export default ParticipaFormularioTable
