import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import Login from "../components/auth/Login";
import PrivateRoutes from "../components/auth/PrivateRoutes";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/app",
        element: <PrivateRoutes ><MainPage /></PrivateRoutes>,
        errorElement: <div>404</div>,
    },
    // {
    //     path: "/",
    //     element: <PrivateRoutes><MainPage /></PrivateRoutes>,
    //     errorElement: <div>Error</div>,
    // }
]);

export default routes