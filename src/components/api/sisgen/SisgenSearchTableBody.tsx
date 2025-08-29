import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}

const SisgenSearchTableBody = ({ sisgenDoc, idx }: Props) => {
  return (
    <div key={sisgenDoc.idkardex} className="grid grid-cols-6 gap-4 p-2 border-b text-xs align-middle">
        <p>{idx}</p>
        <p className="col-span-2">{sisgenDoc.kardex}</p>
        <p>{getTitleCase(sisgenDoc.contrato)}</p>
        <p>{sisgenDoc.estado_sisgen}</p>
        <button className="bg-amber-500 w-[100px] text-white px-4 py-1 rounded-md cursor-pointer hover:bg-amber-600 transition-all duration-300">
          Enviar
        </button>
    </div>
  )
}
  

export default SisgenSearchTableBody