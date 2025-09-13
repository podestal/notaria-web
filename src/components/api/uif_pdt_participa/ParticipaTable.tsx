import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaTableBody from "./ParticipaTableBody"
import ParticipaTableHeader from "./ParticipaTableHeader"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
}

const ParticipaTable = ({ contratantes, detalleActo, monto }: Props) => {

  console.log('contratantes', contratantes)
  console.log('detalleActo', detalleActo)
  console.log('monto', monto)

  return (
    <>
        <ParticipaTableHeader />
        <ParticipaTableBody 
            contratantes={contratantes}
            detalleActo={detalleActo}
            monto={monto}
        />
    </>
  )
}

export default ParticipaTable