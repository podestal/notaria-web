import { useState } from "react"
import TopModal from "../../ui/TopModal"
import KardexForm from "./KardexForm"


const CreateKardex = () => {

    const [open, setOpen] = useState(false)
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
        <KardexForm />
    </TopModal>
    </>
  )
}

export default CreateKardex