import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import useAuthStore from "../../store/useAuthStore";
import useGetUser from "../../hooks/auth/useGetUser";
import useUserInfoStore from "../../hooks/store/useGetUserInfo";
import { isSessionOver, redirectToLoginAfterAuthFailure } from "../../services/http/tokenRefresh";

interface Props {
    children: React.ReactElement;
}

const PrivateRoutes = ({ children }: Props) => {
    const navigate = useNavigate();
    const access = useAuthStore(state => state.access_token) || '';
    const { setUser } = useUserInfoStore();
    const { data: user, isLoading, isError, error, isSuccess } = useGetUser({ access });
    

    useEffect(() => {
        if (!access) {
            navigate("/", { replace: true });
        }
    }, [access, navigate]);

    useEffect(() => {
        if (user) setUser(user)
    }, [user, setUser])

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando usuario...</p>;
    if (isError) {
        const status = (error as AxiosError)?.response?.status
        if (status === 401 || status === 403 || axios.isCancel(error) || isSessionOver()) {
            redirectToLoginAfterAuthFailure()
            return null
        }
        return <p className="text-center text-xs text-red-500 my-4">Error al cargar usuario: {error.message}</p>
    }

    if (isSuccess)

    return access ? children : null; // Avoid rendering anything until navigation happens
};

export default PrivateRoutes;
