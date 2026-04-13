import { SquareX } from 'lucide-react';
import { useState } from 'react'
import TopModal from '../../ui/TopModal';
import useAuthStore from '../../../store/useAuthStore';
import useRemoveVehicular from '../../../hooks/api/vehiculares/useRemoveVehicular';
import useNotificationsStore from '../../../hooks/store/useNotificationsStore';

interface Props {
    idVehicular: number;
    kardex: string;
}

const RemoveVehicle = ({ idVehicular, kardex }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const removeVehicular = useRemoveVehicular({ idVehicular, kardex });

    const handleRemove = () => {
        setLoading(true)
        removeVehicular.mutate(
            { access }, 
            {
                onSuccess: () => {
                    setMessage('Vehículo eliminado correctamente');
                    setShow(true);
                    setType('success');
                },
                onError: (error) => {
                    setMessage(`Error al eliminar el vehículo: ${error.message}`);
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                    setOpen(false);
                }
            });
        setOpen(false);
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
                <h2 className="text-2xl text-center font-bold my-10">Está seguro de eliminar ese bien</h2>
                <div className="flex items-center justify-center gap-10 mt-4">
                    <button 
                        type="button"
                        onClick={() => {
                            handleRemove()
                            setOpen(false)
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer"
                    >
                        {loading ? '...' : 'Eliminar'}
                    </button>
                    <button 
                        type="button"
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

export default RemoveVehicle