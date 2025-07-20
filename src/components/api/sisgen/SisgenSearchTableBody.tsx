import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    sisgenDoc: SISGENDocument
}

const SisgenSearchTableBody = ({ sisgenDoc }: Props) => {
  return (
    <div key={sisgenDoc.idkardex} className="grid grid-cols-4 gap-4 p-2 border-b text-xs">
        <p className="col-span-2">{sisgenDoc.kardex}</p>
        <p>{getTitleCase(sisgenDoc.contrato)}</p>
        <p>{sisgenDoc.estado_sisgen}</p>
    </div>
  )
}
  

export default SisgenSearchTableBody