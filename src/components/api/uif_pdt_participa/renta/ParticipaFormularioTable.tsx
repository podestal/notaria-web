import { Trash2 } from "lucide-react"
import useGetFormularioByRenta from "../../../../hooks/api/formulario/useGetFormularioByRenta"
import useAuthStore from "../../../../store/useAuthStore"

interface Props {
    idrenta: string
}

const ParticipaFormularioTable = ({ idrenta }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: formularios, isLoading, isError, error, isSuccess } = useGetFormularioByRenta({access, idrenta})

    return (
        <>
        <div className="grid grid-cols-9 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4 my-2 place-content-center border-b-2 border-gray-200 text-center">
            <p className="col-span-4">N° Op. Sunat/N° Orden</p>
            <p className="col-span-4">Monto</p>
        </div>
        <div className="">
            {isLoading && <p className="text-center text-xs text-gray-500 animate-pulse my-4">Cargando...</p>}
            {isError && <p className="text-center text-xs text-red-500 my-4">Error: {error?.message}</p>}
            {isSuccess && formularios && formularios.length > 0 && (
                <>
                {formularios.map((formulario) => (
                    <div key={formulario.idformulario}
                    className="grid grid-cols-9 gap-4"
                    >
                        <p className="col-span-4">{formulario.numformu}</p>
                        <p className="col-span-4">{formulario.monto}</p>
                        <button className="col-span-1">
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer transition-all duration-300" />
                        </button>
                    </div>
                ))}
                </>
            )}
        </div>
        </>
    )
}

export default ParticipaFormularioTable