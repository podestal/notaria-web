import { Landmark } from "lucide-react"
import { useState } from "react"
import TopModal from "../../../ui/TopModal"
import PensionForm from "./poderTypeForms/PensionForm";

interface Props {
    poderId: number;
}


const CreatePension = ({ poderId }: Props) => {

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
        <PensionForm poderId={poderId} />
    </TopModal>
    </>
  )
}

export default CreatePension