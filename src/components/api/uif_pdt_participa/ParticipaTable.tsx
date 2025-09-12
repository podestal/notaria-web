import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaTableBody from "./ParticipaTableBody"
import ParticipaTableHeader from "./ParticipaTableHeader"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
}

const ParticipaTable = ({ contratantes, detalleActo }: Props) => {

  console.log('contratantes', contratantes)

  return (
    <>
        <ParticipaTableHeader />
        <ParticipaTableBody 
            contratantes={contratantes}
            detalleActo={detalleActo}
        />
    </>
  )
}

export default ParticipaTable