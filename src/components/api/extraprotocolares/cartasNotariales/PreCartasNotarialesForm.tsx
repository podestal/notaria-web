import useGetUbigeos from '../../../../hooks/api/ubigeo/useGetUbigeos';
import useGetUsuarios from '../../../../hooks/api/usuarios/useGetUsuarios';
import { IngresoCartas } from '../../../../services/api/extraprotocolares/ingresoCartas';
import useAuthStore from '../../../../store/useAuthStore';
import CartasNotarialesForm from './CartasNotarialesForm';

interface Props {
    carta?: IngresoCartas;
}

const PreCartasNotarialesForm = ({ carta }: Props) => {

    const access =useAuthStore(s => s.access_token) || '';

    const { data: ubigeos, isLoading, isError, isSuccess, error } = useGetUbigeos();
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
            />
        );
}

export default PreCartasNotarialesForm