import { SquareX } from "lucide-react"
import { useState } from "react"
import TopModal from "../../../../ui/TopModal"
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import useRemoveContratante from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useRemoveContratante";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    contratanteViaje: ViajeContratante;
}


const RemoveParticipante = ({ contratanteViaje }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const access = useAuthStore(s => s.access_token) || "";
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const removeContratante = useRemoveContratante({
        viajeContratanteId: contratanteViaje.id_contratante,
        viaje_id: contratanteViaje.id_viaje
    })

    const handleRemove = () => {
        setLoading(true)
        removeContratante.mutate({ access }, {
            onSuccess: () => {
                setType('success')
                setMessage('Participante eliminado correctamente.')
                setShow(true)
            },
            onError: (error) => {
                setType('error')
                setMessage(`Error al eliminar el participante: ${error.message}`)
                setShow(true)
            },
            onSettled: () => {
                setLoading(false)
            }
        })
        
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