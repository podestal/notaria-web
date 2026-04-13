import { FilePen } from 'lucide-react'
import { useState } from 'react';
import TopModal from '../../../ui/TopModal';
import FueraDeRegistroForm from './poderTypeForms/FueraDeRegistroForm';
import useGetPoderRegistroByPoder from '../../../../hooks/api/extraprotocolares/ingresoPoderes/poderes/useGetPoderRegistroByPoder';
import useAuthStore from '../../../../store/useAuthStore';


interface Props {
    poderId: number;
}

const CreatePoderRegistro = ({ poderId }: Props) => {

    const [open, setOpen] = useState(false)
    const access = useAuthStore(s => s.access_token) || ''

  return (
    <>
    <div 
        onClick={() => setOpen(true)}
        className="mx-6 w-40 flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
        <FilePen className="text-white text-xl"/>
        <p className="text-xs font-bold">Formato Libre</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <div>
            {(() => {
                const { data: poderRegistro, isLoading, isError, error, isSuccess } = useGetPoderRegistroByPoder({ access, poderId });
                if (isLoading) return <div>Cargando...</div>;
                if (isError) return <div>Error: {error.message}</div>;
                if (isSuccess) 
                return (<FueraDeRegistroForm 
                    setOpen={setOpen}
                    poderId={poderId}
                    poderRegistro={poderRegistro}
                />)
            })()}
        </div>

        
    </TopModal>
    </>
  )
}

export default CreatePoderRegistro