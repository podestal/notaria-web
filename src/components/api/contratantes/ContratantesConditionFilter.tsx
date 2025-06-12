import { useState } from "react"
import FilteredActoCondiciones from "../actoCondicion/FilteredActoCondiciones"
import TopModal from "../../ui/TopModal"

interface Props {
    idtipoacto: string
}

const ContratantesConditionFilter = ({ idtipoacto }: Props) => {

    const [open, setOpen] = useState(false)

  return (
    <>
        <div className="w-full flex justify-center items-center gap-4">
            <button 
                onClick={() => setOpen(true)}
                className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                <span className="font-bold text-green-600 text-md">+</span>
                <span>Condición</span>
            </button>
            <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                <span className="font-bold text-red-600 text-md">-</span>
                <span>Condición</span>
            </button>
        </div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <FilteredActoCondiciones 
                idtipoacto={idtipoacto}
            />
        </TopModal>
    </>
  )
}

export default ContratantesConditionFilter