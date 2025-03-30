import headerImg from '../assets/imgs/header.png'
import notariaLogo from '../assets/imgs/logo-notaria-rodriguez-zea-juliaca-2.png'
import usuario from '../assets/icons/usuario.png'
import llave from '../assets/icons/llave.png'
import salir from '../assets/icons/salir.png'
import moment from 'moment'
import { daysInSpanish, monthsInSpanish } from '../utils/datesInSpanish'
import house from '../assets/icons/casa.png'
import people from '../assets/icons/people.ico'



const Header = () => {

    const currentDate = daysInSpanish[moment().format('LLLL').split(' ')[0].split(',')[0].toLocaleLowerCase()]
    const currentDay = moment().format('DD')
    const currentMonth = monthsInSpanish[moment().format('MMMM').toLocaleLowerCase()]
    const currentYear = moment().format('YYYY')


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
            <div className='flex justify-end items-center gap-2 cursor-pointer'>
                <p className='text-xs hover:text-gray-200 hover:underline'>Cerrar Sesión</p>
                <img src={salir} alt="" className='w-[23px] h-[23px] hover:opacity-80' />
            </div>
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
    </div>
  )
}

export default Header