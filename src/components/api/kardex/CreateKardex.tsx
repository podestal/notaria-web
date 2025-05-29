import { useState } from "react"
import TopModal from "../../ui/TopModal"
import KardexForm from "./KardexForm"
import useCreateKardex from "../../../hooks/api/kardex/useCreateKardex"


const CreateKardex = () => {

    const [open, setOpen] = useState(false)
    const createKardex = useCreateKardex({ idtipkar: 1 }) 

  return (
    <>
    <div>
        <button 
            onClick={() => setOpen(true)}
            className="hover:opacity-80 cursor-pointer flex items-center justify-center gap-2">
            <span className="font-bold text-2xl text-green-600">+</span>
            <span className="border-b-2 border-amber-500 pb-1">Nuevo</span>
        </button>
    </div>
    <TopModal 
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <KardexForm 
            createKardex={createKardex}
        />
    </TopModal>
    </>
  )
}

export default CreateKardex