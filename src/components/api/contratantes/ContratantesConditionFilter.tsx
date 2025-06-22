import { useState } from "react"
import FilteredActoCondiciones from "../actoCondicion/FilteredActoCondiciones"
import TopModal from "../../ui/TopModal"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import getTipoActoIdArray from "../../../utils/getTipoActoIdArray"

interface Props {
    kardex: string
    idtipoacto: string
    selectedActos: string[]
    setSelectedActos: React.Dispatch<React.SetStateAction<string[]>>
}

const ContratantesConditionFilter = ({ idtipoacto, selectedActos, setSelectedActos, kardex }: Props) => {

    const [open, setOpen] = useState(false)
    const { setMessage, setShow, setType } = useNotificationsStore()
    const tiposActos = getTipoActoIdArray(idtipoacto)

  return (
    <>
        <div className="w-full flex justify-center items-center gap-4">
            <button 
                type="button"
                onClick={() => setOpen(true)}
                className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                <span className="font-bold text-green-600 text-md">+</span>
                <span>Condición</span>
            </button>
            <button 
                type="button"
                onClick={() => setOpen(true)}
                className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                <span className="font-bold text-red-600 text-md">-</span>
                <span>Condición</span>
            </button>
        </div>
        <TopModal
            isOpen={open}
            onClose={() => {
                setOpen(false)
                // setSelectedActos([])
            }}
        >
            {tiposActos.length > 0 && tiposActos.map((tipo, index) => (
                <FilteredActoCondiciones 
                    kardex={kardex}
                    idtipoacto={tipo}
                    selectedActos={selectedActos}
                    setSelectedActos={setSelectedActos}
                    key={index}
                />
            ))}
            <div className="w-full flex justify-center items-center gap-4">
                <button 
                    className="bg-blue-600 px-4 py-2 transition duration-300 text-xs border-1 text-white border-blue-300 cursor-pointer hover:bg-blue-500 rounded-md mt-4"
                    type="button"
                    onClick={() => {
                        if (selectedActos.length === 0) {
                            setMessage("Debe seleccionar al menos una condición")
                            setType("error")
                            setShow(true)
                        } else {
                            setMessage("Condiciones seleccionadas correctamente")
                            setType("success")
                            setShow(true)
                            setOpen(false)
                        }
                    }}
                >
                    Aceptar
                </button>
            </div>
        </TopModal>
    </>
  )
}

export default ContratantesConditionFilter