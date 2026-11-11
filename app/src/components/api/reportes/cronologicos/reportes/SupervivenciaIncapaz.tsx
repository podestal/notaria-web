import ComingSoon from "../../../../ui/ComingSoon"

import ReportPageShell from "../../../../ui/ReportPageShell"
import ReportHeader from "../../../../ui/ReportHeader"
const SupervivenciaIncapaz = ({ embedded = false }: { embedded?: boolean } = {}) => {
  return (
    <ReportPageShell embedded={embedded}>
      {!embedded && <ReportHeader title="Supervivencia persona incapaz"/>}
        <ComingSoon />
    </ReportPageShell>
  )
}

export default SupervivenciaIncapaz