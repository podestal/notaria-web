import ComingSoon from "../../../../ui/ComingSoon"

import ReportPageShell from "../../../../ui/ReportPageShell"
import ReportHeader from "../../../../ui/ReportHeader"
const Protestos = ({ embedded = false }: { embedded?: boolean } = {}) => {
  return (
    <ReportPageShell embedded={embedded}>
      {!embedded && <ReportHeader title="Protestos"/>}
        <ComingSoon />
    </ReportPageShell>
  )
}

export default Protestos