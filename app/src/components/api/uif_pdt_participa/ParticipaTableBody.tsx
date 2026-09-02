import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaGenerateCard from "./ParticipaGenerateCard"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
    kardex: string
}

const ParticipaTableBody = ({ contratantes, detalleActo, monto, kardex }: Props) => {

  if (contratantes.length === 0) {
    return (
        <p className="text-center text-xs text-gray-500 my-4">
            No hay contratantes participantes
        </p>
    )
  }

  return (
    <>
        {contratantes.map((contratante) => (
            <ParticipaGenerateCard 
                key={`${contratante.idcontratante}-${contratante.porcentaje}-${contratante.monto}`}
                contratante={contratante} 
                detalleActo={detalleActo} 
                monto={monto} 
                kardex={kardex} 
            />
        ))}
    </>
  )
}

export default ParticipaTableBody
