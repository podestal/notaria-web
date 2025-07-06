import DetalleMediosDePagoBody from "./DetalleMediosDePagoBody"
import DetalleMediosDePagoHeader from "./DetalleMediosDePagoHeader"

interface Props {
    itemmp: string
}

const DetalleMediosDePagoTable = ({ itemmp }: Props) => {
  return (
    <div className="my-6">
        <DetalleMediosDePagoHeader />
        <DetalleMediosDePagoBody 
            itemmp={itemmp}
        />
    </div>
  )
}

export default DetalleMediosDePagoTable