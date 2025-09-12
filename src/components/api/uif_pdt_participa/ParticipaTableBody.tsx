import { Contratante } from "../../../services/api/contratantesService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    contratantes: Contratante[]
    detalleActo: string
}

const ParticipaTableBody = ({ contratantes, detalleActo }: Props) => {
  return (
    <>
    {contratantes.map((contratante) => (
        <div 
            key={contratante.idcontratante}
            className="grid grid-cols-9 text-xs text-black px-2 my-2 place-content-center border-b-2 border-gray-200">
            <p className="col-span-2">{getTitleCase(detalleActo || '')}</p>
            <p className="col-span-3">{getTitleCase(contratante.cliente || '')}</p>
            <p className="col-span-2">{getTitleCase(contratante.condicion_str || '')}</p>
            {/* <p className="col-span-2">{contratante.porcentaje}</p>
            <p className="col-span-2">{contratante.uif}</p>
            <p className="col-span-2">{contratante.renta}</p> */}
        </div>
    ))}
    </>
  )
}

export default ParticipaTableBody