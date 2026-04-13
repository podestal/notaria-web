import { Landmark } from "lucide-react"
import { useState } from "react"
import TopModal from "../../../ui/TopModal"
import PensionForm from "./poderTypeForms/PensionForm";
import useGetPoderPensionByPoder from "../../../../hooks/api/extraprotocolares/ingresoPoderes/poderes/useGetPoderPensionByPoder";
import useAuthStore from "../../../../store/useAuthStore";

interface Props {
    poderId: number;
}


const CreatePension = ({ poderId }: Props) => {

  const [open, setOpen] = useState(false)
  const access = useAuthStore(s => s.access_token) || ''

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
        
        <div>
            {(() => {
                const { data: poderPension, isLoading, isError, error, isSuccess } = useGetPoderPensionByPoder({ access, poderId });
                if (isLoading) return <div>Cargando...</div>;
                if (isError) return <div>Error: {error.message}</div>;
                if (isSuccess) 
                return (<PensionForm 
                  poderPension={poderPension}
                  setOpen={setOpen}
                  poderId={poderId} />)
            })()}
        </div>
    </TopModal>
    </>
  )
}

export default CreatePension