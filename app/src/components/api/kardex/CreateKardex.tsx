import { useState } from "react"
import KardexForm from "./KardexForm"
import useCreateKardex from "../../../hooks/api/kardex/useCreateKardex"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import TopModal from "../../ui/TopModal"
import { Kardex } from "../../../services/api/kardexService"


const CreateKardex = () => {

    const [open, setOpen] = useState(false)
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const createKardex = useCreateKardex({ idtipkar: bodyRender }) 
    const [kardex, setKardex] = useState<Kardex | null>(null)

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
        onClose={() => {
            setOpen(false)
            setKardex(null)
        }}
    >
        <KardexForm 
            createKardex={createKardex} 
            setKardex={setKardex}
            kardex={kardex}
        />
    </TopModal>
    </>
  )
}

export default CreateKardex