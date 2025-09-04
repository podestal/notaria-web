import { FileWarning } from "lucide-react"
import { useState } from "react";
import TopModal from "../../../ui/TopModal";
import ExplanationMessage from "../../../ui/ExplanationMessage";
import useUpdatePermisoViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useUpdatePermisoViaje";
import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService";
import useAuthStore from "../../../../store/useAuthStore";

interface Props {
    page: number
    permisoViaje: PermisoViaje
    setNoCorre: React.Dispatch<React.SetStateAction<boolean>>
}

const PermisoNoCorre = ({ 
    page, 
    permisoViaje,
    setNoCorre
}: Props) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const updatePermiso = useUpdatePermisoViaje({ page, permisoViajeId: permisoViaje.id_viaje });

    const handleNoCorre = () => {
        setLoading(true);
        updatePermiso.mutate({
            access,
            permisoViaje: {
                ...permisoViaje,
                swt_est: 'NC',
                fecha_desde: permisoViaje.fecha_desde ? permisoViaje.fecha_desde.toISOString().split('T')[0] : '',
                fecha_hasta: permisoViaje.fecha_hasta ? permisoViaje.fecha_hasta.toISOString().split('T')[0] : '',
            }
        }, {
            onSuccess: () => {
                setNoCorre(true);
                setOpen(false);
            },
            onError: (error) => {
                console.log(error);
            },
            onSettled: () => {
                setLoading(false);
            }
        })
    }
    
  return (
    <>
    <div 
        onClick={() => setOpen(true)}
        className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
        <FileWarning className="text-xl text-amber-500"/>
        <p className="text-xs">No Corre</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <ExplanationMessage 
            onClick={() => setOpen(false)}
            message="Está seguro que desea marcar este permiso como no corre?"
            onClickMessage="Cancelar"
            onClickSecondaryMessage={loading ? 'Guardando...' : 'Marcar como no corre'}
            onClickSecondary={handleNoCorre}
        />
    </TopModal>
    </>
  )
}

export default PermisoNoCorre