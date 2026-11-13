import { Navigate } from "react-router-dom"
import ComingSoon from "../../../ui/ComingSoon"
import ReportPageShell from "../../../ui/ReportPageShell"
import ReportHeader from "../../../ui/ReportHeader"
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo"
import { userIsStaffOrSuperuser } from "../../../../utils/userIsStaffOrSuperuser"

const ReoporteUifMian = () => {
  const user = useUserInfoStore((s) => s.user)
  if (!userIsStaffOrSuperuser(user)) {
    return <Navigate to="/app/protocolares" replace />
  }

  return (
    <ReportPageShell>
      <ReportHeader
        title="Reporte UIF IAOC"
        subtitle="Informe de actividad de operaciones — próximamente"
      />
      <ComingSoon />
    </ReportPageShell>
  )
}

export default ReoporteUifMian