import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}

const SisgenBookCard = ({ sisgenDoc, idx }: Props) => {
  return (
    <div className="grid grid-cols-8 gap-4 p-2 border-b text-xs align-middle">
        <p>{idx}</p>
        <p>{sisgenDoc.numescritura}</p>
        <p>{sisgenDoc.tipoPersona}</p>
        <p>{sisgenDoc.ruc}</p>
        <p>{getTitleCase(sisgenDoc.empresa || '')}</p>
        <p>{getTitleCase(sisgenDoc.descripcionTipoLibro || '')}</p>
        <p>{getTitleCase(sisgenDoc.estadoSisgen || '')}</p>
    </div>
  )
}

export default SisgenBookCard