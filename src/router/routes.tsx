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
import SisgenMain from "../components/api/sisgen/SisgenMain";
import LegalizacionMain from "../components/api/extraprotocolares/legalizacion/LegalizacionMain";
import PermisosMain from "../components/api/extraprotocolares/permisosViaje/PermisosMain";
import PoderesFueraDeRegistroMain from "../components/api/extraprotocolares/poderesFueraDeRegistro/PoderesFueraDeRegistroMain";
import CartasNotarialesMain from "../components/api/extraprotocolares/cartasNotariales/CartasNotarialesMain";
import AperturaDeLibrosMain from "../components/api/extraprotocolares/AperturaDeLibros/AperturaDeLibrosMain";
import SuperCapazMain from "../components/api/extraprotocolares/supervivenciaCapaz/SuperCapazMain";
import SuperIncapazMain from "../components/api/extraprotocolares/supervivenciaIncapaz/SuperIncapazMain";
import CertDomiciliarioMain from "../components/api/extraprotocolares/certificadoDomiciliario/CertDomiciliarioMain";
import CambioCaracteristicasMain from "../components/api/extraprotocolares/cambioCaracteristicas/CambioCaracteristicasMain";
import CronologicosMain from "../components/api/reportes/cronologicos/CronologicosMain";

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
                </PrivateRoutes>,
                children: [
                    {
                        path:"certificacionFirmas",
                        element: <PrivateRoutes><LegalizacionMain /></PrivateRoutes>
                    },
                    {
                        path:"permisosViaje",
                        element: <PrivateRoutes><PermisosMain /></PrivateRoutes>
                    },
                    {
                        path:"poderesFueraDeRegistro",
                        element: <PrivateRoutes><PoderesFueraDeRegistroMain /></PrivateRoutes>
                    },
                    {
                        path:"cartaNotarial",
                        element: <PrivateRoutes><CartasNotarialesMain /></PrivateRoutes>
                    },
                    {
                        path: "aperturaLibros",
                        element: <PrivateRoutes><AperturaDeLibrosMain /></PrivateRoutes>
                    },
                    {
                        path: "supervivenciaCapaz",
                        element: <PrivateRoutes><SuperCapazMain /></PrivateRoutes>
                    },
                    {
                        path: "supervivenciaIncapaz",
                        element: <PrivateRoutes><SuperIncapazMain /></PrivateRoutes>
                    },
                    {
                        path: "certificadoDomiciliario",
                        element: <PrivateRoutes><CertDomiciliarioMain /></PrivateRoutes>
                    },
                    {
                        path: "cambioCaracteristicas",
                        element: <PrivateRoutes><CambioCaracteristicasMain /></PrivateRoutes>
                    }
                ]
            },
            {
                path: "reportes",
                element: 
                <PrivateRoutes>
                    <ReportesMain />
                </PrivateRoutes>,
                children: [
                    {
                        path: "cronologicos",
                        element: 
                        <PrivateRoutes>
                            <CronologicosMain />
                        </PrivateRoutes>,
                        // úblicas", path: "/app/reportes/cronologicos/escrituras"}, 
                        // {name: "Asunotos No Contenciosos", path: "/app/reportes/cronologicos/no-contenciosos"}, 
                        // {name: "Transferencias Vehiculares", path: "/app/reportes/cronologicos/transferencias-vehiculares"}, 
                        // {name: "Garantías Mobiliarias", path: "/app/reportes/cronologicos/garantias-mobiliarias"}, 
                        // {name: "Testamentos", path: "/app/reportes/cronologicos/testamentos"}, 
                        // {name: "Protestos", path: "/app/reportes/cronologicos/protestos"}, 
                        // {name: "Generar Actas Protesto", path: "/app/reportes/cronologicos/generar-actas-protesto"}, 
                        // {name: "Informe a la Cámara de Comercio", path: "/app/reportes/cronologicos/informe-camara-comercio"}, 
                        // {name: "Cartas Notariales", path: "/app/reportes/cronologicos/cartas-notariales"}
                        children: [
                            {
                                path: "escrituras",
                                element: <p>Escrituras</p>
                            },
                            
                            {
                                path: "no-contenciosos",
                                element: <p>No Contenciosos</p>
                            },
                            {
                                path: "transferencias-vehiculares",
                                element: <p>Transferencias Vehiculares</p>
                            },
                            {
                                path: "garantias-mobiliarias",
                                element: <p>Garantías Mobiliarias</p>
                            },
                            
                            {
                                path: "testamentos",
                                element: <p>Testamentos</p>
                            },
                            
                            {
                                path: "protestos",
                                element: <p>Protestos</p>
                            },
                            {
                                path: "generar-actas-protesto",
                                element: <p>Generar Actas Protesto</p>
                            },
                            {
                                path: "informe-camara-comercio",
                                element: <p>Informe a la Cámara de Comercio</p>
                            },
                            {
                                path: "cartas-notariales",
                                element: <p>Cartas Notariales</p>
                            },
                            
                            
                            
                            

                            
                        ]
                    },
                    {
                        path: "alfabeticos",
                        element: <p>Alfabeticos</p>
                    },
                    {
                        path: "archivos-pdt",
                        element: <p>Archivos PDT</p>
                    },
                    
                ]
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
                    <SisgenMain />
                </PrivateRoutes>
            },
        ]
    },
]);

export default routes