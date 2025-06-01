import { UserPlus } from "lucide-react"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import PreClientForm from "../clientes/PreClientForm"

const CreateContratante = () => {

    const [open, setOpen] = useState(false)

  return (
    <>
        <div 
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors">
            <UserPlus className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mb-2" />
            <p className="text-[10px] text-center text-gray-700">Agregar Contratante</p>
        </div>
        <div className="z-50">
            <TopModal
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <PreClientForm />
            </TopModal>
        </div>
    </>
  )
}

export default CreateContratante