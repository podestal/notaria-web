import { NotebookText } from "lucide-react"
import TopModal from "../../../ui/TopModal"
import { useState } from "react"
import ParticipaRentaForm from "./ParticipaRentaForm"
import { ContratantesPorActo } from "../../../../services/api/contratantesPorActoService"


interface Props {
    kardex: string
    contratante: ContratantesPorActo
}

const ParticipaRenta = ({ kardex, contratante }: Props) => {

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
        <ParticipaRentaForm kardex={kardex} contratante={contratante} />
    </TopModal>
    </>
  )
}

export default ParticipaRenta