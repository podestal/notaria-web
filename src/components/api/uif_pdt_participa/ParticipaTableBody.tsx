import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaGenerateCard from "./ParticipaGenerateCard"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
}

const ParticipaTableBody = ({ contratantes, detalleActo }: Props) => {

  return (
    <>
    {contratantes.map((contratante) => (
        <ParticipaGenerateCard key={contratante.idcontratante} contratante={contratante} detalleActo={detalleActo} />
    ))}
    </>
  )
}

export default ParticipaTableBody