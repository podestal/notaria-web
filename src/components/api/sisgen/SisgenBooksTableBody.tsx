import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenBookCard from "./SisgenBookCard"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SisgenBooksTableBody = ({ sisgenDocs }: Props) => {
    console.log('sisgenDocs', sisgenDocs);
  return (
    <>
    {sisgenDocs.length > 0 
    ? 
    <>
       {sisgenDocs.map((doc, idx) => <SisgenBookCard key={doc.idkardex} sisgenDoc={doc} idx={idx + 1} />)}
    </>
    :
    <div className="text-center text-gray-500 p-4">No se encontraron documentos SISGEN.</div>}
 </>
  )
}

export default SisgenBooksTableBody