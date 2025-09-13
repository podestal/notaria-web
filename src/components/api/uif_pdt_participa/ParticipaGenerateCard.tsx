import { useState } from "react"
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    contratante: ContratantesPorActo
    detalleActo: string
}

const ParticipaGenerateCard = ({ contratante, detalleActo }: Props) => {

    const [porcentaje, setPorcentaje] = useState(contratante.porcentaje || '')
  return (
        <div 
            className="grid grid-cols-11 text-xs text-black p-2 my-2 place-content-center border-b-2 border-gray-200 text-center">
            <p className="col-span-3">{getTitleCase(detalleActo || '')}</p>
            <p className="col-span-3">{getTitleCase(contratante.cliente || '')}</p>
            <p className="col-span-2">{getTitleCase(contratante.condicion_str || '')}</p>
            <input className="text-center bg-slate-100 rounded-xl py-1" value={porcentaje} onChange={(e) => setPorcentaje(e.target.value)} />
            <p>{contratante.uif}</p>
        </div>
  )
}

export default ParticipaGenerateCard