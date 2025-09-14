import { BrushCleaning } from "lucide-react"
import SingleSelect from "../../../ui/SingleSelect"
import { useEffect, useState } from "react"

// type Option = {
//     value: string;
//     label: string;
//   };
  
//   interface SingleSelectProps {
//       options: Option[];
//       selected: string;
//       onChange: (value: string) => void;
//       disabled?: boolean;
//   }

const optionsPregunta1 = [
    { value: 'si', label: 'Si' },
    { value: 'no', label: 'No' },
]

const optionsPregunta2 = [
    { value: 'si', label: 'Si' },
    { value: 'no', label: 'No' },
]

const optionsPregunta3 = [
    { value: 'si', label: 'Si' },
    { value: 'no', label: 'No' },
]

const ParticipaRentaForm = () => {
    // pregu1 | pregu2 | pregu3

    const [pregu1, setPregu1] = useState('n')
    const [pregu2, setPregu2] = useState('n')
    const [pregu3, setPregu3] = useState('n')

    const [pregu1Error, setPregu1Error] = useState(false)
    const [pregu2Error, setPregu2Error] = useState(false)
    const [pregu3Error, setPregu3Error] = useState(false)

    const handleLimpiarPreguntas = () => {
        setPregu1('')
        setPregu2('')
        setPregu3('')
    }

    const handleGrabar = () => {
        setPregu1Error(false)
        setPregu2Error(false)
        setPregu3Error(false)

        if (pregu1 === 'n' || pregu1 === '') {
            setPregu1Error(true)
            return
        } 
        if (pregu2 === 'n' || pregu2 === '') {
            setPregu2Error(true)
            return
        }
        if (pregu3 === 'n' || pregu3 === '') {
            setPregu3Error(true)
            return
        }
        console.log('Grabar')
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
                    <SingleSelect name="pregunta1" options={optionsPregunta1} selected={pregu1} onChange={(value) => {
                        setPregu1(value)
                        setPregu1Error(false)
                    }} />
                </div>
                {pregu1Error && <p className="text-red-500 text-sm">Esta pregunta es requerida</p>}
                <div className="w-full flex items-center justify-between">
                    <p>¿El bien enajenado era la casa habitación del enajenante?</p>
                    <SingleSelect name="pregunta2" options={optionsPregunta2} selected={pregu2} onChange={(value) => {
                        setPregu2(value)
                        setPregu2Error(false)
                    }} />
                </div>
                {pregu2Error && <p className="text-red-500 text-sm">Esta pregunta es requerida</p>}
                <div className="w-full flex items-center justify-between">
                    <p>¿El impuesto por pagar es cero?</p>
                    <SingleSelect name="pregunta3" options={optionsPregunta3} selected={pregu3} onChange={(value) => {
                        setPregu3(value)
                        setPregu3Error(false)
                    }} />
                </div>
                {pregu3Error && <p className="text-red-500 text-sm">Esta pregunta es requerida</p>}
            </div>
        </div>
        <div className="flex items-center justify-start my-4">
            <button 
                onClick={handleGrabar}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer transition-all duration-300"
            >
                Grabar
            </button>
        </div>
    </div>
  )
}

export default ParticipaRentaForm