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
    <button
        type="button"
        className="flex items-center justify-center rounded-md p-1 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
        onClick={() => setOpen(true)}
        title="Abrir datos de renta"
        aria-label="Abrir datos de renta"
    >
        <NotebookText className="h-4 w-4 shrink-0" aria-hidden />
    </button>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        wide
        portal
    >
        <ParticipaRentaForm kardex={kardex} contratante={contratante} />
    </TopModal>
    </>
  )
}

export default ParticipaRenta