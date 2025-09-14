import { NotebookText } from "lucide-react"
import TopModal from "../../../ui/TopModal"
import { useState } from "react"
import ParticipaRentaForm from "./ParticipaRentaForm"


const ParticipaRenta = () => {

    const [open, setOpen] = useState(false)
  return (
    <>
    <div className="flex items-center justify-center">
        <NotebookText 
            className="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-pointer transition-all duration-300" 
            onClick={() => setOpen(true)}
        />
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <ParticipaRentaForm />
    </TopModal>
    </>
  )
}

export default ParticipaRenta