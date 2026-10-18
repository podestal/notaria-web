import { LogOut } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import useUserInfoStore from '../../hooks/store/useGetUserInfo'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../../queryClient'

interface Props {
    iconOnly?: boolean
}

const Logout = ({ iconOnly = false }: Props) => {
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
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-600 bg-slate-800 text-xs font-semibold text-slate-100 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-700 ${
            iconOnly ? 'h-9 w-9 px-0' : 'px-3 py-1.5'
        }`}
    >
        {iconOnly ? <LogOut className="h-4 w-4" aria-hidden /> : <span>Cerrar sesión</span>}
    </button>
  )
}

export default Logout
