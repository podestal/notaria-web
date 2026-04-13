import { SquareX } from "lucide-react"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import useRemoveDetalleBien from "../../../hooks/api/detalleBien/useRemoveDetalleBien"
import { DetalleBien } from "../../../services/api/detalleBienService"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
    detalleBien: DetalleBien
}
const RemoveDetalleBien = ({ detalleBien }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const access = useAuthStore(s => s.access_token) || ''

    const [open, setOpen] = useState(false)
    const removeDetalleBien = useRemoveDetalleBien({ detalleBienId: detalleBien.detbien, kardex: detalleBien.kardex })
    const [loading, setLoading] = useState(false)

    const handleRemove = () => {
        setLoading(true)
        removeDetalleBien.mutate({
            access
        }, {
            onSuccess: () => {
                setMessage('Detalle de Bien eliminado correctamente')
                setShow(true)
                setType('success')
            },
            onError: (error) => {
                setMessage(error.message)
                setShow(true)
                setType('error')
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

export default RemoveDetalleBien