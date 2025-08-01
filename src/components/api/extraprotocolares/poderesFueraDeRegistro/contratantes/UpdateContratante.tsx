import { Pencil } from "lucide-react";
import { useState } from "react";
import TopModal from "../../../../ui/TopModal";
import { IngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService";
import UpdateContratanteForm from "./UpdateContratanteForm";
import useUpdatePoderesContratantes from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/contratantes/useUpdatePoderesContratantes";

interface Props {
    contratante: IngresoPoderesContratante
}

const UpdateContratante = ({ contratante }: Props) => {

    const [open, setOpen] = useState(false);
    const updateContratante = useUpdatePoderesContratantes({ ingresoPoderesContratanteId: contratante.id_contrata, poderId: contratante.id_poder });
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
        <UpdateContratanteForm 
            contratante={contratante} 
            setOpen={setOpen}
            updateContratante={updateContratante}
        />
    </TopModal>
    </>
  )
}

export default UpdateContratante