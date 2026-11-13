import { Navigate, Outlet } from "react-router-dom"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"
import { userIsStaffOrSuperuser } from "../../../utils/userIsStaffOrSuperuser"

const ConfiguracionMain = () => {
  const user = useUserInfoStore((s) => s.user)

  if (!userIsStaffOrSuperuser(user)) {
    return <Navigate to="/app/protocolares" replace />
  }

  return (
    <div className="mx-auto mb-10 mt-4 w-[92%] max-w-[1400px] text-slate-800">
      <Outlet />
    </div>
  )
}

export default ConfiguracionMain
