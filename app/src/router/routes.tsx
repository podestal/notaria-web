import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import MainPage from "../pages/MainPage";
import Login from "../components/auth/Login";
import PrivateRoutes from "../components/auth/PrivateRoutes";
import KardexMain from "../components/api/kardex/KardexMain";
import PanelGeneralMain from "../components/api/panelGeneral/PanelGeneralMain";
import ExtraprotocolaresMain from "../components/api/extraprotocolares/ExtraprotocolaresMain";
import ExtraprotocolaresHub from "../components/api/extraprotocolares/ExtraprotocolaresHub";
import ReportesMain from "../components/api/reportes/ReportesMain";
import CajaMain from "../components/api/caja/CajaMain";
import UsuariosMain from "../components/api/usuarios/UsuariosMain";
import HerramientasMain from "../components/api/herramientas/HerramientasMain";
import ConfiguracionMain from "../components/api/configuracion/ConfiguracionMain";
import SisgenMain from "../components/api/sisgen/SisgenMain";
import DocumentosMain from "../components/api/documentos/DocumentosMain";
import DocumentosVehicularesMain from "../components/api/documentos/vehiculares/DocumentosVehicularesMain";
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
import AlfabeticosMain from "../components/api/reportes/alfabeticos/AlfabeticosMain";
import ArchivosPdtMain from "../components/api/reportes/archivosPdt/ArchivosPdtMain";
import RegistrosUifMain from "../components/api/reportes/registrosUif/RegistrosUifMain";
import ReoporteUifMian from "../components/api/reportes/reporteUif/ReoporteUifMian";
import BusquedaMain from "../components/api/reportes/busqueda/BusquedaMain";
import CorrelativoMain from "../components/api/reportes/correlativo/CorrelativoMain";
import CronologicosPasadoMain from "../components/api/reportes/cronologicosPasado/CronologicosPasadoMain";
import ReporteFirmaMain from "../components/api/reportes/reportePendFirma.tsx/ReporteFirmaMain";
import BusquedaAvanzadaMain from "../components/api/extraprotocolares/busqueda/BusquedaAvanzadaMain";
import PlantillasMain from "../components/api/plantillas/PlantillasMain";
import ConfiNotarioMain from "../components/api/confinotario/ConfiNotarioMain";
import UsuariosConfigMain from "../components/api/configuracion/usuarios/UsuariosConfigMain";
import AbogadosMain from "../components/api/configuracion/abogadosManager/AbogadosMain";
import ActoCondicionMain from "../components/api/actoCondicion/ActoCondicionMain";
import TaxesMain from "../components/taxes/TaxesMain";
import CatalogoMain from "../components/taxes/catalogo/CatalogoMain";
import BoletasMain from "../components/taxes/boletas/BoletasMain";
import FacturasMain from "../components/taxes/facturas/FacturasMain";
import NotasMain from "../components/taxes/notas/NotasMain";
import ResumenesMain from "../components/taxes/resumenes/ResumenesMain";
import ReservacionesMain from "../components/api/configuracion/reservaciones/ReservacionesMain";
import TaxesUsuariosMain from "../components/api/configuracion/taxesUsuarios/TaxesUsuariosMain";
import TareasMain from "../components/api/configuracion/tareas/TareasMain";
import PersonasMain from "../components/taxes/personas/PersonasMain";
import { isFacturacionEnabled } from "../utils/isFacturacionEnabled";
import ControlInternoMain from "../components/taxes/controlInterno/ControlInternoMain";
import NotFoundPage from "../pages/NotFoundPage";

