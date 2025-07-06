import { useState } from "react";
import TopModal from "../../ui/TopModal";
import DetalleMediosDePagoForm from "./DetalleMediosDePagoForm";
import useCreateDetalleMedioDePago from "../../../hooks/api/detalleMedioDePago/useCreateDetalleMedioDePago";
import { Patrimonial } from "../../../services/api/patrimonialService";

interface Props {
    patrimonial: Patrimonial
}

const CreateDetalleMediosDePago = ({ patrimonial }: Props) => {

    const [open, setOpen] = useState(false);
    const createDetalleMedioDePago = useCreateDetalleMedioDePago({ itemmp: patrimonial.itemmp });

  return (
    <>
    <div>
        <button
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            type="button"
            onClick={() => setOpen(true)}
        >Registrar M.Pago/T.Fondo
        </button>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <DetalleMediosDePagoForm 
            createDetalleMedioDePago={createDetalleMedioDePago} 
            patrimonial={patrimonial}
        />
    </TopModal>
    </>
  )
}

export default CreateDetalleMediosDePago