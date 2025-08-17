import headerImg from '../assets/imgs/header.png'
import notariaLogo from '../assets/imgs/logo-notaria-rodriguez-zea-juliaca-2.png'
import usuario from '../assets/icons/usuario.png'
import llave from '../assets/icons/llave.png'
import moment from 'moment'
import { daysInSpanish, monthsInSpanish } from '../utils/datesInSpanish'
import house from '../assets/icons/casa.png'
import people from '../assets/icons/people.ico'
import { useState } from 'react'
import Logout from '../components/auth/Logout'
import { Tipokardex } from '../services/api/tipokardexService'
import useBodyRenderStore from '../hooks/store/bodyRenderStore'
import useCorrelativeStore from '../hooks/store/useCorrelativeStore'
import getTitleCase from '../utils/getTitleCase'
import useKardexFiltersStore from '../hooks/store/useKardexFiltersStore'
import { useNavigate } from 'react-router-dom'
import useUserInfoStore from '../hooks/store/useGetUserInfo'

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

    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [openSubDropdown, setOpenSubDropdown] = useState<number | null>(null);
    const user = useUserInfoStore( s => s.user)

    const navigate = useNavigate()

    const setBodyRender = useBodyRenderStore((state) => state.setBodyRender)

    // reinitilizes correlative
    const setCorrelative = useCorrelativeStore(s => s.setCorrelative)

    const setKardexFilter = useKardexFiltersStore(s => s.setKardexFilter)

    const menuItems: MenuItem[] = [
      { label: "PROTOCOLARES", options: 
          [
            ...kardexTypes?.map((kardexType) => ({ name: kardexType.nomtipkar, docType: kardexType.idtipkar })),
            { name: "Protestos" }
          ],
      },
        { label: "EXTRAPROTOCOLARES", options: 
            [   {name: "Certificación de Firmas", path: "/app/extraprotocolares/certificacionFirmas"},
                {name: "Cert. Autorización de viaje", path: "/app/extraprotocolares/permisosViaje"},
                {name: "Poderes Fuera de Registro", path: "/app/extraprotocolares/poderesFueraDeRegistro"},
                {name: "Cartas Notariales", path: "/app/extraprotocolares/cartaNotarial"},
                {name: "Cert. Apertura de Libros", path: "/app/extraprotocolares/aperturaLibros"},
                {name: "Cert. Supervivencia Persona Capaz", path: "/app/extraprotocolares/supervivenciaCapaz"},
                {name: "Cert. Supervivencia Persona Incapaz", path: "/app/extraprotocolares/supervivenciaIncapaz"},
                {name: "Certificado Domiciliario", path: "/app/extraprotocolares/certificadoDomiciliario"},
                {name: "Cambio de Características", path: "/app/extraprotocolares/cambioCaracteristicas"},
                {name: "Busqueda Avanzada"}
            ]},
        { label: "REPORTES", options: 
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
        { label: "CAJA", options:
            [   {name: "Egresos", 
                  subOptions: [
                    {name: "Generar Egresos", path: "/app/caja/generar-egresos"}, 
                    {name: "Edición de Egresos", path: "/app/caja/edicion-egresos"}, 
                    {name: "Reporte de Egresos", path: "/app/caja/reporte-egresos"}
                  ]},
                {name: "Emisión de Comprobantes"},
                {name: "Edición de Comprobantes"},
                {name: "Cancelación de Comprobantes"},
                {name: "Reporte de Comprobantes Emitidos"},
                {name: "Reporte de Comprobantes" ,subOptions: [
                    {name: "Pendiente de Pago", path: "/app/caja/pendiente-pago"}, 
                    {name: "Cancelados", path: "/app/caja/cancelados"}
                  ]}
            ]},
        { label: "USUARIOS", options:
            [   {name: "Mantenimiento"},
                {name: "Permisos"}
            ]},
        { label: "HERRAMIENTAS", options:
            [   {name: "Tipos de Acto"},    
                {name: "Mantenimiento de Abogados"},
                {name: "Mantenimiento de Presentante"},
                {name: "Gestor de Planillas"},
                {name: "Mantenimiento de Condiciones"},
                {name: "Mantenimiento de Clientes"},
                {name: "Mantenimiento de Impedidos"},
                {name: "Mantenimiento de Sellos de Cartas"},
                {name: "Mantenimiento de Ayuda de Protestos"},
                {name: "Mant.de Contenido Poderes"},
                {name: "Mantenimiento de Servicios"},
                {name: "Asignación de Kardex"},
                {name: "Asignación de Viajes"},
                {name: "Asignación de Poderes"},
                {name: "Asignación de Cartas Notariales"},
                {name: "Asignación de Libros"},
                {name: "Asignación de Certif. de Supervivencia"},
                {name: "Asignación de Certificado Domiciliario"},
                {name: "Asignación de Cambio de Caracteris."},
                {name: "Tipo de Cambio"},
                {name: "Series Iniciales"}
            ]},
        { label: "CONFIGURACION", options:
            [   {name: "Datos del Notario"},
                {name: "Edición de Datos"},
                {name: "Registrar Servidor"},
                {name: "Editar Servidor"},
                {name: "Backup Servidor"},
                {name: "Configurar SISNOT"},
                {name: "Activar Errores Usuarios"}
            ]},
        
    //   { label: "EXTRAPROTOCOLARES", options: ["Calificacíon de Firmas", "Cert. Autorización de viaje", "Poderes Fuera de Registro", "Cartas Notariales", "Cert. Apertura de Libros", "Cert. Supervivencia Persona Capaz", "Cert. Supervivencia Persona Incapaz", "Certificado Domiciliario", "Cambio de Características", "Busqueda Avanzada"] },
    //   { label: "REPORTES", options: ["Indices Cronologicos", "Indices Alfabeticos", "Archivos PDT Notaría", "Registro de Operaciones UIF", "Reporte UIF-IAOC", "Report.Pend.Conclusión Firma", "Busqueda Avanzada", "Reporte Correlativo de Documentos", "Indices Cronológicos 2013 - 2020"] },
    //   { label: "CAJA", options: ["Egresos", "Emisión de Comprobantes", "Edición de Comprobantes", "Cancelación de Comprobantes", "Reporte de Comprobantes Emitidos", "Reporte de Comprobantes"] },
    //   { label: "USUARIOS", options: ["Mantenimiento", "Permisos"] },
    //   { label: "HERRAMIENTAS", options: ["Tipos de Acto", "Mantenimiento de Abogados", "Mantenimiento de Presentante", "Gestor de Planillas", "Mantenimiento de Condiciones", "Mantenimiento de Clientes", "Mantenimiento de Impedidos", "Mantenimiento de Sellos de Cartas", "Mantenimiento de Ayuda de Protestos", "Mant.de Contenido Poderes", "Mantenimiento de Servicios", "Asignación de Kardex", "Asignación de Viajes", "Asignación de Poderes", "Asignación de Cartas Notariales", "Asignación de Libros", "Asignación de Certif. de Supervivencia", "Asignación de Certificado Domiciliario", "Asignación de Cambio de Caracteris.", "Tipo de Cambio", "Series Iniciales"] },
    //   { label: "CONFIGURACION", options: ["Datos del Notario", "Edición de Datos", "Registrar Servidor", "Editar Servidor", "Backup Servidor", "Configurar SISNOT", "Activar Errores Usuarios"] },
    ];


  return (
    <div>
      <>{console.log('user', user)
      }</>
    <div className='grid grid-cols-9 h-[138px] bg-black'>
        <div className='w-full h-full flex items-center justify-center col-span-2'>
            <img src={notariaLogo} alt="" className='col-span-2 w-[280px]' />
        </div>
        <div className='col-span-5 flex items-center justify-center'>
            <img src={headerImg} alt="" className='w-[727px]' />
        </div>
        <div className='text-white mt-4 mr-4 text-right'>
            <p className='italic text-lg mb-2'>Bienvenido..!</p>
            <div className='flex justify-end items-center gap-2'>
                <p className='text-sm mb-2'>Usuario</p>
                <img src={usuario} alt="" className='w-[27px] h-[27px] mb-2' />
            </div>
            <div className='flex justify-end items-center gap-2 hover:opacity-80 cursor-pointer'>
                <p className='text-xs mb-1 hover:text-yellow-400 hover:underlin'>Cambiar Contraseña</p>
                <img src={llave} alt="" className='w-[23px] h-[23px]' />
            </div>
            <Logout />
        </div>
    </div>
    <div className='w-full  bg-gradient-to-b from-sky-950 to-slate-950 py-2'>
        <ul className='w-[60%] px-6 flex justify-between items-center mx-auto text-amber-500'>
            <li className='italic'>Colegio de Notarios de Lima</li>
            <div className='flex justify-center items-center gap-2 hover:opacity-80 cursor-pointer'>
                <img src={house} className='w-[22px]' alt="" />
                <li className='underline italic'>Predios</li>
            </div>
            <div className='flex justify-center items-center gap-2 hover:opacity-80 cursor-pointer'>
                <img src={people} className='w-[22px]' alt="" />
                <li className='underline italic'>NOTARIA</li>
            </div>
            
            <li className='underline italic hover:opacity-80 cursor-pointer'>Mis Errores PDT</li>
            <li className='text-sm text-slate-50'>{currentDate}, {currentDay} de {currentMonth} del {currentYear}</li>
        </ul>
    </div>
    <div className="h-[35px] bg-slate-950 w-full">
      <ul className="w-[65%] px-8 pt-4 text-neutral-400 text-xs font-semibold mx-auto bg-gradient-to-b from-neutral-600 to-gray-950 h-[90px] rounded-full">
        <div className="flex justify-between items-center w-full">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setOpenDropdown(index)}
              onMouseLeave={() => setOpenDropdown(null)}
              // onClick={() => navigate(`/app/${item.label.toLowerCase()}`)}
            >
              {/* Main Item */}
              <li className="cursor-pointer hover:text-slate-50 px-4 py-2">
                {item.label}
              </li>

              {/* Dropdown Menu */}
              {openDropdown === index && (
                <div className="absolute z-100 left-0 w-60 bg-gradient-to-b from-neutral-600 to-gray-950 text-neutral-400 rounded-md shadow-lg">
                  <ul>
                    {item.options.map((option, idx) => (
                    <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => option.subOptions && setOpenSubDropdown(idx)}
                        onMouseLeave={() => setOpenSubDropdown(null)}
                        onClick={() => {
                          console.log('option', option)
                          navigate(`/app/${item.label.toLowerCase()}`)
                          setCorrelative('')
                          option.docType && setBodyRender(option.docType)
                          option.path && navigate(option.path)
                          setKardexFilter({
                            type: '',
                            value: ''
                        })
                          }}
                      >
                        <li className="px-4 py-2 hover:bg-sky-500 hover:text-slate-50 cursor-pointer w-full border-b border-neutral-600 flex justify-between">
                          {getTitleCase(option.name)}
                          {option.subOptions && <span>▶</span>}
                        </li>

                        {/* Third Layer Dropdown */}
                        {openSubDropdown === idx && option.subOptions && (
                          <div className="absolute left-full top-0 w-40 bg-gradient-to-b from-neutral-600 to-gray-950 text-neutral-400 rounded-md shadow-lg">
                            <ul>
                              {option.subOptions.map((subOption, subIdx) => (
                                <li
                                  key={subIdx}
                                  className="px-4 py-2 hover:bg-sky-500 hover:text-slate-50 cursor-pointer w-full border-b border-neutral-600"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('subOption', subOption)
                                    navigate(`${subOption.path}`)
                                    setCorrelative('')
                                    option.docType && setBodyRender(option.docType)
                                    setKardexFilter({
                                      type: '',
                                      value: ''
                                    })
                                  }}
                                >
                                  {subOption.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SISGEN - No Dropdown */}
        <li className="cursor-pointer hover:text-slate-50 mt-3 px-4" onClick={() => navigate(`/app/sisgen`)}>SISGEN</li>
      </ul>
    </div>


    </div>
  )
}

export default Header