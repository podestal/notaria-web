import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSingleCard from "./SisgenSingleCard"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SisgenSearchTableBody = ({ sisgenDocs }: Props) => {

  return (
    <>
       {sisgenDocs.length > 0 
       ? 
       <>
          {sisgenDocs.map((doc, idx) => <SisgenSingleCard key={doc.idkardex} sisgenDoc={doc} idx={idx + 1} />)}
       </>
       :
       <div className="text-center text-gray-500 p-4">No se encontraron documentos SISGEN.</div>}
    </>
  )
}
  

export default SisgenSearchTableBody