import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    contratantes: ContratantesPorActo[]
    detalleActo: string
}

const ParticipaTableBody = ({ contratantes, detalleActo }: Props) => {
  return (
    <>
    {contratantes.map((contratante) => (
        <div 
            key={contratante.idcontratante}
            className="grid grid-cols-11 text-xs text-black p-2 my-2 place-content-center border-b-2 border-gray-200 text-center">
            <p className="col-span-3">{getTitleCase(detalleActo || '')}</p>
            <p className="col-span-3">{getTitleCase(contratante.cliente || '')}</p>
            <p className="col-span-2">{getTitleCase(contratante.condicion_str || '')}</p>
            <p>{contratante.porcentaje}</p>
            <p>{contratante.uif}</p>

        </div>
    ))}
    </>
  )
}

export default ParticipaTableBody