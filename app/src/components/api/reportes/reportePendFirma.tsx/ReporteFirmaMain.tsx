import ComingSoon from "../../../ui/ComingSoon"

import ReportPageShell from "../../../ui/ReportPageShell"
import ReportHeader from "../../../ui/ReportHeader"
const ReporteFirmaMain = () => {
  return (
    <ReportPageShell>
      <ReportHeader title="Pendiente de conclusión / firma" />
        <ComingSoon />
    </ReportPageShell>
  )
}

export default ReporteFirmaMain