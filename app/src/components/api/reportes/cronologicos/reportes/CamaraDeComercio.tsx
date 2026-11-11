import ComingSoon from "../../../../ui/ComingSoon"

import ReportPageShell from "../../../../ui/ReportPageShell"
import ReportHeader from "../../../../ui/ReportHeader"
const CamaraDeComercio = ({ embedded = false }: { embedded?: boolean } = {}) => {
  return (
    <ReportPageShell embedded={embedded}>
      {!embedded && <ReportHeader title="Cámara de Comercio"/>}
        <ComingSoon />
    </ReportPageShell>
  )
}

export default CamaraDeComercio