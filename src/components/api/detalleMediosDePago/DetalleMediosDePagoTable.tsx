import DetalleMediosDePagoBody from "./DetalleMediosDePagoBody"
import DetalleMediosDePagoHeader from "./DetalleMediosDePagoHeader"

const DetalleMediosDePagoTable = () => {
  return (
    <div className="my-6">
        <DetalleMediosDePagoHeader />
        <DetalleMediosDePagoBody />
    </div>
  )
}

export default DetalleMediosDePagoTable