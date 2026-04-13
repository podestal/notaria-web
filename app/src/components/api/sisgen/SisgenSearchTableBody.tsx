import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSingleCard from "./SisgenSingleCard"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SisgenSearchTableBody = ({ sisgenDocs }: Props) => {

  return (
    <>
      {sisgenDocs.map((doc, idx) => <SisgenSingleCard key={doc.idkardex} sisgenDoc={doc} idx={idx + 1} />)}
    </>
  )
}
  

export default SisgenSearchTableBody