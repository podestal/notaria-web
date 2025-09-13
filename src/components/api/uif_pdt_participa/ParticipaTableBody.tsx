import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaGenerateCard from "./ParticipaGenerateCard"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
}

const ParticipaTableBody = ({ contratantes, detalleActo, monto }: Props) => {

  return (
    <>
    {contratantes.map((contratante) => (
        <ParticipaGenerateCard key={contratante.idcontratante} contratante={contratante} detalleActo={detalleActo} monto={monto} />
    ))}
    </>
  )
}

export default ParticipaTableBody