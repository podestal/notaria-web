import { Landmark } from "lucide-react"
import TopModal from '../../../../ui/TopModal'
import { useState } from "react"

interface Props {
    poderId: number;
}

const PensionForm = ({ poderId }: Props) => {
    const [open, setOpen] = useState(false)
  return (
    <>
    <div 
        onClick={() => setOpen(true)}
        className="mx-6 w-40 flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
        <Landmark className="text-white text-xl"/>
        <p className="text-xs font-bold">Pensiones</p>
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

export default PensionForm