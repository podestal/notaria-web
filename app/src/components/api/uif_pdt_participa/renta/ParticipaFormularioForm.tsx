import { useState } from "react"
import SimpleInput from "../../../ui/SimpleInput"
import ParticipaFormularioTable from "./ParticipaFormularioTable"
import useCreateFormulario from "../../../../hooks/api/formulario/useCreateFormulario"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import { Loader2 } from "lucide-react"


interface Props {
    idrenta: string
}

const ParticipaFormularioForm = ({ idrenta }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()

    const [numOp, setNumOp] = useState('')
    const [monto, setMonto] = useState('')
    const createFormulario = useCreateFormulario({ idrenta })

    const [numOpError, setNumOpError] = useState('')
    const [montoError, setMontoError] = useState('')

    const [isLoading, setIsLoading] = useState(false)

    const handleGrabar = () => {

        setNumOpError('')
        setMontoError('')

        if (numOp.length === 0) {
            setNumOpError('El número de operación es requerido')
            return
        }

        if (monto.length === 0) {
            setMontoError('El monto es requerido')
            return
        }

        setIsLoading(true)
        
        createFormulario.mutate({
            access: access,
            formulario: {
                idrenta,
                numformu: numOp,
                monto: monto
            }
        }, {
            onSuccess: () => {
                setMessage('Formulario creado correctamente')
                setShow(true)
                setType('success')
                setNumOp('')
                setMonto('')
            },
            onError: () => {
                setMessage('Error al crear el formulario')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setIsLoading(false)
            }
        })
    }

  return (
    <div className="w-full flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="w-full shrink-0 lg:w-80">
            <h2 className="text-md font-bold">Ingrese formulario</h2>
            <div className="my-4 flex flex-col gap-4">
                <SimpleInput
                    value={numOp}
                    setValue={setNumOp}
                    label="N° Op. Sunat /N° de Orden"
                    horizontal
                    error={numOpError}
                    setError={setNumOpError}
                />
                <SimpleInput
                    value={monto}
                    setValue={setMonto}
                    label="Monto"
                    horizontal
                    error={montoError}
                    setError={setMontoError}
                />
                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleGrabar}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Grabar'}
                    </button>
                </div>
            </div>
        </div>
        <div className="w-full min-w-0 flex-1">
            <h2 className="text-md font-bold mb-4">Formularios</h2>
            <ParticipaFormularioTable idrenta={idrenta} />
        </div>
    </div>
  )
}

export default ParticipaFormularioForm