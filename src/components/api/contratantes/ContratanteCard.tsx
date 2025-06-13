import { Pencil } from "lucide-react"
import { Contratante } from "../../../services/api/contratantesService"
import getTitleCase from "../../../utils/getTitleCase"
import RemoveContratante from "./RemoveContratante"

interface Props {
    contratante: Contratante
    kardexUsuario: string
}

const ContratanteCard = ({ contratante, kardexUsuario }: Props) => {
  return (
    <div 
        key={contratante.idcontratante}
        className="grid grid-cols-9 text-xs text-black px-2 my-2 place-content-center border-b-2 border-gray-200">
        <p className="col-span-2">{getTitleCase(contratante.cliente)}</p>
        <p className="col-span-2">{getTitleCase(contratante.condicion)}</p>
        <p className="pl-2">{contratante.firma === '1' ? 'Si' : 'No'}</p>
        <p className="pl-2">{contratante.fechafirma}</p>
        <p className="pl-2">{getTitleCase(kardexUsuario)}</p>
        <p></p>
        <div className="flex items-start justify-start gap-2 pl-4">
        <RemoveContratante 
            contratanteId={contratante.idcontratante}
            kardex={contratante.kardex}
        />
            <p>|</p>
            <Pencil 
                size={20}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
            />
        </div>
    </div>
  )
}

export default ContratanteCard