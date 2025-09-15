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
<       div
            className="grid grid-cols-9 gap-4 border-b-2 border-gray-200 pb-2"
            >
            <p className="col-span-4">{formulario.numformu}</p>
            <p className="col-span-4">{formulario.monto}</p>
            <button 
                onClick={handleRemove}
                disabled={isLoading}
                className="col-span-1"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer transition-all duration-300" />}
            </button>
        </div>
  )
}

export default ParticipaFormularioCard