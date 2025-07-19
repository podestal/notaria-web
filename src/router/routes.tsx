import { createBrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";
import Login from "../components/auth/Login";
import PrivateRoutes from "../components/auth/PrivateRoutes";
import KardexMain from "../components/api/kardex/KardexMain";
import ExtraprotocolaresMain from "../components/api/extraprotocolares/ExtraprotocolaresMain";
import ReportesMain from "../components/api/reportes/ReportesMain";
import CajaMain from "../components/api/caja/CajaMain";
import UsuariosMain from "../components/api/usuarios/UsuariosMain";
import HerramientasMain from "../components/api/herramientas/HerramientasMain";
import ConfiguracionMain from "../components/api/configuracion/ConfiguracionMain";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/app",
        element:<MainPage />,
        errorElement: <div>404</div>,
        children: [
            {
                path: "protocolares",
                element: 
                <PrivateRoutes>
                    <KardexMain />
                </PrivateRoutes>
            },
            {
                path: "extraprotocolares",
                element: 
                <PrivateRoutes>
                    <ExtraprotocolaresMain />
                </PrivateRoutes>
            },
            {
                path: "reportes",
                element: 
                <PrivateRoutes>
                    <ReportesMain />
                </PrivateRoutes>
            },
                        {
                path: "caja",
                element: 
                <PrivateRoutes>
                    <CajaMain />
                </PrivateRoutes>
            },
                        {
                path: "usuarios",
                element: 
                <PrivateRoutes>
                    <UsuariosMain />
                </PrivateRoutes>
            },
                        {
                path: "herramientas",
                element: 
                <PrivateRoutes>
                    <HerramientasMain />
                </PrivateRoutes>
            },
                        {
                path: "configuracion",
                element: 
                <PrivateRoutes>
                    <ConfiguracionMain />
                </PrivateRoutes>
            },
            {
                path: "sisgen",
                element: 
                <PrivateRoutes>
                    <p>Sisgen</p>
                </PrivateRoutes>
            },
        ]
    },
    // {
    //     path: "/",
    //     element: <PrivateRoutes><MainPage /></PrivateRoutes>,
    //     errorElement: <div>Error</div>,
    // }
]);

export default routes