import { useState } from "react";
import TopModal from "../../../../ui/TopModal";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import { Pencil } from "lucide-react";
import UpdateParticipanteForm from "./UpdateParticipanteForm";
import useUpdateContratante from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useUpdateContratante";

interface Props {
    contratanteViaje: ViajeContratante;
}

const UpdateParticipante = ({ contratanteViaje }: Props) => {

    const [open, setOpen] = useState(false);
    const updateContratante = useUpdateContratante({
        viaje_id: contratanteViaje.id_viaje,
        contratanteId: contratanteViaje.id_contratante
    })

  return (
    <>
    <button
        onClick={() =>{
            setOpen(true)}}
    >
        <Pencil 
            size={20}
            className="text-blue-500 hover:text-blue-400 cursor-pointer"
        />
    </button>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <UpdateParticipanteForm 
            contratanteViaje={contratanteViaje}
            setOpen={setOpen}
            updateContratante={updateContratante}
        />
    </TopModal>
    </>
  )
}

export default UpdateParticipante