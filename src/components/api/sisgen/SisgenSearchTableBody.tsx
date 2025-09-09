import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSingleCard from "./SisgenSingleCard"

interface Props {
    sisgenDocs: SISGENDocument[]
    noDocsMessage: string
}

const SisgenSearchTableBody = ({ sisgenDocs, noDocsMessage }: Props) => {

  return (
    <>
       {sisgenDocs.length > 0 
       ? 
       <>
          {sisgenDocs.map((doc, idx) => <SisgenSingleCard key={doc.idkardex} sisgenDoc={doc} idx={idx + 1} />)}
       </>
       :
       <div className="text-center text-gray-500 p-4">{noDocsMessage}</div>}
    </>
  )
}
  

export default SisgenSearchTableBody