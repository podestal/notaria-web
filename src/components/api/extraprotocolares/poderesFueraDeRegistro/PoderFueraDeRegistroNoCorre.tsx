import { useState } from 'react'
import useAuthStore from '../../../../store/useAuthStore';
import { FileWarning } from 'lucide-react';
import TopModal from '../../../ui/TopModal';
import ExplanationMessage from '../../../ui/ExplanationMessage';
import { IngresoPoderes } from '../../../../services/api/extraprotocolares/ingresoPoderes';
import useUpdateIngresoPoderes from '../../../../hooks/api/extraprotocolares/ingresoPoderes/UpdateIngresoPoderes';

interface Props {
    page: number
    poderFueraDeRegistro: IngresoPoderes
    setNoCorre: React.Dispatch<React.SetStateAction<boolean>>
}

const PoderFueraDeRegistroNoCorre = ({ 
    page, 
    poderFueraDeRegistro,
    setNoCorre
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const updatePoder = useUpdateIngresoPoderes({ page, ingresoPoderesId: poderFueraDeRegistro.id_poder });

    const handleNoCorre = () => {
        setLoading(true);
        updatePoder.mutate({
            access,
            ingresoPoderes: {
                ...poderFueraDeRegistro,
                swt_est: 'NC'
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
            message="Está seguro que desea marcar este poder como no corre?"
            onClickMessage="Cancelar"
            onClickSecondaryMessage={loading ? 'Guardando...' : 'Marcar como no corre'}
            onClickSecondary={handleNoCorre}
        />
    </TopModal>
    </>
  )
}

export default PoderFueraDeRegistroNoCorre