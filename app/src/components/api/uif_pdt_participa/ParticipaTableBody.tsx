import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import ParticipaGenerateCard from "./ParticipaGenerateCard"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
    monto?: string
    kardex: string
}

const ParticipaTableBody = ({ contratantes, detalleActo, monto, kardex }: Props) => {

  console.log('contratantes from participa', contratantes)
  console.log('detalleActo from participa', detalleActo)
  return (
    <>
    {contratantes.length > 0 ? 
    contratantes.map((contratante) => (
        <ParticipaGenerateCard 
          key={contratante.idcontratante} 
          contratante={contratante} 
          detalleActo={detalleActo} 
          monto={monto} 
          kardex={kardex} 
        />
    ))
    :
    <p className="text-md text-center my-2 text-xs text-gray-500">No hay contratantes participantes</p>
    }
    </>
  )
}

export default ParticipaTableBody