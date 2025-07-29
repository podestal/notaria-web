import { File } from "lucide-react";
import { useState } from "react";
import TopModal from "../../../../ui/TopModal";
import ParticipantesForm from "./ParticipantesForm";
import useCreateContratante from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useCreateContratante";

interface Props {
    viajeId: number;
}

const CreateParticipante = ({ viajeId }: Props) => {

    const [open, setOpen] = useState(false);
    const createContratante = useCreateContratante({ viaje_id: viajeId });
    

  return (
    <>
        <div 
            onClick={() => setOpen(true)}
            className="mx-6 w-28 flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
            <File className="text-white text-xl"/>
            <p className="text-xs font-bold">Nuevo</p>
        </div>
        <TopModal 
            isOpen={open} 
            onClose={() => setOpen(false)}
        >
            <div className="p-4">
                <h2 className="text-2xl font-semibold mb-6 text-center">Nuevo Participante</h2>
                <ParticipantesForm 
                   createContratante={createContratante}
                   idViaje={viajeId}
                />
            </div>
        </TopModal>
    </>
  )
}

export default CreateParticipante