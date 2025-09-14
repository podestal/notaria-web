import { BrushCleaning, Loader2 } from "lucide-react"
import SingleSelect from "../../../ui/SingleSelect"
import { useState } from "react"
import useAuthStore from "../../../../store/useAuthStore"
import useCreateRenta from "../../../../hooks/api/renta/useCreateRenta"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"



const options = [
    { value: '1', label: 'Si' },
    { value: '0', label: 'No' },
]

interface Props {
    kardex: string
    idcontratante: string
}

const ParticipaRentaForm = ({ kardex, idcontratante }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType} = useNotificationsStore()

    const [pregu1, setPregu1] = useState('')
    const [pregu2, setPregu2] = useState('')
    const [pregu3, setPregu3] = useState('')

    const [pregu1Error, setPregu1Error] = useState(false)
    const [pregu2Error, setPregu2Error] = useState(false)
    const [pregu3Error, setPregu3Error] = useState(false)

    const [loading, setLoading] = useState(false)

    const createRenta = useCreateRenta()

    const handleLimpiarPreguntas = () => {
        setPregu1('')
        setPregu2('')
        setPregu3('')
    }

    const handleGrabar = () => {
        setPregu1Error(false)
        setPregu2Error(false)
        setPregu3Error(false)

        if (pregu1 === '') {
            setPregu1Error(true)
            return
        } 
        if (pregu2 === '') {
            setPregu2Error(true)
            return
        }
        if (pregu3 === '') {
            setPregu3Error(true)
            return
        }
        console.log('Grabando')
        console.log(kardex, idcontratante)
        console.log(pregu1, pregu2, pregu3)

        setLoading(true)

        createRenta.mutate({
            access: access,
            renta: {
                kardex: kardex,
                idcontratante: idcontratante,
                pregu1: pregu1,
                pregu2: pregu2,
                pregu3: pregu3,
            }
        }, {
            onSuccess: () => {
                setMessage('Renta creada correctamente')
                setShow(true)
                setType('success')
            },
            onError: () => {
                setMessage('Error al crear la renta')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })
    }

  return (
    <div className="w-full">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Datos de la Renta</h2>
            <div 
                onClick={handleLimpiarPreguntas}
                className="flex items-center justify-center gap-2"
            >
                <BrushCleaning className="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-pointer transition-all duration-300" />
                <p className="text-sm text-gray-900 hover:text-gray-500 cursor-pointer transition-all duration-300 font-bold">Limpiar Preguntas</p>
            </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2 my-6">
            <p className="font-semibold mb-4">Presentó Comunicación con Cáracter de DECLARACIÓN JURADA indicando:</p>
            <div className="w-full flex flex-col items-start justify-center gap-2">
                <div className="w-full flex items-center justify-between">
                    <p>¿La enajenación generó renta de 3ra Categoría?</p>
                    <SingleSelect name="pregunta1" options={options} selected={pregu1} onChange={(value) => {
                        setPregu1(value)
                        setPregu1Error(false)
                    }} />
                </div>
                {pregu1Error && <p className="text-red-500 text-[10px]">Esta pregunta es requerida</p>}
                <div className="w-full flex items-center justify-between">
                    <p>¿El bien enajenado era la casa habitación del enajenante?</p>
                    <SingleSelect name="pregunta2" options={options} selected={pregu2} onChange={(value) => {
                        setPregu2(value)
                        setPregu2Error(false)
                    }} />
                </div>
                {pregu2Error && <p className="text-red-500 text-[10px]">Esta pregunta es requerida</p>}
                <div className="w-full flex items-center justify-between">
                    <p>¿El impuesto por pagar es cero?</p>
                    <SingleSelect name="pregunta3" options={options} selected={pregu3} onChange={(value) => {
                        setPregu3(value)
                        setPregu3Error(false)
                    }} />
                </div>
                {pregu3Error && <p className="text-red-500 text-[10px]">Esta pregunta es requerida</p>}
            </div>
        </div>
        <div className="flex items-center justify-start my-4">
            <button 
                onClick={handleGrabar}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-all duration-300"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Grabar'}
            </button>
        </div>
    </div>
  )
}

export default ParticipaRentaForm