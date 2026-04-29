import { Navigate, Outlet } from "react-router-dom"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"

const ConfiguracionMain = () => {
  const user = useUserInfoStore((s) => s.user)
  const isSuperuser = Number(user?.is_superuser) !== 0

  if (!isSuperuser) {
    return <Navigate to="/app/protocolares" replace />
  }

  return (
    <div className="w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg text-black">
        <Outlet />
    </div>
  )
}

export default ConfiguracionMain