import { useState } from "react";
import TopModal from "../../ui/TopModal";

const CreateDetalleMediosDePago = () => {

    const [open, setOpen] = useState(false);

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
        <p>Registrar</p>
    </TopModal>
    </>
  )
}

export default CreateDetalleMediosDePago