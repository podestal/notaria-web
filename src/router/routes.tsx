import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import Login from "../components/auth/Login";
import PrivateRoutes from "../components/auth/PrivateRoutes";

const routes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <PrivateRoutes><MainPage /></PrivateRoutes>,
        errorElement: <div>Error</div>,
    }
]);

export default routes