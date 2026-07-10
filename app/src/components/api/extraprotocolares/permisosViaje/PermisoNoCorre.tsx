import { FileWarning, RotateCcw } from "lucide-react"
import { useState } from "react";
import TopModal from "../../../ui/TopModal";
import ExplanationMessage from "../../../ui/ExplanationMessage";
import useUpdatePermisoViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useUpdatePermisoViaje";
import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService";
import useAuthStore from "../../../../store/useAuthStore";
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";
import moment from "moment";

interface Props {
    page: number
    permisoViaje: PermisoViaje
    noCorre: boolean
    setNoCorre: React.Dispatch<React.SetStateAction<boolean>>
}

const PermisoNoCorre = ({ 
    page, 
    permisoViaje,
    noCorre,
    setNoCorre
}: Props) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const user = useUserInfoStore(s => s.user);
    const isSuperuser = Number(user?.is_superuser) !== 0;
    const updatePermiso = useUpdatePermisoViaje({ page, permisoViajeId: permisoViaje.id_viaje });

    const handleToggleNoCorre = () => {
        setLoading(true);
        const nextNoCorre = !noCorre;
        updatePermiso.mutate({
            access,
            permisoViaje: {
                ...permisoViaje,
                swt_est: nextNoCorre ? 'NC' : null,
                fecha_desde: permisoViaje.fecha_desde ? moment(permisoViaje.fecha_desde).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                fecha_hasta: permisoViaje.fecha_hasta ? moment(permisoViaje.fecha_hasta).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            }
        }, {
            onSuccess: () => {
                setNoCorre(nextNoCorre);
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

    if (noCorre && !isSuperuser) return null;

    return (
    <>
    <div 
        onClick={() => setOpen(true)}
        className={`w-full flex items-center justify-between px-4 py-2 gap-1 rounded-lg mb-4 cursor-pointer hover:opacity-85 ${
            noCorre
                ? "relative z-20 bg-emerald-200 text-emerald-700"
                : "bg-blue-200 text-blue-600"
        }`}
    >
        {noCorre
            ? <RotateCcw className="text-xl text-emerald-600" />
            : <FileWarning className="text-xl text-amber-500" />}
        <p className="text-xs">{noCorre ? "Revertir No Corre" : "No Corre"}</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        portal
    >
        <ExplanationMessage 
            onClick={() => setOpen(false)}
            message={
                noCorre
                    ? "Está seguro que desea revertir el estado no corre de este permiso?"
                    : "Está seguro que desea marcar este permiso como no corre?"
            }
            onClickMessage="Cancelar"
            onClickSecondaryMessage={
                loading
                    ? "Guardando..."
                    : noCorre
                        ? "Revertir no corre"
                        : "Marcar como no corre"
            }
            onClickSecondary={handleToggleNoCorre}
        />
    </TopModal>
    </>
  )
}

export default PermisoNoCorre
