import { FilePen } from "lucide-react"
import { useState } from "react"
import TopModal from "../../../../ui/TopModal"

interface Props {
    poderId: number;
}


const FueraDeRegistroForm = ({ poderId }: Props) => {
    const [open, setOpen] = useState(false)
  return (
    <>
    <div 
        onClick={() => setOpen(true)}
        className="mx-6 w-40 flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
        <FilePen className="text-white text-xl"/>
        <p className="text-xs font-bold">Formato Libre</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <p>Hola</p>
    </TopModal>
</>
  )
}

export default FueraDeRegistroForm