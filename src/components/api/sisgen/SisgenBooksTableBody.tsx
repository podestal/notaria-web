import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenBookCard from "./SisgenBookCard"

interface Props {
    sisgenDocs: SISGENDocument[]
    noDocsMessage: string
}

const SisgenBooksTableBody = ({ sisgenDocs, noDocsMessage }: Props) => {
    console.log('sisgenDocs', sisgenDocs);
  return (
    <>
    {sisgenDocs.length > 0 
    ? 
    <>
       {sisgenDocs.map((doc, idx) => <SisgenBookCard key={doc.libro} sisgenDoc={doc} idx={idx + 1} />)}
    </>
    :
    <div className="text-center text-gray-500 p-4">{noDocsMessage}</div>}
 </>
  )
}

export default SisgenBooksTableBody