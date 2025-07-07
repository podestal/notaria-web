import { Patrimonial } from "../../../services/api/patrimonialService"
import DetalleMediosDePagoBody from "./DetalleMediosDePagoBody"
import DetalleMediosDePagoHeader from "./DetalleMediosDePagoHeader"

interface Props {
    patrimonial: Patrimonial
}

const DetalleMediosDePagoTable = ({ patrimonial }: Props) => {
  return (
    <div className="my-6">
        <DetalleMediosDePagoHeader />
        <DetalleMediosDePagoBody 
            patrimonial={patrimonial}
        />
    </div>
  )
}

export default DetalleMediosDePagoTable