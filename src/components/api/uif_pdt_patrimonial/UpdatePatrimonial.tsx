import { Pencil } from "lucide-react"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import { Patrimonial } from "../../../services/api/patrimonialService"
import PatrimonialForm from "./PatrimonialForm"
import { Kardex } from "../../../services/api/kardexService"
import useUpdatePatrimonial from "../../../hooks/api/patrimonial/useUpdatePatrimonial"
import KardexFormTabs from "../kardex/KardexFormTabs"
import VehicleMain from "../vehicle/VehicleMain"

interface Props {
    patrimonial: Patrimonial
    kardex: Kardex
}

const UpdatePatrimonial = ({ patrimonial, kardex }: Props) => {

    const [open, setOpen] = useState(false)
    const updatePatrimonial = useUpdatePatrimonial({ idPatrimonial: patrimonial.itemmp })

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
            <>
                <KardexFormTabs 
                    tabs={[
                        { id: 'notes', label: 'Medio de Pago/Tipo de Fondo', content: <PatrimonialForm updatePatrimonial={updatePatrimonial} patrimonial={patrimonial} kardex={kardex}/> },
                        { id: 'escrituración', label: 'Información del Bien', content: <VehicleMain kardex={kardex.kardex} idtipoacto={patrimonial.idtipoacto} /> },
                    ]}
                />
                
            </>
        </TopModal>

    </>
  )
}

export default UpdatePatrimonial