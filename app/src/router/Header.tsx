import moment from 'moment'
import { daysInSpanish, monthsInSpanish } from '../utils/datesInSpanish'
import { useEffect, useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  ChevronDown,
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Send,
  Settings,
  Stamp,
  type LucideProps,
} from 'lucide-react'
import Logout from '../components/auth/Logout'
import ThemeToggle from '../components/ui/ThemeToggle'
import { Tipokardex } from '../services/api/tipokardexService'
import useBodyRenderStore from '../hooks/store/bodyRenderStore'
import useCorrelativeStore from '../hooks/store/useCorrelativeStore'
import getTitleCase from '../utils/getTitleCase'
import useKardexFiltersStore from '../hooks/store/useKardexFiltersStore'
import { Link, useLocation } from 'react-router-dom'
import useUserInfoStore from '../hooks/store/useGetUserInfo'
import { isFacturacionEnabled } from '../utils/isFacturacionEnabled'
import ComplianceMeReminder from '../components/api/kardex/kardexErrors/ComplianceMeReminder'
import useSidebarStore, {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '../hooks/store/useSidebarStore'

type NavIcon = ComponentType<LucideProps>

const SECTION_ICONS: Record<string, NavIcon> = {
  Protocolares: FileText,
  Extraprotocolares: Stamp,
  Reportes: BarChart3,
  Configuracion: Settings,
  Facturacion: Receipt,
}

const pathMatches = (currentPath: string, targetPath: string) => {
  if (!targetPath) return false
  if (currentPath === targetPath) return true
  return currentPath.startsWith(`${targetPath}/`)
}

const SECTION_PREFIX: Record<string, string> = {
  Protocolares: "/app/protocolares",
  Extraprotocolares: "/app/extraprotocolares",
  Reportes: "/app/reportes",
  Configuracion: "/app/configuracion",
  Facturacion: "/app/taxes",
}

const topLinkClass = (active: boolean, collapsed: boolean) =>
  `mb-2 flex w-full cursor-pointer items-center rounded-lg text-left text-xs font-bold tracking-wide transition ${
    collapsed ? "h-10 justify-center px-0 py-0" : "gap-2.5 px-3 py-2"
  } ${
    active
      ? "bg-sky-600/25 text-sky-200 ring-1 ring-sky-500/40"
      : "text-slate-200 hover:bg-slate-800 hover:text-white"
  }`

const sectionButtonClass = (active: boolean, open: boolean, collapsed: boolean) =>
  `flex w-full cursor-pointer items-center rounded-lg text-left text-xs font-bold tracking-wide transition ${
    collapsed ? "h-10 justify-center px-0 py-0" : "justify-between px-3 py-2"
  } ${
    active
      ? "bg-sky-600/20 text-sky-200 ring-1 ring-sky-500/35"
      : open
        ? "bg-slate-800/80 text-white"
        : "text-slate-200 hover:bg-slate-800 hover:text-white"
  }`

const childLinkClass = (active: boolean) =>
  `block w-full cursor-pointer rounded-md px-3 py-2 text-left text-xs transition ${
    active
      ? "bg-sky-600 text-white shadow-sm shadow-sky-900/40"
      : "text-slate-300 hover:bg-sky-700 hover:text-white"
  }`

const dropdownVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.22, ease: "easeInOut" as const },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: "easeOut" as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.035,
    },
  },
}

const optionVariants = {
  collapsed: { opacity: 0, x: -8 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: "easeOut" as const },
  },
}

const sidebarVariants = {
  hidden: { x: -28, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.08,
    },
  },
}

const sidebarSectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
}

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: "easeOut" as const },
  },
}

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

    const location = useLocation()
    const [openDropdown, setOpenDropdown] = useState<number | null>(0);
    const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
    const collapsed = useSidebarStore((s) => s.collapsed)
    const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed)
    const setCollapsed = useSidebarStore((s) => s.setCollapsed)
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

    const resolveOptionTo = (item: MenuItem, option: MenuOptions): string | null => {
      if (option.path) return option.path
      if (option.docType != null && item.label === 'Protocolares') {
        return `/app/protocolares?tipkar=${option.docType}`
      }
      return null
    }

    const isHrefActive = (href: string | null | undefined) => {
      if (!href) return false
      const [pathname, search = ""] = href.split("?")
      if (!pathMatches(location.pathname, pathname)) return false
      if (!search) return true
      const wanted = new URLSearchParams(search)
      const current = new URLSearchParams(location.search)
      for (const [key, value] of wanted.entries()) {
        if (current.get(key) !== value) return false
      }
      return true
    }

    const isOptionActive = (item: MenuItem, option: MenuOptions) => {
      const href = resolveOptionTo(item, option)
      if (isHrefActive(href)) return true
      if (option.subOptions?.some((sub) => isHrefActive(sub.path))) return true
      if (
        item.label === "Protocolares" &&
        option.docType != null &&
        location.pathname.startsWith("/app/protocolares")
      ) {
        const tipkar = new URLSearchParams(location.search).get("tipkar")
        return tipkar === String(option.docType)
      }
      return false
    }

    const isSectionActive = (item: MenuItem) => {
      const prefix = SECTION_PREFIX[item.label]
      if (prefix && pathMatches(location.pathname, prefix)) return true
      return item.options.some((option) => isOptionActive(item, option))
    }

    const handleNavLinkClick = (option: MenuOptions) => {
      resetNavigationState()
      if (option.docType != null) setBodyRender(option.docType)
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
                {name: "Reservaciones", path: "/app/configuracion/reservaciones"},
                {name: "Enlazar Usuarios", path: "/app/configuracion/user-mapping"},
                {name: "Usuarios Taxes", path: "/app/configuracion/usuarios-taxes"},
                {name: "Tareas", path: "/app/configuracion/tareas"},
            ]},
        { label: "Facturacion", options:
            
            [ 
              {name: "Personas", path: "/app/taxes/personas"},
              {name: "Catalogo", path: "/app/taxes/catalogo"},
              {name: "Control Interno", path: "/app/taxes/control-interno"},
              {name: "Boletas", path: "/app/taxes/boletas"},
              {name: "Facturas", path: "/app/taxes/facturas"},
              {name: "Créditos - Débitos", path: "/app/taxes/notas"},
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

    useEffect(() => {
      if (collapsed) {
        setOpenDropdown(null)
        setOpenSubDropdown(null)
        return
      }
      const activeIndex = menuItems.findIndex((item) => isSectionActive(item))
      if (activeIndex >= 0) {
        setOpenDropdown(activeIndex)
        const item = menuItems[activeIndex]
        const subIdx = item.options.findIndex(
          (option) =>
            Boolean(option.subOptions) &&
            (option.subOptions?.some((sub) => isHrefActive(sub.path)) || isHrefActive(option.path))
        )
        if (subIdx >= 0) {
          setOpenSubDropdown(`${activeIndex}-${subIdx}`)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- sync open section to route
    }, [location.pathname, location.search, collapsed])

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="keep-dark fixed left-0 top-0 z-40 h-screen overflow-hidden border-r border-slate-800 bg-slate-950 text-slate-100 shadow-2xl transition-[width] duration-300 ease-in-out"
      style={{ width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED }}
    >
      <div className="flex h-full flex-col">
        <motion.div
          variants={sidebarSectionVariants}
          className={`border-b border-slate-800 ${collapsed ? "p-2.5" : "p-4"}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.12 }}
            className={`flex items-center gap-2 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg ${
              collapsed ? "justify-center px-2 py-2.5" : "justify-center px-4 py-3"
            }`}
          >
            <motion.img
              src={notariaLogo}
              alt="Logo Notaria"
              className="h-8 w-8 rounded-md border border-amber-300/50 object-cover shadow-sm"
              loading="lazy"
              initial={{ rotate: -8, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.2 }}
            />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="notaria-meta"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-sky-300">Notaría</p>
                  <p className="text-base font-semibold leading-5 text-white">{notariaName}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="welcome-card"
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/95 px-4 py-3 shadow-lg">
                  <p className="text-[11px] text-slate-400">
                    {getTitleCase(currentDate)} {currentDay} de {getTitleCase(currentMonth)} del {currentYear}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">Bienvenido, {welcomeName}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            aria-pressed={collapsed}
            className={`mt-3 inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white ${
              collapsed ? "h-9 w-full" : "h-8 w-full gap-2 px-3 text-[11px] font-semibold tracking-wide"
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" aria-hidden />
            ) : (
              <>
                <PanelLeftClose className="h-3.5 w-3.5" aria-hidden />
                <span>Contraer menú</span>
              </>
            )}
          </button>
        </motion.div>

        <motion.div
          variants={sidebarSectionVariants}
          className={`flex-1 overflow-y-auto overflow-x-hidden py-3 ${collapsed ? "px-2" : "px-3"}`}
        >
          {!collapsed && <ComplianceMeReminder />}
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.045, delayChildren: 0.05 },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={navItemVariants}>
              <Link
                to="/app/panel-general"
                title="Panel General"
                className={topLinkClass(isHrefActive("/app/panel-general"), collapsed)}
                aria-current={isHrefActive("/app/panel-general") ? "page" : undefined}
                onClick={resetNavigationState}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                {!collapsed && <span>Panel General</span>}
              </Link>
            </motion.div>
            {Number(user?.is_superuser) !== 0 && (
              <motion.div variants={navItemVariants}>
                <Link
                  to="/app/sisgen"
                  title="Sisgen"
                  className={`${topLinkClass(isHrefActive("/app/sisgen"), collapsed)} mb-3`}
                  aria-current={isHrefActive("/app/sisgen") ? "page" : undefined}
                  onClick={resetNavigationState}
                >
                  <Send className="h-4 w-4 shrink-0" aria-hidden />
                  {!collapsed && <span>Sisgen</span>}
                </Link>
              </motion.div>
            )}
            {menuItems.map((item, index) => {
              const isOpen = openDropdown === index
              const sectionActive = isSectionActive(item)
              const SectionIcon = SECTION_ICONS[item.label] ?? FileText
              return (
              <motion.div key={item.label} variants={navItemVariants} className="mb-2">
                <button
                  type="button"
                  title={item.label}
                  onClick={() => {
                    if (collapsed) {
                      setCollapsed(false)
                      setOpenDropdown(index)
                      return
                    }
                    const next = isOpen ? null : index
                    setOpenDropdown(next)
                    if (next === null) setOpenSubDropdown(null)
                  }}
                  aria-expanded={isOpen}
                  aria-current={sectionActive ? "true" : undefined}
                  className={sectionButtonClass(sectionActive, isOpen, collapsed)}
                >
                  {collapsed ? (
                    <SectionIcon className="h-4 w-4 shrink-0" aria-hidden />
                  ) : (
                    <>
                      <span className="flex items-center gap-2.5">
                        <SectionIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                        <span>{item.label}</span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 0 : -90 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className={`inline-flex ${sectionActive ? "text-sky-300" : "text-slate-400"}`}
                      >
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                      </motion.span>
                    </>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {!collapsed && isOpen && (
                    <motion.ul
                      key={`${item.label}-options`}
                      variants={dropdownVariants}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      className="mt-1 space-y-1 overflow-hidden border-l border-slate-800 pl-2"
                    >
                      {item.options.map((option, idx) => {
                        const subKey = `${index}-${idx}`
                        const subOpen = openSubDropdown === subKey
                        const optionActive = isOptionActive(item, option)
                        const optionHref = resolveOptionTo(item, option)
                        return (
                          <motion.li
                            key={`${item.label}-${option.name}-${idx}`}
                            variants={optionVariants}
                          >
                            {option.subOptions ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenSubDropdown(subOpen ? null : subKey)
                                }
                                aria-expanded={subOpen}
                                className={childLinkClass(optionActive)}
                              >
                                <span className="flex w-full items-center justify-between gap-2">
                                  <span>{getTitleCase(option.name)}</span>
                                  <motion.span
                                    animate={{ rotate: subOpen ? 0 : -90 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className={`inline-flex ${optionActive ? "text-sky-100" : "text-slate-500"}`}
                                  >
                                    <ChevronDown className="h-3 w-3" aria-hidden />
                                  </motion.span>
                                </span>
                              </button>
                            ) : optionHref ? (
                              <Link
                                to={optionHref}
                                className={childLinkClass(optionActive)}
                                aria-current={optionActive ? "page" : undefined}
                                onClick={() => handleNavLinkClick(option)}
                              >
                                {getTitleCase(option.name)}
                              </Link>
                            ) : (
                              <span className="block rounded-md px-3 py-2 text-left text-xs text-slate-500">
                                {getTitleCase(option.name)}
                              </span>
                            )}
                            <AnimatePresence initial={false}>
                              {option.subOptions && subOpen && (
                                <motion.ul
                                  key={subKey}
                                  variants={dropdownVariants}
                                  initial="collapsed"
                                  animate="open"
                                  exit="collapsed"
                                  className="mt-1 space-y-1 overflow-hidden border-l border-slate-800 pl-3"
                                >
                                  {option.subOptions.map((subOption, subIdx) => {
                                    const subActive = isHrefActive(subOption.path)
                                    return (
                                    <motion.li
                                      key={`${subKey}-${subOption.name}-${subIdx}`}
                                      variants={optionVariants}
                                    >
                                      {subOption.path ? (
                                        <Link
                                          to={subOption.path}
                                          className={childLinkClass(subActive)}
                                          aria-current={subActive ? "page" : undefined}
                                          onClick={() => {
                                            resetNavigationState()
                                            if (option.docType != null) setBodyRender(option.docType)
                                          }}
                                        >
                                          {subOption.name}
                                        </Link>
                                      ) : (
                                        <span className="block rounded-md px-3 py-2 text-left text-xs text-slate-500">
                                          {subOption.name}
                                        </span>
                                      )}
                                    </motion.li>
                                    )
                                  })}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </motion.li>
                        )
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div
          variants={sidebarSectionVariants}
          className={`border-t border-slate-800 ${collapsed ? "p-2.5" : "p-4"}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
            className={`flex items-center rounded-xl border border-slate-800 bg-slate-900/95 ${
              collapsed
                ? "flex-col justify-center gap-2 px-1.5 py-2"
                : "justify-between px-3 py-2"
            }`}
          >
            <Logout iconOnly={collapsed} />
            <ThemeToggle className="border-slate-600 bg-slate-800 text-slate-100 hover:border-slate-400 hover:bg-slate-700" />
          </motion.div>
        </motion.div>
      </div>
    </motion.aside>
  )
}

export default Header