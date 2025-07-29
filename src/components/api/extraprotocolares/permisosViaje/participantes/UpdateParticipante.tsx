import { useState } from "react";
import TopModal from "../../../../ui/TopModal";
import ParticipantesForm from "./ParticipantesForm";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import { Pencil } from "lucide-react";

interface Props {
    contratanteViaje: ViajeContratante;
}

const UpdateParticipante = ({ contratanteViaje }: Props) => {

    const [open, setOpen] = useState(false);

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
        <ParticipantesForm 
            idViaje={contratanteViaje.id_viaje}
        />
    </TopModal>
    </>
  )
}

export default UpdateParticipante