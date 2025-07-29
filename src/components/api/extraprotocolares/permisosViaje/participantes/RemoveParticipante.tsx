import { SquareX } from "lucide-react"
import { useState } from "react"
import TopModal from "../../../../ui/TopModal"
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";

interface Props {
    contratanteViaje: ViajeContratante;
}


const RemoveParticipante = ({ contratanteViaje }: Props) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRemove = () => {
        setLoading(true)
        console.log(`Eliminando participante con ID: ${contratanteViaje.codi_podera}`);
        
        // Aquí iría la lógica para eliminar el participante
        // Por ejemplo, llamar a un hook o servicio que maneje la eliminación
        // Simulando una llamada exitosa
        setTimeout(() => {
            setLoading(false)
            setOpen(false)
            // Mostrar notificación de éxito
        }, 1000)
    }

  return (
<>
        <button
            onClick={() => setOpen(true)}
        >
            <SquareX 
                size={20}
                className="text-red-500 hover:text-red-400 cursor-pointer"
            />
        </button>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <div>
                <h2 className="text-2xl text-center font-bold my-10">Está seguro de eliminar a este contratante</h2>
                <div className="flex items-center justify-center gap-10 mt-4">
                    <button 
                        onClick={() => {
                            handleRemove()
                            setOpen(false)
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
                    >
                        {loading ? '...' : 'Eliminar'}
                    </button>
                    <button 
                        onClick={() => setOpen(false)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors ml-2 cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>

        </TopModal>
    </>
  )
}

export default RemoveParticipante