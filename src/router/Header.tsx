import headerImg from '../assets/imgs/header.png'
import notariaLogo from '../assets/imgs/logo-notaria-rodriguez-zea-juliaca-2.png'
import usuario from '../assets/icons/usuario.png'
import llave from '../assets/icons/llave.png'
import salir from '../assets/icons/salir.png'

const Header = () => {
  return (
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
                <p className='text-xs mb-1'>Cambiar Contraseña</p>
                <img src={llave} alt="" className='w-[23px] h-[23px]' />
            </div>
            <div className='flex justify-end items-center gap-2 hover:opacity-80 cursor-pointer'>
                <p className='text-xs'>Cerrar Sesión</p>
                <img src={salir} alt="" className='w-[23px] h-[23px]' />
            </div>
        </div>
    </div>
  )
}

export default Header