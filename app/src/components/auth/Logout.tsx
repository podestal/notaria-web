// import salir from '../../assets/icons/salir.png'
import useAuthStore from '../../store/useAuthStore'
import useUserInfoStore from '../../hooks/store/useGetUserInfo'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../../queryClient'

const Logout = () => {

    const clearTokens = useAuthStore(s => s.clearTokens)
    const setUser = useUserInfoStore(s => s.setUser)
    const navigate = useNavigate()

    const handleLogout = () => {
        clearTokens()
        setUser(null)
        queryClient.clear()
        navigate('/')
    }

  return (
    <button
        type="button"
        onClick={handleLogout}
        className='inline-flex items-center justify-center gap-2 cursor-pointer rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-700'
    >
        <span>Cerrar sesión</span>
        {/* <img src={salir} alt="Cerrar sesión" className='h-4 w-4 opacity-90' /> */}
    </button>
  )
}

export default Logout
