import { SquareX } from "lucide-react"
import useRemoveDetalleMedioDePago from "../../../hooks/api/detalleMedioDePago/useRemoveDetalleMedioDePago"
import { DetalleMedioDePago } from "../../../services/api/detalleMedioDePago";
import { useState } from "react";
import useAuthStore from "../../../store/useAuthStore";
import useNotificationsStore from "../../../hooks/store/useNotificationsStore";
import TopModal from "../../ui/TopModal";

interface Props {
    detalleMedioDePago: DetalleMedioDePago
}

const RemoveDetalleMediosDePago = ({ detalleMedioDePago }: Props) => {

  const access = useAuthStore(s => s.access_token) || '';
  const { setMessage, setShow, setType } = useNotificationsStore()
  const removeMedioDePago = useRemoveDetalleMedioDePago({ itemmp: detalleMedioDePago.itemmp, medioDePagoId: detalleMedioDePago.detmp });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = () => {
    removeMedioDePago.mutate({
      access
    },{
      onSuccess: () => {
        setMessage("Medio de pago eliminado correctamente");
        setType("success");
        setShow(true);
        setOpen(false);
      },
      onError: (error) => {
        setMessage(`Error al eliminar medio de pago: ${error.message}`);
        setType("error");
        setShow(true);
      },
      onSettled: () => {
        setLoading(false);
      }
    });
  }

  return (
    <>
        <button
            onClick={() => setOpen(true)}
            type="button"
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

export default RemoveDetalleMediosDePago