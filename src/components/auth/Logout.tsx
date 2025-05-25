import salir from '../../assets/icons/salir.png'
import useAuthStore from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

    const clearTokens = useAuthStore(s => s.clearTokens)
    const navigate = useNavigate()

    const handleLogout = () => {
        clearTokens()
        navigate('/login')
    }

  return (
    <div 
        onClick={handleLogout}
        className='flex justify-end items-center gap-2 cursor-pointer'>
        <p className='text-xs hover:text-gray-200 hover:underline'>Cerrar Sesión</p>
        <img src={salir} alt="" className='w-[23px] h-[23px] hover:opacity-80' />
    </div>
  )
}

export default Logout