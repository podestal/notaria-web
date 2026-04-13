import { Contratante } from "../../../services/api/contratantesService"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"
import RemoveContratante from "./RemoveContratante"
import UpdateContratante from "./UpdateContratante"

interface Props {
    contratante: Contratante
    kardex: Kardex
}

const ContratanteCard = ({ contratante, kardex }: Props) => {
  return (
    <div 
        key={contratante.idcontratante}
        className="grid grid-cols-9 text-xs text-black px-2 my-2 place-content-center border-b-2 border-gray-200">
        <p className="col-span-2">{getTitleCase(contratante.cliente)}</p>
        <p className="col-span-2">{getTitleCase(contratante.condicion_str)}</p>
        <p className="pl-2">{contratante.firma === '1' ? 'Si' : 'No'}</p>
        <p className="pl-2">{contratante.fechafirma}</p>
        <p className="pl-2">{kardex.usuario ? getTitleCase(kardex.usuario) : ''}</p>
        <p></p>
        <div className="flex items-start justify-start gap-2 pl-4">
        <RemoveContratante 
            contratanteId={contratante.idcontratante}
            kardex={contratante.kardex}
        />
        <p>|</p>
        <UpdateContratante 
            idtipoacto={kardex.codactos}
            idtipkar={kardex.idtipkar}
            kardex={kardex.kardex}
            contratante={contratante}
        />
        </div>
    </div>
  )
}

export default ContratanteCard