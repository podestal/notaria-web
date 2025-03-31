import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

interface Props {
    children: React.ReactElement;
}

const PrivateRoutes = ({ children }: Props) => {
    const navigate = useNavigate();
    const access = useAuthStore(state => state.access_token);
    

    useEffect(() => {
        console.log("Access Token:", access);
        if (!access) {
            navigate("/login", { replace: true }); // Use replace to prevent back navigation
        }
    }, [access]);


    useEffect(() => {
        console.log('private routes');
        
    }, [])

    return access ? children : null; // Avoid rendering anything until navigation happens
};

export default PrivateRoutes;