const taxesRoutes = isFacturacionEnabled()
    ? [
          {
              path: "taxes",
              element: (
                  <PrivateRoutes>
                      <TaxesMain />
                  </PrivateRoutes>
              ),
              children: [
                  {
                      index: true,
                      element: <Navigate to="catalogo" replace />,
                  },
                  {
                      path: "personas",
                      element: (
                          <PrivateRoutes>
                              <PersonasMain />
                          </PrivateRoutes>
                      ),
                  },
                  {
                      path: "catalogo",
                      element: (
                          <PrivateRoutes>
                              <CatalogoMain />
                          </PrivateRoutes>
                      ),
                  },
                  {
                      path: "control-interno",
                      element: (
                          <PrivateRoutes>
                              <ControlInternoMain />
                          </PrivateRoutes>
                      ),
                  },
                  {
                      path: "boletas",
                      element: (
                          <PrivateRoutes>
                              <BoletasMain />
                          </PrivateRoutes>
                      ),
                  },
                  {
                      path: "facturas",
                      element: (
                          <PrivateRoutes>
                              <FacturasMain />
                          </PrivateRoutes>
                      ),
                  },
                  {
                      path: "notas",
                      element: (
                          <PrivateRoutes>
                              <NotasMain />
                          </PrivateRoutes>
                      ),
                  },
                  {
                      path: "notas-credito",
                      element: <Navigate to="/app/taxes/notas" replace />,
                  },
                  {
                      path: "notas-debito",
                      element: <Navigate to="/app/taxes/notas" replace />,
                  },
                  {
                      path: "resumenes",
                      element: (
                          <PrivateRoutes>
                              <ResumenesMain />
                          </PrivateRoutes>
                      ),
                  },
              ],
          },
      ]
    : [];

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/app",
        element: <Outlet />,
        errorElement: <NotFoundPage />,
        children: [
            {
                element: <MainPage />,
                children: [
            {
                path: "panel-general",
                element: (
                    <PrivateRoutes>
                        <PanelGeneralMain />
                    </PrivateRoutes>
                ),
            },
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
                        index: true,
                        element: <ExtraprotocolaresHub />,
                    },
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
                        element: (
                            <PrivateRoutes>
                                <CronologicosMain />
                            </PrivateRoutes>
                        ),
                    },
                    {
                        path: "cronologicos/*",
                        element: <Navigate to="/app/reportes/cronologicos" replace />,
                    },
                    {
                        path: "alfabeticos",
                        element: (
                            <PrivateRoutes>
                                <AlfabeticosMain />
                            </PrivateRoutes>
                        ),
                    },
                    {
                        path: "alfabeticos/*",
                        element: <Navigate to="/app/reportes/alfabeticos" replace />,
                    },
                    {
                        path: "archivos-pdt",
                        element: <Navigate to="/app/archivos-pdt" replace />,
                        children: [
                            {
                                path: "*",
                                element: <Navigate to="/app/archivos-pdt" replace />,
                            },
                        ],
                    },
                    {
                        path: "registros-uif",
                        element: <Navigate to="/app/registros-uif" replace />,
                    },
                    {
                        path: "reporte-uif-iaoc",
                        element: <PrivateRoutes><ReoporteUifMian /></PrivateRoutes>,
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
                </PrivateRoutes>,
                children: [
                    {
                        path: "configuracion-notario",
                        element: <PrivateRoutes><ConfiNotarioMain /></PrivateRoutes>
                    },
                    {
                        path: "acto-condicion",
                        element: <PrivateRoutes><ActoCondicionMain /></PrivateRoutes>
                    },
                    {
                        path: "usuarios",
                        element: <PrivateRoutes><UsuariosConfigMain /></PrivateRoutes>
                    },
                    {
                        path: "create-user",
                        element: <Navigate to="/app/configuracion/usuarios" replace />
                    },
                    {
                        path: "abogados-manager",
                        element: <PrivateRoutes><AbogadosMain /></PrivateRoutes>
                    },
                    {
                        path: "plantillas",
                        element: <PrivateRoutes><PlantillasMain /></PrivateRoutes>
                    },
                    {
                        path: "user-mapping",
                        element: <Navigate to="/app/configuracion/usuarios?tab=enlazar" replace />
                    },
                    {
                        path: "usuarios-taxes",
                        element: <PrivateRoutes><TaxesUsuariosMain /></PrivateRoutes>
                    },
                    {
                        path: "tareas",
                        element: <PrivateRoutes><TareasMain /></PrivateRoutes>
                    },
                    {
                        path: "reservaciones",
                        element: <PrivateRoutes><ReservacionesMain /></PrivateRoutes>
                    }
                ]
            },
            {
                path: "sisgen",
                element: 
                <PrivateRoutes>
                    <SisgenMain />
                </PrivateRoutes>
            },
            {
                path: "registros-uif",
                element: (
                    <PrivateRoutes>
                        <RegistrosUifMain />
                    </PrivateRoutes>
                ),
            },
            {
                path: "archivos-pdt",
                element: (
                    <PrivateRoutes>
                        <ArchivosPdtMain />
                    </PrivateRoutes>
                ),
            },
            {
                path: "documentos",
                element: (
                    <PrivateRoutes>
                        <DocumentosMain />
                    </PrivateRoutes>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to="vehiculares" replace />,
                    },
                    {
                        path: "vehiculares",
                        element: (
                            <PrivateRoutes>
                                <DocumentosVehicularesMain />
                            </PrivateRoutes>
                        ),
                    },
                ],
            },
            ...taxesRoutes,
                ],
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default routes