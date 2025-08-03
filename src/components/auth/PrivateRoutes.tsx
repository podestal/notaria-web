import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useGetUser from "../../hooks/auth/useGetUser";
import useUserInfoStore from "../../hooks/store/useGetUserInfo";

interface Props {
    children: React.ReactElement;
}

const PrivateRoutes = ({ children }: Props) => {
    const navigate = useNavigate();
    const access = useAuthStore(state => state.access_token) || '';
    const { setUser } = useUserInfoStore();
    const { data: user, isLoading, isError, error, isSuccess } = useGetUser({ access });
    

    useEffect(() => {
        console.log("Access Token:", access);
        if (!access) {
            navigate("/", { replace: true }); // Use replace to prevent back navigation
        }
    }, [access]);
    
      useEffect(() => {

        user && setUser(user)

    }, [ user])


    useEffect(() => {
        console.log('private routes');
        
    }, [])

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando usuario...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error al cargar usuario: {error.message}</p>;

    if (isSuccess)

    return access ? children : null; // Avoid rendering anything until navigation happens
};

export default PrivateRoutes;
