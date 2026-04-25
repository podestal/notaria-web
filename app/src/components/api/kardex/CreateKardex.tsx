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
            className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/25 transition">
            <span className="font-bold text-lg leading-none">+</span>
            <span className="text-xs font-semibold">Nuevo</span>
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