import moment from 'moment'
import { daysInSpanish, monthsInSpanish } from '../utils/datesInSpanish'
import { useState } from 'react'
import Logout from '../components/auth/Logout'
import { Tipokardex } from '../services/api/tipokardexService'
import useBodyRenderStore from '../hooks/store/bodyRenderStore'
import useCorrelativeStore from '../hooks/store/useCorrelativeStore'
import getTitleCase from '../utils/getTitleCase'
import useKardexFiltersStore from '../hooks/store/useKardexFiltersStore'
import { Link } from 'react-router-dom'
import useUserInfoStore from '../hooks/store/useGetUserInfo'
import { isFacturacionEnabled } from '../utils/isFacturacionEnabled'

interface SubOption {
  name: string
  path?: string
}

interface MenuOptions {
    name: string;
    path?: string
    subOptions?: SubOption[]
    docType?: number
}

interface MenuItem {
    label: string
    options: MenuOptions[]
}

interface Props {
  kardexTypes: Tipokardex[]
}

const Header = ({ kardexTypes }: Props) => {

    const currentDate = daysInSpanish[moment().format('LLLL').split(' ')[0].split(',')[0].toLocaleLowerCase()]
    const currentDay = moment().format('DD')
    const currentMonth = monthsInSpanish[moment().format('MMMM').toLocaleLowerCase()]
    const currentYear = moment().format('YYYY')

    const [openDropdown, setOpenDropdown] = useState<number | null>(0);
    const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
    const user = useUserInfoStore( s => s.user)
    const notariaName = import.meta.env.VITE_NOTARIA_NAME || 'Sin nombre'
    const notariaLogoSlug = notariaName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
    const notariaLogo = `https://pub-298b15d30a4a4c8b8bfd457d07eef0ec.r2.dev/${notariaLogoSlug}/logo.jpeg`
    const welcomeName = user?.username || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Usuario'

    const setBodyRender = useBodyRenderStore((state) => state.setBodyRender)

    // reinitilizes correlative
    const setCorrelative = useCorrelativeStore(s => s.setCorrelative)

    const setKardexFilter = useKardexFiltersStore(s => s.setKardexFilter)

    const resetNavigationState = () => {
      setCorrelative('')
      setKardexFilter({ type: '', value: '' })
    }

    const navLinkClass =
      'block w-full rounded-md px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-sky-700 hover:text-white'

    const resolveOptionTo = (item: MenuItem, option: MenuOptions): string | null => {
      if (option.path) return option.path
      if (option.docType && item.label === 'Protocolares') {
        return `/app/protocolares?tipkar=${option.docType}`
      }
      return null
    }

    const handleNavLinkClick = (option: MenuOptions) => {
      resetNavigationState()
      if (option.docType) setBodyRender(option.docType)
    }

    const menuItems: MenuItem[] = [
      { label: "Protocolares", options: 
          [
            ...kardexTypes?.map((kardexType) => ({ name: kardexType.nomtipkar, docType: kardexType.idtipkar })),
            { name: "Protestos" }
          ],
      },
        { label: "Extraprotocolares", options: 
            [   
              // {name: "Certificación de Firmas", path: "/app/extraprotocolares/certificacionFirmas"},
                {name: "Cert. Autorización de viaje", path: "/app/extraprotocolares/permisosViaje"},
                {name: "Poderes Fuera de Registro", path: "/app/extraprotocolares/poderesFueraDeRegistro"},
                {name: "Cartas Notariales", path: "/app/extraprotocolares/cartaNotarial"},
                {name: "Cert. Apertura de Libros", path: "/app/extraprotocolares/aperturaLibros"},
                {name: "Cert. Supervivencia Persona Capaz", path: "/app/extraprotocolares/supervivenciaCapaz"},
                {name: "Cert. Supervivencia Persona Incapaz", path: "/app/extraprotocolares/supervivenciaIncapaz"},
                {name: "Certificado Domiciliario", path: "/app/extraprotocolares/certificadoDomiciliario"},
                {name: "Cambio de Características", path: "/app/extraprotocolares/cambioCaracteristicas"},
                {name: "Busqueda Avanzada", path: "/app/extraprotocolares/busquedaAvanzada"}
            ]},
        { label: "Reportes", options: 
            [   {name: "Indices Cronologicos", 
                  path: "/app/reportes/cronologicos",
                  subOptions: [
                    {name: "Escrituras Públicas", path: "/app/reportes/cronologicos/escrituras"}, 
                    {name: "Asunotos No Contenciosos", path: "/app/reportes/cronologicos/no-contenciosos"}, 
                    {name: "Transferencias Vehiculares", path: "/app/reportes/cronologicos/transferencias-vehiculares"}, 
                    {name: "Garantías Mobiliarias", path: "/app/reportes/cronologicos/garantias-mobiliarias"}, 
                    {name: "Testamentos", path: "/app/reportes/cronologicos/testamentos"}, 
                    {name: "Protestos", path: "/app/reportes/cronologicos/protestos"}, 
                    {name: "Generar Actas Protesto", path: "/app/reportes/cronologicos/generar-actas-protesto"}, 
                    {name: "Informe a la Cámara de Comercio", path: "/app/reportes/cronologicos/informe-camara-comercio"}, 
                    {name: "Cartas Notariales", path: "/app/reportes/cronologicos/cartas-notariales"},
                    {name: "Certificación de Apertura de Libros", path: "/app/reportes/cronologicos/certificacion-apertura-libros"},
                    {name: "Permisos de Viaje al Interior/Exterior", path: "/app/reportes/cronologicos/permisos-viaje"},
                    {name: "Poderes Fuera de Registro", path: "/app/reportes/cronologicos/poderes-fuera-registro"},
                    {name: "Cart. Supervivencia Persona Capaz", path: "/app/reportes/cronologicos/cart-supervivencia-persona-capaz"},
                    {name: "Cart. Supervivencia Persona Incapaz", path: "/app/reportes/cronologicos/cart-supervivencia-persona-incapaz"},
                    {name: "Certificado Domiciliario", path: "/app/reportes/cronologicos/certificado-domiciliario"},
                  ]},
                {name: "Indices Alfabeticos", 
                  path: "/app/reportes/alfabeticos",
                  subOptions: [
                    {name: "Escrituras Públicas", path: "/app/reportes/alfabeticos/escrituras"}, 
                    {name: "Garantías Mobiliarias", path: "/app/reportes/alfabeticos/garantias-mobiliarias"}, 
                    {name: "Asuntos no Contenciosos", path: "/app/reportes/alfabeticos/no-contenciosos"}, 
                    {name: "Transferencias Vehiculares", path: "/app/reportes/alfabeticos/transferencias-vehiculares"}, 
                    {name: "Testamentos", path: "/app/reportes/alfabeticos/testamentos"}
                  ]},
                {name: "Archivos PDT Notaría", 
                  path: "/app/reportes/archivos-pdt",
                  subOptions: [
                    {name: "Archivos PDT Escrituras", path: "/app/reportes/archivos-pdt/escrituras"}, 
                    {name: "Archivos PDT Garantías", path: "/app/reportes/archivos-pdt/garantias"}, 
                    {name: "Archivos PDT Vehiculares", path: "/app/reportes/archivos-pdt/vehiculares"}, 
                    {name: "Archivos PDT Libros", path: "/app/reportes/archivos-pdt/libros"}
                  ]},
                {name: "Registro de Operaciones UIF",
                  path: "/app/reportes/registros-uif",
                  },
                {name: "Reporte UIF-IAOC", 
                  path: "/app/reportes/reporte-uif-iaoc",
                },
                {name: "Report.Pend.Conclusión Firma", 
                  path: "/app/reportes/reporte-pendiente-conclusion-firma",
                },
                {name: "Busqueda Avanzada", 
                  path: "/app/reportes/busqueda-avanzada",
                },
                {name: "Reporte Correlativo de Documentos", 
                  path: "/app/reportes/correlativo",
                },
                {name: "Indices Cronológicos 2013 - 2020", 
                  path: "/app/reportes/cronologicos-pasado",
                },
            ]},
        // { label: "Caja", options:
        //     [   {name: "Egresos", 
        //           subOptions: [
        //             {name: "Generar Egresos", path: "/app/caja/generar-egresos"}, 
        //             {name: "Edición de Egresos", path: "/app/caja/edicion-egresos"}, 
        //             {name: "Reporte de Egresos", path: "/app/caja/reporte-egresos"}
        //           ]},
        //         {name: "Emisión de Comprobantes"},
        //         {name: "Edición de Comprobantes"},
        //         {name: "Cancelación de Comprobantes"},
        //         {name: "Reporte de Comprobantes Emitidos"},
        //         {name: "Reporte de Comprobantes" ,subOptions: [
        //             {name: "Pendiente de Pago", path: "/app/caja/pendiente-pago"}, 
        //             {name: "Cancelados", path: "/app/caja/cancelados"}
        //           ]}
        //     ]},
        // { label: "Usuarios", options:
        //     [   {name: "Mantenimiento"},
        //         {name: "Permisos"}
        //     ]},
        // { label: "Herramientas", options:
        //     [   {name: "Tipos de Acto"},    
        //         {name: "Mantenimiento de Abogados"},
        //         {name: "Mantenimiento de Presentante"},
        //         {name: "Gestor de Planillas"},
        //         {name: "Mantenimiento de Condiciones"},
        //         {name: "Mantenimiento de Clientes"},
        //         {name: "Mantenimiento de Impedidos"},
        //         {name: "Mantenimiento de Sellos de Cartas"},
        //         {name: "Mantenimiento de Ayuda de Protestos"},
        //         {name: "Mant.de Contenido Poderes"},
        //         {name: "Mantenimiento de Servicios"},
        //         {name: "Asignación de Kardex"},
        //         {name: "Asignación de Viajes"},
        //         {name: "Asignación de Poderes"},
        //         {name: "Asignación de Cartas Notariales"},
        //         {name: "Asignación de Libros"},
        //         {name: "Asignación de Certif. de Supervivencia"},
        //         {name: "Asignación de Certificado Domiciliario"},
        //         {name: "Asignación de Cambio de Caracteris."},
        //         {name: "Tipo de Cambio"},
        //         {name: "Series Iniciales"}
        //     ]},
        { label: "Configuracion", options:
            [   {name: "Datos del Notario", path: "/app/configuracion/configuracion-notario"},
                // {name: "Edición de Datos"},
                // {name: "Registrar Servidor"},
                // {name: "Editar Servidor"},
                // {name: "Backup Servidor"},
                // {name: "Configurar SISNOT"},
                // {name: "Activar Errores Usuarios"},
                {name: "Acto Condicion", path: "/app/configuracion/acto-condicion"},
                {name: "Crear Usuario", path: "/app/configuracion/create-user"},
                {name: "Abogados Manager", path: "/app/configuracion/abogados-manager"},
                {name: "Plantillas", path: "/app/configuracion/plantillas"},
                {name: "Enlazar Usuarios", path: "/app/configuracion/user-mapping"},
            ]},
        { label: "Sisgen", options:
            [   {name: "SISGEN", path: "/app/sisgen"}
            ]},
        { label: "Facturacion", options:
            
            [ 
              {name: "Personas", path: "/app/taxes/personas"},
              {name: "Catalogo", path: "/app/taxes/catalogo"},
              {name: "Control Interno", path: "/app/taxes/control-interno"},
              {name: "Boletas", path: "/app/taxes/boletas"},
              {name: "Facturas", path: "/app/taxes/facturas"},
              {name: "Notas de credito", path: "/app/taxes/notas-credito"},
              {name: "Notas de debito", path: "/app/taxes/notas-debito"},
              {name: "Resumenes", path: "/app/taxes/resumenes"},
            ]},
    //   { label: "EXTRAPROTOCOLARES", options: ["Calificacíon de Firmas", "Cert. Autorización de viaje", "Poderes Fuera de Registro", "Cartas Notariales", "Cert. Apertura de Libros", "Cert. Supervivencia Persona Capaz", "Cert. Supervivencia Persona Incapaz", "Certificado Domiciliario", "Cambio de Características", "Busqueda Avanzada"] },
    //   { label: "REPORTES", options: ["Indices Cronologicos", "Indices Alfabeticos", "Archivos PDT Notaría", "Registro de Operaciones UIF", "Reporte UIF-IAOC", "Report.Pend.Conclusión Firma", "Busqueda Avanzada", "Reporte Correlativo de Documentos", "Indices Cronológicos 2013 - 2020"] },
    //   { label: "CAJA", options: ["Egresos", "Emisión de Comprobantes", "Edición de Comprobantes", "Cancelación de Comprobantes", "Reporte de Comprobantes Emitidos", "Reporte de Comprobantes"] },
    //   { label: "USUARIOS", options: ["Mantenimiento", "Permisos"] },
    //   { label: "HERRAMIENTAS", options: ["Tipos de Acto", "Mantenimiento de Abogados", "Mantenimiento de Presentante", "Gestor de Planillas", "Mantenimiento de Condiciones", "Mantenimiento de Clientes", "Mantenimiento de Impedidos", "Mantenimiento de Sellos de Cartas", "Mantenimiento de Ayuda de Protestos", "Mant.de Contenido Poderes", "Mantenimiento de Servicios", "Asignación de Kardex", "Asignación de Viajes", "Asignación de Poderes", "Asignación de Cartas Notariales", "Asignación de Libros", "Asignación de Certif. de Supervivencia", "Asignación de Certificado Domiciliario", "Asignación de Cambio de Caracteris.", "Tipo de Cambio", "Series Iniciales"] },
    //   { label: "CONFIGURACION", options: ["Datos del Notario", "Edición de Datos", "Registrar Servidor", "Editar Servidor", "Backup Servidor", "Configurar SISNOT", "Activar Errores Usuarios"] },
    ].filter((item) => {
      if (item.label === "Configuracion") {
        return Number(user?.is_superuser) !== 0 || Number(user?.is_staff) !== 0;
      }
      if (item.label === "Sisgen") {
        return Number(user?.is_superuser) !== 0;
      }
      if (item.label === "Facturacion") {
        return isFacturacionEnabled();
      }
      return true;
    }).map((item) => {
      if (item.label !== "Configuracion") return item;
      const isSuperuser = Number(user?.is_superuser) !== 0;
      return {
        ...item,
        options: item.options.filter(
          (opt) =>
            opt.path !== "/app/configuracion/user-mapping" || isSuperuser,
        ),
      };
    });


  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 p-4">
          <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 shadow-lg flex items-center gap-2 justify-center">
            <img
              src={notariaLogo}
              alt="Logo Notaria"
              className="mb-2 h-8 w-8 rounded-md border border-amber-300/50 object-cover shadow-sm"
              loading="lazy"
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-sky-300">Notaría</p>
              <p className="text-base font-semibold leading-5 text-white">{notariaName}</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/95 px-4 py-3 shadow-lg">
            <p className="text-[11px] text-slate-400">
              {getTitleCase(currentDate)} {currentDay} de {getTitleCase(currentMonth)} del {currentYear}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">Bienvenido, {welcomeName}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {menuItems.map((item, index) => (
            <div key={item.label} className="mb-2">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold tracking-wide text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <span>{item.label}</span>
                <span className="text-[10px]">{openDropdown === index ? '▼' : '▶'}</span>
              </button>

              {openDropdown === index && (
                <ul className="mt-1 space-y-1 border-l border-slate-800 pl-2">
                  {item.options.map((option, idx) => {
                    const subKey = `${index}-${idx}`
                    return (
                      <li key={`${item.label}-${option.name}-${idx}`}>
                        {option.subOptions ? (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenSubDropdown(openSubDropdown === subKey ? null : subKey)
                            }
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-sky-700 hover:text-white"
                          >
                            <span>{getTitleCase(option.name)}</span>
                            <span className="text-[10px]">
                              {openSubDropdown === subKey ? '▼' : '▶'}
                            </span>
                          </button>
                        ) : resolveOptionTo(item, option) ? (
                          <Link
                            to={resolveOptionTo(item, option)!}
                            className={navLinkClass}
                            onClick={() => handleNavLinkClick(option)}
                          >
                            {getTitleCase(option.name)}
                          </Link>
                        ) : (
                          <span className="block rounded-md px-3 py-2 text-left text-xs text-slate-500">
                            {getTitleCase(option.name)}
                          </span>
                        )}
                        {option.subOptions && openSubDropdown === subKey && (
                          <ul className="mt-1 space-y-1 border-l border-slate-800 pl-3">
                            {option.subOptions.map((subOption, subIdx) => (
                              <li key={`${subKey}-${subOption.name}-${subIdx}`}>
                                {subOption.path ? (
                                  <Link
                                    to={subOption.path}
                                    className={navLinkClass}
                                    onClick={() => {
                                      resetNavigationState()
                                      if (option.docType) setBodyRender(option.docType)
                                    }}
                                  >
                                    {subOption.name}
                                  </Link>
                                ) : (
                                  <span className="block rounded-md px-3 py-2 text-left text-xs text-slate-500">
                                    {subOption.name}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/95 px-3 py-2">
            <Logout />
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Header