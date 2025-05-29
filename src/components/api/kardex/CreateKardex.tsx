import { useState } from "react"
import KardexForm from "./KardexForm"
import useCreateKardex from "../../../hooks/api/kardex/useCreateKardex"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import TopModalWithTabs from "../../ui/TopModalWithTabs"


const CreateKardex = () => {

    const [open, setOpen] = useState(false)
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const createKardex = useCreateKardex({ idtipkar: bodyRender }) 
    const [notAllowed, setNotAllowed] = useState(true)

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
    <TopModalWithTabs 
        isOpen={open}
        onClose={() => setOpen(false)}
        tabs={[
            { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
            { id: 'details', label: 'Contratantes', content: <p>details</p>, notAllowed },
            { id: 'notes', label: 'Digitación', content: <p>notes</p>, notAllowed },
            { id: 'escrituración', label: 'Escrituración', content: <p>notes</p>, notAllowed },
            { id: 'uif', label: 'UIF/PDT Patrimonial', content: <p>details</p>, notAllowed },
          ]}
    >

    </TopModalWithTabs>
    </>
  )
}

export default CreateKardex