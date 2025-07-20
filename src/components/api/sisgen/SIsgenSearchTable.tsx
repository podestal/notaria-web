import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSearchTableBody from "./SisgenSearchTableBody"
import SisgenSearchTableHeader from "./SisgenSearchTableHeader"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SIsgenSearchTable = ({ sisgenDocs }: Props) => {
  return (
    <div>
        <h2 className="my-2 font-semibold">Errores encontrados (Estos kardex no son enviados)</h2>
        <SisgenSearchTableHeader />
        {sisgenDocs.length > 0 
        ? 
        <>
            {sisgenDocs.map(doc => <SisgenSearchTableBody key={doc.idkardex} sisgenDoc={doc} />)}
        </> 
        : 
        <div className="text-center text-gray-500 p-4">
            No se encontraron documentos SISGEN.
        </div>
        }
    </div>
  )
}

export default SIsgenSearchTable