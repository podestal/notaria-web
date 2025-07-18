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

interface MenuOptions {
    name: string;
    subOptions?: string[]
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
            [   {name: "Calificacíon de Firmas"},
                {name: "Cert. Autorización de viaje"},
                {name: "Poderes Fuera de Registro"},
                {name: "Cartas Notariales"},
                {name: "Cert. Apertura de Libros"},
                {name: "Cert. Supervivencia Persona Capaz"},
                {name: "Cert. Supervivencia Persona Incapaz"},
                {name: "Certificado Domiciliario"},
                {name: "Cambio de Características"},
                {name: "Busqueda Avanzada"}
            ]},
        { label: "REPORTES", options: 
            [   {name: "Indices Cronologicos", subOptions: ["Escrituras Públicas", "Asunotos No Contenciosos", "Transferencias Vehiculares", "Garantías Mobiliarias", "Testamentos", "Protestos", "Generar Actas Protesto", "Informe a la Cámara de Comercio", "Cartas Notariales", "Certificación de Apertura de Libros", " Permisos de Viaje al Interior/Exterior", "Poderes Fuera de Registro", "Cart. Supervivencia Persona Capaz", "Cart. Supervivencia Persona Incapaz", "Certificado Domiciliario"]},
                {name: "Indices Alfabeticos", subOptions: ["Escrituras Públicas", "Garantías Mobiliarias", "Asuntos no Contenciosos", "Transferencias Vehiculares", "Testamentos"]},
                {name: "Archivos PDT Notaría", subOptions: ["Archivos PDT Escrituras", "Archivos PDT Garantías", "Archivos PDT Vehiculares", "Archivos PDT Libros"]},
                {name: "Registro de Operaciones UIF"},
                {name: "Reporte UIF-IAOC"},
                {name: "Report.Pend.Conclusión Firma"},
                {name: "Busqueda Avanzada"},
                {name: "Reporte Correlativo de Documentos"},
                {name: "Indices Cronológicos 2013 - 2020"}
            ]},
        { label: "CAJA", options:
            [   {name: "Egresos", subOptions: ["Generar Egresos", "Edición de Egresos", "Reporte de Egresos"]},
                {name: "Emisión de Comprobantes"},
                {name: "Edición de Comprobantes"},
                {name: "Cancelación de Comprobantes"},
                {name: "Reporte de Comprobantes Emitidos"},
                {name: "Reporte de Comprobantes" ,subOptions: ["Pendiente de Pago", "Cancelados"]}
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
              onClick={() => navigate(`/app/${item.label.toLowerCase()}`)}
            >
              {/* Main Item */}
              <li className="cursor-pointer hover:text-slate-50 px-4 py-2">
                {item.label}
              </li>

              {/* Dropdown Menu */}
              {openDropdown === index && (
                <div className="absolute left-0 w-60 bg-gradient-to-b from-neutral-600 to-gray-950 text-neutral-400 rounded-md shadow-lg">
                  <ul>
                    {item.options.map((option, idx) => (
                    <div
                        key={idx}
                        className="relative"
                        onMouseEnter={() => option.subOptions && setOpenSubDropdown(idx)}
                        onMouseLeave={() => setOpenSubDropdown(null)}
                        onClick={() => {
                          navigate(`/app/${item.label.toLowerCase()}`)
                          setCorrelative('')
                          option.docType && setBodyRender(option.docType)
                          setKardexFilter({
                            type: '',
                            value: ''
                        })
                          console.log('option.docType', option)}}
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
                                >
                                  {subOption}
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