import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaTableBody from "./ParticipaTableBody"
import ParticipaTableHeader from "./ParticipaTableHeader"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
    kardex: string
}

const ParticipaTable = ({ contratantes, detalleActo, monto, kardex }: Props) => {

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
            kardex={kardex}
        />
    </>
  )
}

export default ParticipaTable