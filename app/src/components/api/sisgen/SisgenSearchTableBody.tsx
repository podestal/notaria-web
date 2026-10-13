import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSingleCard from "./SisgenSingleCard"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SisgenSearchTableBody = ({ sisgenDocs }: Props) => {

  return (
    <div className="divide-y divide-slate-100">
      {sisgenDocs.map((doc, idx) => <SisgenSingleCard key={doc.idkardex} sisgenDoc={doc} idx={idx + 1} />)}
    </div>
  )
}
  

export default SisgenSearchTableBody