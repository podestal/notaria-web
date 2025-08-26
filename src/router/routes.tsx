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
import EscriturasPublicas from "../components/api/reportes/cronologicos/reportes/EscriturasPublicas";
import NoContenciosos from "../components/api/reportes/cronologicos/reportes/NoContenciosos";
import TransferenciasVehiculares from "../components/api/reportes/cronologicos/reportes/TransferenciasVehiculares";
import GarantiasMobiliarias from "../components/api/reportes/cronologicos/reportes/GarantiasMobiliarias";
import Testamentos from "../components/api/reportes/cronologicos/reportes/Testamentos";
import Protestos from "../components/api/reportes/cronologicos/reportes/Protestos";
import ActasProtestos from "../components/api/reportes/cronologicos/reportes/ActasProtestos";
import CamaraDeComercio from "../components/api/reportes/cronologicos/reportes/CamaraDeComercio";
import CartasNotariales from "../components/api/reportes/cronologicos/reportes/cartasNotariales/CartasNotariales";
import AperturaLibros from "../components/api/reportes/cronologicos/reportes/aperturaLibro/AperturaLibros";
import PermisoViajes from "../components/api/reportes/cronologicos/reportes/permisoViaje/PermisoViajes";
import Poderes from "../components/api/reportes/cronologicos/reportes/Poderes";
import SupervivenciaCapaz from "../components/api/reportes/cronologicos/reportes/SupervivenciaCapaz";
import SupervivenciaIncapaz from "../components/api/reportes/cronologicos/reportes/SupervivenciaIncapaz";
import Domiciliario from "../components/api/reportes/cronologicos/reportes/Domiciliario";
import AlfabeticosMain from "../components/api/reportes/alfabeticos/AlfabeticosMain";
import ArchivosPdtMain from "../components/api/reportes/archivosPdt/ArchivosPdtMain";
import RegistrosUifMain from "../components/api/reportes/registrosUif/RegistrosUifMain";
import ReoporteUifMian from "../components/api/reportes/reporteUif/ReoporteUifMian";
import BusquedaMain from "../components/api/reportes/busqueda/BusquedaMain";
import CorrelativoMain from "../components/api/reportes/correlativo/CorrelativoMain";
import CronologicosPasadoMain from "../components/api/reportes/cronologicosPasado/CronologicosPasadoMain";
import ReporteFirmaMain from "../components/api/reportes/reportePendFirma.tsx/ReporteFirmaMain";
import BusquedaAvanzadaMain from "../components/api/extraprotocolares/busqueda/BusquedaAvanzadaMain";

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
                    },
                    {
                        path: "busquedaAvanzada",
                        element: <PrivateRoutes><BusquedaAvanzadaMain /></PrivateRoutes>
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
                        children: [
                            {
                                path: "escrituras",
                                element: <PrivateRoutes><EscriturasPublicas /></PrivateRoutes>
                            },
                            {
                                path: "no-contenciosos",
                                element: <PrivateRoutes><NoContenciosos /></PrivateRoutes>
                            },
                            {
                                path: "transferencias-vehiculares",
                                element: <PrivateRoutes><TransferenciasVehiculares /></PrivateRoutes>
                            },
                            {
                                path: "garantias-mobiliarias",
                                element: <PrivateRoutes><GarantiasMobiliarias /></PrivateRoutes>
                            },
                            {
                                path: "testamentos",
                                element: <PrivateRoutes><Testamentos /></PrivateRoutes>
                            },
                            {
                                path: "protestos",
                                element: <PrivateRoutes><Protestos /></PrivateRoutes>
                            },
                            {
                                path: "generar-actas-protesto",
                                element: <PrivateRoutes><ActasProtestos /></PrivateRoutes>
                            },
                            {
                                path: "informe-camara-comercio",
                                element: <PrivateRoutes><CamaraDeComercio /></PrivateRoutes>
                            },
                            {
                                path: "cartas-notariales",
                                element: <PrivateRoutes><CartasNotariales /></PrivateRoutes>
                            },
                            {
                                path: "certificacion-apertura-libros",
                                element: <PrivateRoutes><AperturaLibros /></PrivateRoutes>
                            },
                            {
                                path: "permisos-viaje",
                                element: <PrivateRoutes><PermisoViajes /></PrivateRoutes>
                            },
                            {
                                path: "poderes-fuera-registro",
                                element: <PrivateRoutes><Poderes /></PrivateRoutes>
                            },
                            {
                                path: "cart-supervivencia-persona-capaz",
                                element: <PrivateRoutes><SupervivenciaCapaz /></PrivateRoutes>
                            },
                            {
                                path: "cart-supervivencia-persona-incapaz",
                                element: <PrivateRoutes><SupervivenciaIncapaz /></PrivateRoutes>
                            },
                            {
                                path: "certificado-domiciliario",
                                element: <PrivateRoutes><Domiciliario /></PrivateRoutes>
                            }
                        ]
                    },
                    {
                        path: "alfabeticos",
                        element: <PrivateRoutes><AlfabeticosMain /></PrivateRoutes>
                    },
                    {
                        path: "archivos-pdt",
                        element: <PrivateRoutes><ArchivosPdtMain /></PrivateRoutes>
                    },
                    {
                        path: "registros-uif",
                        element: <PrivateRoutes><RegistrosUifMain /></PrivateRoutes>
                    },
                    {
                        path: "reporte-uif-iaoc",
                        element: <PrivateRoutes><ReoporteUifMian /></PrivateRoutes>
                    },
                    {
                        path: "busqueda-avanzada",
                        element: <PrivateRoutes><BusquedaMain /></PrivateRoutes>
                    },
                    {
                        path: "correlativo",
                        element: <PrivateRoutes><CorrelativoMain /></PrivateRoutes>
                    },
                    {
                        path: "cronologicos-pasado",
                        element: <PrivateRoutes><CronologicosPasadoMain /></PrivateRoutes>
                    },
                    {
                        path: "reporte-pendiente-conclusion-firma",
                        element: <PrivateRoutes><ReporteFirmaMain /></PrivateRoutes>
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