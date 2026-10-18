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
    <div className="mx-auto mb-10 mt-4 w-[92%] max-w-[1400px] text-slate-800">
      <Outlet />
    </div>
  )
}

export default ConfiguracionMain
