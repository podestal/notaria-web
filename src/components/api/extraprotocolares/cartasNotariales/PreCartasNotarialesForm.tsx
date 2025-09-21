import { UseMutationResult } from '@tanstack/react-query';
import useGetUbigeos from '../../../../hooks/api/ubigeo/useGetUbigeos';
import useGetUsuarios from '../../../../hooks/api/usuarios/useGetUsuarios';
import { IngresoCartas } from '../../../../services/api/extraprotocolares/ingresoCartas';
import useAuthStore from '../../../../store/useAuthStore';
import CartasNotarialesForm from './CartasNotarialesForm';
import { CreateIngresoCartaData } from '../../../../hooks/api/extraprotocolares/ingresoCartas/useCreateIngresoCarta';

interface Props {
    carta?: IngresoCartas;
    createIngresoCarta?: UseMutationResult<IngresoCartas, Error, CreateIngresoCartaData>
    updateCartaNotarial?: UseMutationResult<IngresoCartas, Error, CreateIngresoCartaData>
}

const PreCartasNotarialesForm = ({ carta, createIngresoCarta, updateCartaNotarial }: Props) => {

    const access =useAuthStore(s => s.access_token) || '';

    const { data: ubigeos, isLoading, isError, isSuccess, error } = useGetUbigeos({ access });
    const { data: usuarios, isLoading: isLoadingUsuarios, isError: isErrorUsuarios, error: errorUsuarios, isSuccess: isSuccessUsuarios } = useGetUsuarios({ access });

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando Ubigeos ...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error al cargar ubigeos: {error.message}</p>;
    if (isLoadingUsuarios) return <p className="text-center text-xs animate-pulse my-4">Cargando Usuarios ...</p>;
    if (isErrorUsuarios) return <p className="text-center text-xs text-red-500 my-4">Error al cargar usuarios: {errorUsuarios.message}</p>;
    if (isSuccess && isSuccessUsuarios)
        return (
            <CartasNotarialesForm
                carta={carta}
                ubigeos={ubigeos}
                usuarios={usuarios}
                createIngresoCarta={createIngresoCarta}
                updateCartaNotarial={updateCartaNotarial}
            />
        );
}

export default PreCartasNotarialesForm