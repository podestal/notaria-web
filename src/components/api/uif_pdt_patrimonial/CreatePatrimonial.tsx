import { Newspaper } from "lucide-react"
import { useState } from "react"
import TopModal from "../../ui/TopModal"
import PatrimonialForm from "./PatrimonialForm"
import KardexFormTabs from "../kardex/KardexFormTabs"
import useCreatePatrimonial from "../../../hooks/api/patrimonial/useCreatePatrimonial"
import { Kardex } from "../../../services/api/kardexService"
import VehicleMain from "../vehicle/VehicleMain"
import DetalleBienMain from "../detalleBien/DetalleBienMain"

interface Props {
    kardex: Kardex
}

const CreatePatrimonial = ({ kardex }: Props) => {

    const [open, setOpen] = useState(false)
    const createPatrimonial = useCreatePatrimonial({ kardex: kardex.kardex })
    const [idtipoacto, setIdTipoActo] = useState('')

  return (
    <>
        <button
            className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
            type="button"
            onClick={() => setOpen(true)}
        >
            <Newspaper />
            <p className="text-xs">Nuevo</p>
        </button>
        <>{console.log('kardex', kardex.idtipkar)}</>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <>
                <KardexFormTabs 
                    tabs={[
                        { id: 'notes', label: 'Medio de Pago/Tipo de Fondo', content: <PatrimonialForm createPatrimonial={createPatrimonial} kardex={kardex} setIdTipoActo={setIdTipoActo}/> },
                        { id: 'escrituración', label: 'Información del Bien', content: <>{kardex.idtipkar === 3 ? <VehicleMain kardex={kardex.kardex} idtipoacto={idtipoacto} /> : <DetalleBienMain kardex={kardex.kardex} dtipoacto={idtipoacto} />}</> },
                    ]}
                />
                
            </>
        </TopModal>
    </>
  )
}

export default CreatePatrimonial