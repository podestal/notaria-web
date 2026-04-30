import { Navigate, Outlet } from "react-router-dom"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"

const ConfiguracionMain = () => {
  const user = useUserInfoStore((s) => s.user)
  const canAccessConfiguracion =
    Number(user?.is_superuser) !== 0 || Number(user?.is_staff) !== 0

  if (!canAccessConfiguracion) {
    return <Navigate to="/app/protocolares" replace />
  }

  return (
    <div className="w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg text-black">
        <Outlet />
    </div>
  )
}

export default ConfiguracionMain